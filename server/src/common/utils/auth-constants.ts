/**
 * Auth-wide tuning constants.
 *
 * BCRYPT_COST — OWASP 2025 recommended work factor. Each +1 doubles hash time.
 * 12 takes ~250ms on commodity backend hardware; acceptable for register/login
 * latency, prohibitive for brute-force at scale.
 */
export const BCRYPT_COST = 12;
