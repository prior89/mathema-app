package ai.matheo.app;

import com.android.billingclient.api.AcknowledgePurchaseParams;
import com.android.billingclient.api.BillingClient;
import com.android.billingclient.api.BillingClientStateListener;
import com.android.billingclient.api.BillingFlowParams;
import com.android.billingclient.api.BillingResult;
import com.android.billingclient.api.PendingPurchasesParams;
import com.android.billingclient.api.ProductDetails;
import com.android.billingclient.api.Purchase;
import com.android.billingclient.api.PurchasesUpdatedListener;
import com.android.billingclient.api.QueryProductDetailsParams;
import com.android.billingclient.api.QueryPurchasesParams;
import com.getcapacitor.JSArray;
import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

/**
 * BillingPlugin ??Capacitor 8 native wrapper around Play Billing Library 8.x.
 *
 *  - Subscriptions only (no one-time products on Matheo roadmap).
 *  - Acknowledge is client-side AFTER server /billing/verify returns 200.
 *    Play auto-refunds purchases not acknowledged within 3 days, so the JS
 *    layer MUST call acknowledgePurchase() once verification succeeds.
 *  - Purchase results are pushed via the 'purchaseUpdate' event (or
 *    'purchaseError'). launchBillingFlow() resolves as soon as the billing
 *    UI is shown ??actual completion is async via the listener.
 *  - PBL 8 adds enableAutoServiceReconnection() on Builder ??the BillingClient
 *    transparently re-runs startConnection() after Play services drop the
 *    socket, so ensureConnected() rarely has to retry by hand.
 */
@CapacitorPlugin(name = "Billing")
public class BillingPlugin extends Plugin {
    private static final String TAG = "BillingPlugin";
    private BillingClient billingClient;
    private boolean isConnected = false;

    private final PurchasesUpdatedListener purchaseListener = (billingResult, purchases) -> {
        if (billingResult.getResponseCode() == BillingClient.BillingResponseCode.OK && purchases != null) {
            JSArray arr = new JSArray();
            for (Purchase p : purchases) {
                arr.put(purchaseToJSObject(p));
            }
            JSObject evt = new JSObject();
            evt.put("purchases", arr);
            notifyListeners("purchaseUpdate", evt);
        } else {
            JSObject evt = new JSObject();
            evt.put("responseCode", billingResult.getResponseCode());
            evt.put("message", billingResult.getDebugMessage());
            notifyListeners("purchaseError", evt);
        }
    };

    @PluginMethod
    public void initialize(PluginCall call) {
        if (billingClient == null) {
            billingClient = BillingClient.newBuilder(getContext())
                    .setListener(purchaseListener)
                    .enableAutoServiceReconnection()
                    .enablePendingPurchases(PendingPurchasesParams.newBuilder()
                            .enableOneTimeProducts()
                            .build())
                    .build();
        }
        if (isConnected) {
            JSObject ret = new JSObject();
            ret.put("ready", true);
            call.resolve(ret);
            return;
        }
        billingClient.startConnection(new BillingClientStateListener() {
            @Override
            public void onBillingSetupFinished(BillingResult result) {
                if (result.getResponseCode() == BillingClient.BillingResponseCode.OK) {
                    isConnected = true;
                    JSObject ret = new JSObject();
                    ret.put("ready", true);
                    call.resolve(ret);
                } else {
                    call.reject(
                            "Billing setup failed: " + result.getDebugMessage(),
                            String.valueOf(result.getResponseCode()));
                }
            }

            @Override
            public void onBillingServiceDisconnected() {
                isConnected = false;
            }
        });
    }

