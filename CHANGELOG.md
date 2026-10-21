# Changelog: Metamegn Command Center v2

All notable changes to the Metamegn illustration codebase are documented here.

---

## [2.0.0] - 2026-10-21: Independent Acceptance 360 Illustration

### Added
- **Permanent Universal Notices**:
  - Sticky top demo banner: `"Demo data, no live payments"` on every route.
  - Sticky footer disclaimer: `"Independent public-source illustration. Not a PSS system. No PSS, bank or merchant data. Sample data only."` on every route.
- **Evidence-Status Chips**: Integrated `EvidenceChip` primitive across every screen, metric, and table (`Sample data`, `Assumption`, `Not tested`, `Needs approval`). Nothing is ever marked "Verified" or "Live".
- **Integer Minor Units (ETB Cents)**: Complete money domain (`src/domain/money.ts`) with safe integer arithmetic and unified tabular ETB formatting (`formatETB`), eliminating floating-point rounding errors.
- **5-Class Reconciliation Engine**: Deterministic matching engine (`src/domain/reconciliation.ts`) classifying transactions into:
  1. `matched`
  2. `missing_at_provider`
  3. `missing_at_till`
  4. `amount_mismatch`
  5. `duplicate`
- **Architectural Seam**: Added `EventSourceAdapter` interface and `MockAdapter` implementation; presentation components interact solely with the adapter seam.
- **Offline Queue Simulator**: Local queue (`src/data/offlineQueue.ts`) for disconnected POS captures using a monotonic integer counter (zero `Math.random()`), with duplicate collision detection and batch replay.
- **Mobile-First POS State Machine**: 360px-ready cashier state machine (`amount` -> `method` -> `pending` -> `recorded` -> `failed`). Captures display *"Recorded, awaiting provider report"* until matched against a statement.
- **Role Permissions & Route Guards**: Enforced permissions map (`src/domain/permissions.ts`) for Cashier, Supervisor, and Operations Manager with dedicated `RouteGuard` wrappers.
- **Role Switcher Label**: Explicitly labeled *"Demo role switcher, no authentication"*.
- **Append-Only In-Memory Audit Log**: In-memory audit trail recording voids, exception triage overrides, shift handovers, and offline replays.
- **Shift Variance Accounting**: Cash register count reconciliation comparing physical drawer count against expected cash without moving funds.
- **Neutral Rail Architecture**: Modelled rails neutrally: *Wallet Rail A*, *Bank Rail B*, *Interoperable QR* ("Hourly statement report"), *Card Tap (SoftPOS-style)*, and *Cash*.
- **Internationalization (i18n)**: English (default), Amharic (`am`), and Afaan Oromoo (`om`) with dynamic font switching and Ethiopic script support.
- **Vitest Unit Test Suite**: 18 automated tests covering money math, role permissions, all 5 reconciliation classes, capture state machine, and offline replay.
- **Documentation**: Added `README.md` (with presentation guide and `--legacy-peer-deps` install documentation) and `docs/ADAPTER.md` (prerequisite legal/technical gates; none done).
- **Package Installation**: Added `.npmrc` configuration (`legacy-peer-deps=true`) so standard `npm install` runs smoothly with React 19 dependencies.

### Removed
- **Decommissioned Payouts & Transfers**: Removed all payout buttons, transfers, and balances implying custody from the former Settlements page.
- **Purged Proprietary Brand Names**: Removed all brand logos and proprietary names (Telebirr, M-Pesa, Chapa, CBE); replaced with neutral schema designations.
- **Eliminated Floating-Point Rounding**: Replaced plain number arithmetic for money with minor unit integers.
- **Purged Math.random()**: Replaced all instances of `Math.random()` in data generation with deterministic Mulberry32 PRNG and monotonic counters.
- **Dead Code Cleanup**: Deleted dead pages (`pages/Dashboard.tsx`, `pages/EmployeeDashboard.tsx`, `pages/Employees.tsx`, `pages/Settlements.tsx`, `pages/SupervisorDashboard.tsx`), dead components (`components/MySalesSummary.tsx`, `components/QuickPayButton.tsx`, `components/StatsCard.tsx`, `components/TransactionFeed.tsx`, `components/SalesChart.tsx`), `constants.ts`, and legacy root `types.ts`.
- **Repository Hygiene**: Deleted `.aistudio/` directory from the repository and added `.aistudio/`, `.env`, and `.env.local` to `.gitignore`.
