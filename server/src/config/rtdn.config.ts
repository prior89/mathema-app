import { registerAs } from '@nestjs/config';

/**
 * Google Play RTDN (Real-Time Developer Notifications) — Pub/Sub push auth.
 *
 *  - `audience`: the OIDC token `aud` claim. Operator configures Pub/Sub push
 *    subscription with this audience (typically the public URL of the RTDN
 *    endpoint, e.g. https://.../api/v1/billing/rtdn).
 *  - `serviceAccountEmail`: the GCP service account Pub/Sub uses to sign the
 *    OIDC token. RtdnService requires the verified token's `email` claim to
 *    match this value when set.
 *
 * Both values empty by default — the endpoint refuses every request until
 * the operator wires Pub/Sub up.
 */
export default registerAs('rtdn', () => ({
  audience: process.env.RTDN_AUDIENCE ?? '',
  serviceAccountEmail: process.env.RTDN_SERVICE_ACCOUNT_EMAIL ?? '',
}));
