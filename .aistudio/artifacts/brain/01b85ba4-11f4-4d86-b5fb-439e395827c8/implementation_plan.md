# Metamegn Command Center v2: Independent Acceptance 360 Illustration (Approved Plan)

An independent, bank-scoped acceptance reconciliation and transaction event ledger illustration built on deterministic mock data. It investigates a research question (*"Could this work, and would a bank pay for it?"*). It is an illustration of a research question, not a proposal, and not a PSS system. No content from any external proposal document is used in the UI or documentation.

---

## User Review & Critical Decisions

> [!IMPORTANT]
> **Strict Illustration Boundaries & User Directives:**
> 1. **Purpose & Audience**: An illustration of a research question, not a proposal, and not a product or PSS system. No live or actual merchant, bank, or PSS data.
> 2. **Universal Notice Contract (From Commit 1)**:
>    - Top banner: *"Demo data, no live payments"*
>    - Permanent sticky footer: *"Independent public-source illustration. Not a PSS system. No PSS, bank or merchant data. Sample data only."*
>    - Evidence-status chips on every screen and metric: `Sample data`, `Assumption`, `Not tested`, `Needs approval`. Never "Verified" or "Live".
> 3. **Role Switcher Label**: Explicitly labelled *"Demo role switcher, no authentication"*.
> 4. **Zero Custody / Zero Payouts**: Decommission all payout buttons, transfers, and balances implying custody. Replace Settlements with **Reconciliation and Exceptions**.
> 5. **Neutral Rail Labels**: *Wallet Rail A*, *Bank Rail B*, *Interoperable QR*, *Card Tap (SoftPOS-style)*, and *Cash*. No provider or bank branding.
> 6. **Environment & Security**: Confirm `.env.local` is gitignored and zero API keys are stored or referenced in client code.
> 7. **Landing View & Language**: Default landing view is the **Reconciliation Summary**; default interface language is **English** (with instant switching to Amharic and Afaan Oromoo).
> 8. **Metric Renaming**: Use **"Match rate"** (never "Reconciliation SLA rate").
> 9. **Step Reporting**: After every sub-step and feature step, explicitly report **"What changed"** and **"What we did not do"**.
> 10. **Definition of Done**: Conclude with a rigorous pass/fail verification checklist including a dedicated *"Tests pass"* line.

---

## 1. Overview & Core Concept

- **What It Does**: Illustrates a bank-scoped transaction reconciliation layer. It captures POS merchant events, pairs them against asynchronous external statements, classifies discrepancies into five formal exception types (matched, missing at provider, missing at till, amount mismatch, duplicate), and routes reconciliation actions to human operators (supervisors and finance managers) with a complete audit trail.
- **Audience & Context**: An illustration of a research question, not a proposal. Designed for researchers, engineers, and financial systems architects examining whether an acceptance-layer event recording engine can solve cash/digital discrepancy bottlenecks without becoming a money transmitter.
- **Scope Boundary**:
  - *In-Scope (Illustration)*: Event recording, statement matching rules, discrepancy triage, offline capture queue & replay, shift variance calculation, audit log, neutral rails.
  - *Strictly Out-of-Scope*: Money movement, payouts, fund transfers, merchant underwriting/KYC, card data storage, live bank or provider connections.

---

## 2. Granular Step-by-Step Implementation Sequence