    /**
     * Returns:
     *   { products: [{ productId, title, description,
     *                  offers: [{ offerToken, basePlanId, offerId,
     *                             pricingPhases: [{ priceFormatted,
     *                                               priceAmountMicros,
     *                                               currencyCode,
     *                                               billingPeriod,
     *                                               recurrenceMode,
     *                                               billingCycleCount }] }] }] }
     */
    @PluginMethod
    public void queryProductDetails(PluginCall call) {
        ensureConnected(call, () -> {
            JSArray productIds = call.getArray("productIds");
            if (productIds == null || productIds.length() == 0) {
                call.reject("productIds required");
                return;
            }
            List<QueryProductDetailsParams.Product> productList = new ArrayList<>();
            for (int i = 0; i < productIds.length(); i++) {
                try {
                    productList.add(QueryProductDetailsParams.Product.newBuilder()
                            .setProductId(productIds.getString(i))
                            .setProductType(BillingClient.ProductType.SUBS)
                            .build());
                } catch (org.json.JSONException ignored) {
                    // skip bad entry ??partial result still useful
                }
            }
            QueryProductDetailsParams params = QueryProductDetailsParams.newBuilder()
                    .setProductList(productList)
                    .build();
            // PBL 8: ProductDetailsResponseListener returns QueryProductDetailsResult
            // instead of List<ProductDetails>. .getProductDetailsList() pulls out the
            // matched products; .getUnfetchedProductList() (not used) carries the rest.
            billingClient.queryProductDetailsAsync(params, (billingResult, result) -> {
                if (billingResult.getResponseCode() != BillingClient.BillingResponseCode.OK) {
                    call.reject("queryProductDetails failed: " + billingResult.getDebugMessage());
                    return;
                }
                JSArray prodArr = new JSArray();
                for (ProductDetails pd : result.getProductDetailsList()) {
                    JSObject prod = new JSObject();
                    prod.put("productId", pd.getProductId());
                    prod.put("title", pd.getTitle());
                    prod.put("description", pd.getDescription());
                    JSArray offers = new JSArray();
                    if (pd.getSubscriptionOfferDetails() != null) {
                        for (ProductDetails.SubscriptionOfferDetails od : pd.getSubscriptionOfferDetails()) {
                            JSObject offer = new JSObject();
                            offer.put("offerToken", od.getOfferToken());
                            offer.put("basePlanId", od.getBasePlanId());
                            offer.put("offerId", od.getOfferId());
                            JSArray phases = new JSArray();
                            for (ProductDetails.PricingPhase ph : od.getPricingPhases().getPricingPhaseList()) {
                                JSObject phase = new JSObject();
                                phase.put("priceFormatted", ph.getFormattedPrice());
                                // priceAmountMicros is a long ??serialize as string to keep precision.
                                phase.put("priceAmountMicros", String.valueOf(ph.getPriceAmountMicros()));
                                phase.put("currencyCode", ph.getPriceCurrencyCode());
                                phase.put("billingPeriod", ph.getBillingPeriod());
                                phase.put("recurrenceMode", ph.getRecurrenceMode());
                                phase.put("billingCycleCount", ph.getBillingCycleCount());
                                phases.put(phase);
                            }
                            offer.put("pricingPhases", phases);
                            offers.put(offer);
                        }
                    }
                    prod.put("offers", offers);
                    prodArr.put(prod);
                }
                JSObject ret = new JSObject();
                ret.put("products", prodArr);
                call.resolve(ret);
            });
        });
    }

    /**
     * Launches the billing flow. Input: { productId, offerToken,
     * obfuscatedAccountId? }. Resolves once the billing UI is up; the actual
     * purchase result fires later via the 'purchaseUpdate' / 'purchaseError'
     * event.
     */
    @PluginMethod
    public void launchBillingFlow(PluginCall call) {
        ensureConnected(call, () -> {
            String productId = call.getString("productId");
            String offerToken = call.getString("offerToken");
            String obfuscatedAccountId = call.getString("obfuscatedAccountId");
            if (productId == null || offerToken == null) {
                call.reject("productId and offerToken required");
                return;
            }
            // Re-query ProductDetails ??BillingFlowParams requires a live reference.
            QueryProductDetailsParams qp = QueryProductDetailsParams.newBuilder()
                    .setProductList(Arrays.asList(
                            QueryProductDetailsParams.Product.newBuilder()
                                    .setProductId(productId)
                                    .setProductType(BillingClient.ProductType.SUBS)
                                    .build()))
                    .build();
            billingClient.queryProductDetailsAsync(qp, (br, result) -> {
                List<ProductDetails> details = result.getProductDetailsList();
                if (br.getResponseCode() != BillingClient.BillingResponseCode.OK || details.isEmpty()) {
                    call.reject("queryProductDetails for buy failed: " + br.getDebugMessage());
                    return;
                }
                ProductDetails pd = details.get(0);
                BillingFlowParams.ProductDetailsParams pdp = BillingFlowParams.ProductDetailsParams.newBuilder()
                        .setProductDetails(pd)
                        .setOfferToken(offerToken)
                        .build();
                BillingFlowParams.Builder flowBuilder = BillingFlowParams.newBuilder()
                        .setProductDetailsParamsList(Arrays.asList(pdp));
                if (obfuscatedAccountId != null && !obfuscatedAccountId.isEmpty()) {
                    flowBuilder.setObfuscatedAccountId(obfuscatedAccountId);
                }
                BillingFlowParams flow = flowBuilder.build();
                getActivity().runOnUiThread(() -> {
                    BillingResult br2 = billingClient.launchBillingFlow(getActivity(), flow);
                    if (br2.getResponseCode() != BillingClient.BillingResponseCode.OK) {
                        call.reject("launchBillingFlow failed: " + br2.getDebugMessage());
                    } else {
                        JSObject ret = new JSObject();
                        ret.put("launched", true);
                        call.resolve(ret);
                    }
                });
            });
        });
    }

