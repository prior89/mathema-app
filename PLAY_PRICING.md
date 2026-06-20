# Matheo Premium Pricing

Last updated: 2026-06-20

This is the source of truth for Google Play Console subscription prices.
The app does not hardcode production prices; `PaywallPage` renders the
`ProductDetails` returned by Google Play Billing. After any Play Console
price edit, verify the license-tester paywall shows the same local prices.

Google Play can generate local prices from exchange rates and local pricing
patterns, but this launch table should be entered manually for the countries
below so the product strategy stays intentional.

Official references:

- Google Play Console Help: <https://support.google.com/googleplay/android-developer/answer/6334373>
- Android Developers, subscription price changes: <https://developer.android.com/google/play/billing/price-changes>

## Launch Policy

- Keep Premium broad at launch: no graph-specific credit cap or separate
  high-cost solver bucket.
- Free users get the first 5 chapter-learning problems. Premium Preview and
  Premium open the full 20-problem chapter set.
- Free AI Solver remains quota-gated at 8 solves per day after the launch
  grace period. The current server grace is 16 solves per day for the first
  7 days after signup.
- Premium includes AI Solver, full mastery sets, adaptive practice,
  wrong-note AI analysis, and weekly reports, subject only to abuse and
  service-protection safeguards.
- Do not enable a Google Play free-trial or introductory-price offer unless
  the offer is deliberately launched and the Terms/listing copy is updated.
  The 3-day `premium_preview_3d` experience is a cardless in-app entitlement,
  not a Play Billing trial and not an auto-renewing offer.

## Base Plans

| Product ID | Base plan | Billing period | Pricing intent |
|---|---|---:|---|
| `premium_monthly` | `monthly` | P1M | Main public monthly subscription |
| `premium_yearly` | `yearly` | P1Y | About 10 monthly payments, shown as annual savings in the paywall |

## 5-Country Launch Price Table

Enter these manually in Play Console for both base plans.

| Country / region | Play country code | Currency | Monthly price | Yearly price | Note |
|---|---:|---:|---:|---:|---|
| South Korea | KR | KRW | 9,900 | 99,000 | Anchor price requested for the Korean launch |
| India | IN | INR | 399 | 3,999 | Local launch price below direct KRW parity |
| Indonesia | ID | IDR | 69,000 | 690,000 | SEA expansion placeholder; enable distribution only after review |
| Vietnam | VN | VND | 149,000 | 1,490,000 | SEA expansion placeholder; enable distribution only after review |
| United Arab Emirates | AE | AED | 24.99 | 249.99 | Gulf expansion placeholder; enable distribution only after review |

For countries not in this table, use Google Play's generated local prices as
a starting point, then review manually before enabling distribution.
If Play Console only accepts a nearby price tier in a market, choose the
nearest supported tier and update this file before G1 sign-off.

## Play Console Checklist

1. Go to **Monetize -> Products -> Subscriptions**.
2. Open `premium_monthly` and set the active base-plan price for KR, IN, ID,
   VN, and AE from the table above.
3. Open `premium_yearly` and set the active base-plan price for the same
   countries.
4. Confirm there is no active Play free-trial or introductory-price offer.
5. Install the Internal Testing build as a license tester and confirm the
   paywall renders the local monthly/yearly prices from Google Play.