```
┌────────────────────────────────────────────────────────────────────────┐
│                        STEP-BY-STEP SEQUENCE                           │
├────────────────────────────────────────────────────────────────────────┤
│ STEP 0: Fix Existing Problems (Split into reviewable sub-steps)        │
│   0a. Housekeeping: Remove duplicate `LiveTransactionFeed.tsx` and     │
│       delete stray `pages/index.html`. Verify `.gitignore` covers      │
│       `.env.local`.                                                    │
│   0b. Money Domain: Implement integer minor units (ETB cents), safe    │
│       arithmetic, and unified tabular formatter.                       │
│   0c. Universal Notice & Evidence Shell: Add top demo banner, permanent│
│       disclaimer footer, evidence-status chip component, and update    │
│       `Layout.tsx`.                                                    │
│   0d. Neutral Rails: Define Rail schema (Interoperable QR, Wallet Rail │
│       A, Bank Rail B, Card Tap SoftPOS, Cash); purge provider brand    │
│       names and affiliations.                                          │
│   0e. Decommission Settlements: Replace Settlements & Payouts page with│
│       Reconciliation and Exceptions (zero custody, zero payouts).      │
│   0f. POS Refactor: Break `EmployeeDashboard.tsx` into a clean state   │
│       machine (amount, method, pending, recorded, failed) + components.│
│   0g. Deterministic Data Engine: Replace `Math.random()` with seeded   │
│       Mulberry32 PRNG and structured baseline data.                    │
│   0h. Role Context & Guards: Implement permissions map, route guards,  │
│       and label role switcher "Demo role switcher, no authentication". │
│   0i. i18n Foundation: Setup English (default), Amharic, Afaan Oromoo. │
├────────────────────────────────────────────────────────────────────────┤
│ STEP 1: Event Ledger (Section 4.1)                                     │
│   - Immutable events (rail, minor units, till, timestamp, status).     │
│   - Statuses: captured, awaiting provider, matched, exception, voided. │
│   - Display rule: "recorded, awaiting provider report" before match.   │
├────────────────────────────────────────────────────────────────────────┤
│ STEP 2: Reconciliation & Exceptions (Section 4.2)                      │
│   - 5 formal matching classes (matched, missing at provider, missing   │
│     at till, amount mismatch, duplicate).                              │
│   - Supervisor actions: assign, add notes, resolve, void with reason.  │
│   - Ageing breakdown of open exceptions, CSV export, summary metrics   │
│     (Match rate %, open exceptions count, oldest open exception).      │
├────────────────────────────────────────────────────────────────────────┤
│ STEP 3: Low-Connectivity Capture (Section 4.3)                         │
│   - Offline simulator toggle with local indexed queue.                 │
│   - "Queued offline — will sync" status, batch replay, duplicate checks│
│   - Marked explicitly with `Assumption` evidence chip.                 │
├────────────────────────────────────────────────────────────────────────┤
│ STEP 4: Roles & Audit (Section 4.4)                                    │
│   - Role enforcement (Cashier, Supervisor, Manager) in routes/actions. │
│   - Append-only audit log for sensitive supervisor & manager actions.  │
├────────────────────────────────────────────────────────────────────────┤
│ STEP 5: Shift Close (Section 4.5)                                      │
│   - Register counting flow: physical count vs expected ledger cash.    │
│   - Variance calculation with zero fund movement.                      │
├────────────────────────────────────────────────────────────────────────┤
│ STEP 6: Reports (Section 4.6)                                          │
│   - Match rate trend, exception ageing, rail mix, till discrepancies.  │
│   - All visualized with Recharts and marked `Sample data`.             │
├────────────────────────────────────────────────────────────────────────┤
│ STEP 7: About / Status Screen (Section 4.7)                            │
│   - Architectural scope boundary declaration.                          │
│   - Four Proof Gates marked `Not started` (Bank buyer, technical/legal │
│     permission, finance officer audit, independent review).            │
│   - Clear explicit list of what the illustration does not show.        │
├────────────────────────────────────────────────────────────────────────┤
│ STEP 8: Languages & Internationalization (Section 4.8)                 │
│   - Full string coverage across English, Amharic, and Afaan Oromoo.    │
│   - Noto Sans Ethiopic font integration and ETB formatters.            │
├────────────────────────────────────────────────────────────────────────┤
│ STEP 9: Vitest Test Suite                                              │
│   - Setup Vitest in `package.json` & `vite.config.ts`.                 │
│   - Unit tests for:                                                    │
│     * Money arithmetic & minor units formatting                        │
│     * Permissions & route authorization                                │
│     * All five reconciliation matching classes                         │
│     * Capture state machine transitions                                │
│     * Offline queue replay & deduplication                             │
├────────────────────────────────────────────────────────────────────────┤
│ STEP 10: Final Documentation, Accessibility & State Polish             │
│   - `README.md` (what it is, what is mock, scope boundary, how to run, │
│     architecture, not production, and "how to present it").            │
│   - `docs/ADAPTER.md` (real integration prerequisites, 4 gates: legal, │
│     data-protection, security review, written consent; none done).     │
│   - `CHANGELOG.md` detailing the transformation to v2.                 │
│   - Empty, loading, and error states on every list and view.           │
│   - Accessibility review (keyboard keypad, focus rings, contrast, 360px│
│     cashier layout).                                                   │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 3. Definition of Done Checklist

| Criteria | Target Requirement | Evaluation Gate |
| :--- | :--- | :--- |
| **Tests Pass** | All Vitest unit tests pass (`npm run test` or `npx vitest run`) | PASS / FAIL |
| **Build Passes** | Clean TypeScript compile (`npm run build`) | PASS / FAIL |
| **No Custody / No Payouts** | No transfer, balance holding, or payout UI anywhere | PASS / FAIL |
| **No Provider Branding** | Neutral rail labels only (*Wallet Rail A*, *Bank Rail B*, etc.) | PASS / FAIL |
| **Universal Footer & Banner** | Permanent on all routes from the very first commit | PASS / FAIL |
| **Role Switcher Label** | Labelled *"Demo role switcher, no authentication"* | PASS / FAIL |
| **Evidence Status Chips** | Every screen/metric tagged (`Sample data`, `Assumption`, etc.) | PASS / FAIL |
| **Deterministic Data** | Zero `Math.random()`; seeded PRNG only | PASS / FAIL |
| **Integer Minor Units** | All currency stored in minor cents with unified formatter | PASS / FAIL |
| **Event Ledger Model** | Statuses: captured, awaiting provider, matched, exception, voided | PASS / FAIL |
| **5-Class Reconciliation** | Matched, Missing at Provider, Missing at Till, Amount Mismatch, Duplicate | PASS / FAIL |
| **Low-Connectivity Capture** | Offline simulator, local queue, batch replay, duplicate flag | PASS / FAIL |
| **Roles & Audit** | Cashier, Supervisor, Manager guards + append-only audit log | PASS / FAIL |
| **Shift Close Variance** | Physical register count vs expected cash; variance highlighted | PASS / FAIL |
| **Reports (Match Rate)** | Match rate, exception ageing, rail mix, till breakdowns | PASS / FAIL |
| **About / 4 Proof Gates** | Scope boundary + 4 gates marked `Not started` | PASS / FAIL |
| **Languages (i18n)** | English (default), Amharic, Afaan Oromoo with Noto Sans Ethiopic | PASS / FAIL |
| **Documentation** | `README.md` (with presentation guide), `docs/ADAPTER.md`, `CHANGELOG.md` | PASS / FAIL |
| **Security & Secrets** | `.env.local` gitignored, zero keys in client code | PASS / FAIL |
| **Empty/Loading/Error States** | Graceful states on every feed, table, and analytical component | PASS / FAIL |
