package ai.matheo.app;

import android.os.CancellationSignal;
import android.util.Log;

import androidx.annotation.NonNull;
import androidx.credentials.Credential;
import androidx.credentials.ClearCredentialStateRequest;
import androidx.credentials.CredentialManager;
import androidx.credentials.CredentialManagerCallback;
import androidx.credentials.CustomCredential;
import androidx.credentials.GetCredentialRequest;
import androidx.credentials.GetCredentialResponse;
import androidx.credentials.exceptions.GetCredentialCancellationException;
import androidx.credentials.exceptions.GetCredentialException;
import androidx.credentials.exceptions.NoCredentialException;
import androidx.credentials.exceptions.ClearCredentialException;

import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;
import com.google.android.libraries.identity.googleid.GetSignInWithGoogleOption;
import com.google.android.libraries.identity.googleid.GoogleIdTokenCredential;

import java.util.concurrent.Executor;
import java.util.concurrent.Executors;

@CapacitorPlugin(name = "GoogleAuth")
public class GoogleAuthPlugin extends Plugin {
    private static final String TAG = "GoogleAuthPlugin";

    private final Executor executor = Executors.newSingleThreadExecutor();
    private CredentialManager credentialManager;

    @PluginMethod
    public void isAvailable(PluginCall call) {
        JSObject ret = new JSObject();
        ret.put("available", hasClientId());
        call.resolve(ret);
    }

    @PluginMethod
    public void signIn(PluginCall call) {
        if (!hasClientId()) {
            call.reject("Google OAuth web client ID is not configured in the Android bundle.");
            return;
        }
        if (getActivity() == null) {
            call.reject("Android activity is not ready.");
            return;
        }

        if (credentialManager == null) {
            credentialManager = CredentialManager.create(getContext());
        }

        String nonce = call.getString("nonce");
        if (nonce == null || nonce.length() < 32 || nonce.length() > 128) {
            call.reject("A secure Google sign-in nonce is required.", "GOOGLE_NONCE_INVALID");
            return;
        }

        GetSignInWithGoogleOption googleOption =
            new GetSignInWithGoogleOption.Builder(BuildConfig.GOOGLE_WEB_CLIENT_ID)
                .setNonce(nonce)
                .build();
        GetCredentialRequest request = new GetCredentialRequest.Builder()
            .addCredentialOption(googleOption)
            .build();

        getActivity().runOnUiThread(() ->
            credentialManager.getCredentialAsync(
                getActivity(),
                request,
                new CancellationSignal(),
                executor,
                new CredentialManagerCallback<GetCredentialResponse, GetCredentialException>() {
                    @Override
                    public void onResult(GetCredentialResponse result) {
                        handleCredentialResult(call, result);
                    }

                    @Override
                    public void onError(@NonNull GetCredentialException e) {
                        Log.i(TAG, "Google sign-in was not completed", e);
                        if (e instanceof GetCredentialCancellationException) {
                            call.reject(
                                "Google sign-in was cancelled.",
                                "GOOGLE_SIGN_IN_CANCELLED"
                            );
                            return;
                        }
                        if (e instanceof NoCredentialException) {
                            call.reject(
                                "No Google account is available. Add a Google account to this device, then try again.",
                                "GOOGLE_NO_CREDENTIAL"
                            );
                            return;
                        }
                        call.reject(
                            "Google sign-in could not start. Check Google Play services, then try again.",
                            "GOOGLE_SIGN_IN_FAILED"
                        );
                    }
                }
            )
        );
    }

    /** Notify every Android credential provider that the app user explicitly
     * signed out. Without this, Credential Manager can keep prioritizing the
     * previous account on the next sign-in attempt. */
    @PluginMethod
    public void clearCredentialState(PluginCall call) {
        if (credentialManager == null) {
            credentialManager = CredentialManager.create(getContext());
        }

        credentialManager.clearCredentialStateAsync(
            new ClearCredentialStateRequest(),
            new CancellationSignal(),
            executor,
            new CredentialManagerCallback<Void, ClearCredentialException>() {
                @Override
                public void onResult(Void result) {
                    call.resolve();
                }

                @Override
                public void onError(@NonNull ClearCredentialException e) {
                    Log.w(TAG, "Could not clear Android credential state", e);
                    call.reject(
                        "Could not clear Google credential state.",
                        "GOOGLE_CREDENTIAL_CLEAR_FAILED"
                    );
                }
            }
        );
    }

    private void handleCredentialResult(PluginCall call, GetCredentialResponse result) {
        Credential credential = result.getCredential();
        if (!(credential instanceof CustomCredential)) {
            call.reject("Unexpected credential type.");
            return;
        }

        CustomCredential customCredential = (CustomCredential) credential;
        if (!GoogleIdTokenCredential.TYPE_GOOGLE_ID_TOKEN_CREDENTIAL.equals(customCredential.getType())) {
            call.reject("Unexpected Google credential type.");
            return;
        }

        try {
            GoogleIdTokenCredential googleCredential =
                GoogleIdTokenCredential.createFrom(customCredential.getData());
            JSObject ret = new JSObject();
            ret.put("idToken", googleCredential.getIdToken());
            call.resolve(ret);
        } catch (RuntimeException e) {
            Log.e(TAG, "Received an invalid Google ID token response", e);
            call.reject("Invalid Google ID token response.");
        }
    }

    private boolean hasClientId() {
        return BuildConfig.GOOGLE_WEB_CLIENT_ID != null
            && !BuildConfig.GOOGLE_WEB_CLIENT_ID.trim().isEmpty();
    }
}