    /**
     * Acknowledge a purchase. MUST be called within 3 days of purchase or Play
     * auto-refunds the user. Should run AFTER /billing/verify returns 200.
     */
    @PluginMethod
    public void acknowledgePurchase(PluginCall call) {
        ensureConnected(call, () -> {
            String token = call.getString("purchaseToken");
            if (token == null) {
                call.reject("purchaseToken required");
                return;
            }
            AcknowledgePurchaseParams params = AcknowledgePurchaseParams.newBuilder()
                    .setPurchaseToken(token)
                    .build();
            billingClient.acknowledgePurchase(params, br -> {
                if (br.getResponseCode() == BillingClient.BillingResponseCode.OK) {
                    JSObject ret = new JSObject();
                    ret.put("acknowledged", true);
                    call.resolve(ret);
                } else {
                    call.reject("acknowledgePurchase failed: " + br.getDebugMessage());
                }
            });
        });
    }

    /**
     * Restore ??query active SUBS purchases for the current Google account.
     * Result: { purchases: [{ productId, purchaseToken, orderId,
     *                         purchaseState, acknowledged, purchaseTimeMs }] }
     */
    @PluginMethod
    public void restorePurchases(PluginCall call) {
        ensureConnected(call, () -> {
            QueryPurchasesParams qp = QueryPurchasesParams.newBuilder()
                    .setProductType(BillingClient.ProductType.SUBS)
                    .build();
            billingClient.queryPurchasesAsync(qp, (br, list) -> {
                if (br.getResponseCode() != BillingClient.BillingResponseCode.OK) {
                    call.reject("queryPurchases failed: " + br.getDebugMessage());
                    return;
                }
                JSArray arr = new JSArray();
                for (Purchase p : list) {
                    arr.put(purchaseToJSObject(p));
                }
                JSObject ret = new JSObject();
                ret.put("purchases", arr);
                call.resolve(ret);
            });
        });
    }

    private JSObject purchaseToJSObject(Purchase p) {
        JSObject o = new JSObject();
        JSArray ids = new JSArray();
        for (String id : p.getProducts()) ids.put(id);
        o.put("productId", p.getProducts().isEmpty() ? "" : p.getProducts().get(0));
        o.put("productIds", ids);
        o.put("purchaseToken", p.getPurchaseToken());
        o.put("orderId", p.getOrderId());
        o.put("purchaseState", p.getPurchaseState()); // 0=unspecified, 1=purchased, 2=pending
        o.put("acknowledged", p.isAcknowledged());
        o.put("purchaseTimeMs", p.getPurchaseTime());
        return o;
    }

    private void ensureConnected(PluginCall call, Runnable then) {
        if (isConnected) {
            then.run();
            return;
        }
        if (billingClient == null) {
            call.reject("BillingPlugin not initialized ??call initialize() first");
            return;
        }
        billingClient.startConnection(new BillingClientStateListener() {
            @Override
            public void onBillingSetupFinished(BillingResult result) {
                if (result.getResponseCode() == BillingClient.BillingResponseCode.OK) {
                    isConnected = true;
                    then.run();
                } else {
                    call.reject("Billing reconnect failed: " + result.getDebugMessage());
                }
            }

            @Override
            public void onBillingServiceDisconnected() {
                isConnected = false;
            }
        });
    }
}
