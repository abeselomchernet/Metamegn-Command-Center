# Changelog: Metamegn Command Center

All notable changes to the Metamegn illustration codebase are documented here.

---

## [3.0.0] - 2026-10-22: Options Explorer & Strategic Methodology

### Added
- **Options Explorer Screen (`/options`)**:
  - Side-by-side presentation of five strategic options kept open under the research methodology:
    - **Option A**: Full suite (staged architecture target only if staged modules pay for themselves)
    - **Option B**: Operate + Connect first (first hypothesis to test, subject to a paying bank buyer and component reuse)
    - **Option C**: Existing-product-led (operator extends an existing acceptance product; no real product names used)
    - **Option D**: Partner-managed (adapter seam illustrates vendor integration; mandatory comparator)
    - **Option E**: No new platform (equal visual weight and structure; a legitimate outcome, not a failed programme)
  - **Fixed Notice**: *"Option B is the first hypothesis to test. No option is chosen. None can be chosen until the four proofs exist and the hard legal, security and commercial gates are passed. Hard gates override any score."*
  - **Equal 5-Column Grid**: Identical card width, layout, and visual weight across all five options with zero scoring, weights, stars, ranking, or winner badges.
  - **Current Stance & Inquiry Questions**: Structured stance and Assumption-tagged inquiry questions ("What would test it") for each option.
  - **Direct Option B Links**: Inline navigational links to `/ledger`, `/reconcile`, `/pos`, and `/shifts`; Options A, C, D, and E preserve the brief's exact "What this demo shows" copy.
  - **Two-Option Mobile Compare Selector**: Allows side-by-side comparison on mobile viewports; starts with no option pre-selected to avoid default bias.
  - **Presenter Walkthrough Tour**: Fixed-order tour (A through E, plus Proofs & Gate) using uniform neutral outline (`ring-2 ring-slate-800`), keyboard controls (`Escape` to close, Arrow keys to navigate), and screen-reader announcements (`aria-live="polite"`).
  - **What Could Change the Picture**: Panel with 5 condition sentences detailing triggers that would shift the first-tested option.
  - **Four Proofs & One Gate**: Four proof cards with status `Not started` in neutral grey, a neutral grey gate bar (*"No live pilot, procurement or capital until all four proofs exist."*), and a 5-stage strip (`Screening` -> `Feasibility gate` -> `Non-production validation` -> `Live pilot gate` -> `Scale gate`), accompanied by *"Hard gates override any score."*
  - **Complete Multilingual Support**: Translation keys in English (`en`), Amharic (`am`), and Afaan Oromoo (`om`) for all options copy, conditions, gate stages, and tour controls.
  - **Automated Vitest Suite**: Added `tests/options.test.ts` asserting data structures, non-empty fields, inquiry questions, exact wording for Options D/E/A/C, anti-bias invariants (zero score/rank keys), and cross-language translation parity.

### Fixed
- **`pages/About.tsx` Link Import**: Added missing `import { Link } from 'react-router-dom';` to prevent runtime crash on `/about`.
- **Type-Check Gate at Build**: Updated the `"build"` npm script to `"tsc --noEmit && vite build"` so TypeScript compile-time checks run before bundling.

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
