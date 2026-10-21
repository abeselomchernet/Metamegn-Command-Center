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
- **5-Class Reconciliation Engine**: Complete matching engine (`src/domain/reconciliation.ts`) classifying transactions into:
  1. `matched`
  2. `missing_at_provider`
  3. `missing_at_till`
  4. `amount_mismatch`
  5. `duplicate`
- **Architectural Seam**: Added `EventSourceAdapter` interface and `MockAdapter` implementation; zero presentation code accesses mock data directly.
- **Offline Queue Simulator**: Local indexed queue (`src/data/offlineQueue.ts`) for disconnected POS captures with duplicate collision detection and batch replay.
- **Mobile-First POS State Machine**: Refactored cashier flow into a 360px-ready state machine (`amount` -> `method` -> `pending` -> `recorded` -> `failed`). Captures display *"Recorded, awaiting provider report"* until matched.
- **Role Permissions & Route Guards**: Enforced permissions map (`src/domain/permissions.ts`) for Cashier, Supervisor, and Operations Manager with dedicated `RouteGuard` wrappers.
- **Role Switcher Label**: Explicitly labeled *"Demo role switcher, no authentication"*.
- **Append-Only Audit Log**: In-memory immutable audit log recording voids, exception triage overrides, shift handovers, and offline replays.
- **Shift Variance Accounting**: Cash register count reconciliation comparing physical drawer count against expected cash without moving funds.
- **Internationalization (i18n)**: English (default), Amharic (`am`), and Afaan Oromoo (`om`) with dynamic font switching and Ethiopic script support.
- **Vitest Unit Test Suite**: Comprehensive tests covering money math, role permissions, all 5 reconciliation classes, capture state machine, and offline replay.
- **Documentation**: Added `README.md` (with presentation guide), `docs/ADAPTER.md` (4 prerequisite gates), and updated `metadata.json`.

### Removed
- **Decommissioned Payouts & Transfers**: Removed all payout buttons, transfers, and balances implying custody from the former Settlements page.
- **Purged Proprietary Brand Names**: Removed all brand logos and proprietary names (Telebirr, M-Pesa, Chapa, CBE); replaced with neutral schema designations (*Wallet Rail A*, *Bank Rail B*, *Interoperable QR*, *Card Tap (SoftPOS-style)*, *Cash*).
- **Eliminated Floating-Point Rounding**: Removed plain number arithmetic for money.
- **Removed Random Generators**: Purged all instances of `Math.random()` in data rendering; replaced with deterministic Mulberry32 PRNG.
- **Housekeeping**: Removed duplicate `LiveTransactionFeed.tsx` and stray `pages/index.html`. Confirmed `.env.local` is gitignored with zero API keys in client code.
