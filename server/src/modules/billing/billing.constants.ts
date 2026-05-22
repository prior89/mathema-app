/**
 * Billing constants — kept in their own file so neither billing.service.ts
 * nor free-tier-solver-quota.guard.ts has to import each other just to read
 * a number. The previous arrangement (`FREE_TIER_SOLVER_LIMIT` exported
 * from the guard, imported by the service) was a constant-only cycle that
 * tsc happily compiled but Nest's reflect-metadata couldn't always resolve
 * at module-init time — caused intermittent `Nest can't resolve dependencies
 * of FreeTierSolverQuotaGuard (?, QuotaService)` crashes whenever the build
 * cache happened to evaluate the guard before the service.
 *
 * Keep this file dependency-free.
 */

/** Free-tier daily AI Solver call cap. Premium users bypass. Keep in sync
 *  with the pricing memory (`project_matheo_pricing_india`). */
export const FREE_TIER_SOLVER_LIMIT = 8;
