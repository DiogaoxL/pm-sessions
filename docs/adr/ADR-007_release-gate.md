# ADR-001: Release Gate Automation

## Context

Homologation and regression checks were previously done manually, introducing risks of human error and late detection of bugs.

## Decision

We implement a unified, automated Release Gate command (`pnpm audit:release`) which:

1. Executes unit, integration, and concurrency tests.
2. Checks schemas and RPC signatures against remote Supabase instance metadata.
3. Benchmarks performance.
4. Generates an objective maturity score and logs the results.

## Consequences

- No releases can go to production without a successful gate run.
- Regressions are caught automatically in less than 5 minutes.
