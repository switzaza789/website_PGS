# Board-first Portal Polish Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Deliver a polished fixed-navigation portal whose board is primary and whose Dashboard Network Pulse reflects the active simulation state.

**Architecture:** Lift tier simulation state and selected tier to `Home`, pass controlled state into the simulator, and render a compact live board projection on the Dashboard. CSS fixes the sidebar at desktop/tablet breakpoints, reorders board sections structurally, and replaces the four-edge video mask with shallow side and bottom feathering.

**Tech Stack:** React 19, TypeScript, Vinext/Vite, CSS, Node test runner

## Global Constraints

- Keep all wallet, Polygon, NFT, and board activity explicitly simulated.
- Do not change Board1, Board2, payout, or re-entry rules.
- Preserve TH/EN and mobile bottom navigation.
- Use test-first changes and run the full production build before deployment.

---

### Task 1: Lock the approved layout contracts

**Files:**
- Modify: `tests/phoenix-hero-video-contract.test.mjs`
- Modify: `tests/board-layout-contract.test.mjs`
- Create: `tests/portal-layout-contract.test.mjs`

**Interfaces:**
- Consumes: `app/page.tsx`, `app/demo-board-simulator.tsx`, `app/globals.css`
- Produces: regression contracts for video masking, sidebar positioning, board source order, and Network Pulse navigation

- [ ] Add assertions that the top video edge is fully opaque, side feathering is 2%, bottom feathering is 6%, the sidebar is fixed, the board stage precedes summaries, and Network Pulse consumes active board state and calls `selectPage(2)`.
- [ ] Run `node --test tests/phoenix-hero-video-contract.test.mjs tests/board-layout-contract.test.mjs tests/portal-layout-contract.test.mjs` and confirm the new assertions fail for the missing behavior.

### Task 2: Share board state and implement live Network Pulse

**Files:**
- Modify: `app/page.tsx`
- Modify: `app/demo-board-simulator.tsx`

**Interfaces:**
- Consumes: `createInitialBoardState(tierKey)`, `TierKey`, current `DemoBoardSimulator`
- Produces: controlled `states`, `setStates`, `tier`, and `setTier` simulator props plus `NetworkPulse({ state, tier, language, onOpen })`

- [ ] Lift three tier states and active tier to `Home`.
- [ ] Pass active state to `Dashboard` and controlled state callbacks to `DemoBoardSimulator`.
- [ ] Replace the hard-coded Dashboard tree with an SVG projection of current occupied and immediately available Board1 positions.
- [ ] Make the complete Network Pulse card keyboard/click accessible and route directly to nav index 2.
- [ ] Run the focused portal contract test and confirm it passes.

### Task 3: Put the board first and fix persistent navigation

**Files:**
- Modify: `app/demo-board-simulator.tsx`
- Modify: `app/globals.css`

**Interfaces:**
- Consumes: controlled simulator state from Task 2
- Produces: tier selector followed immediately by the board workbench, fixed desktop/tablet sidebar, correctly offset content, unchanged mobile bottom nav

- [ ] Move the board workbench before primary and financial summaries in component source order.
- [ ] Apply `position: fixed` to desktop/tablet sidebar and offset `.content` by 250px or 82px at the compact breakpoint.
- [ ] Keep the mobile breakpoint free of the desktop offset and maintain bottom safe-area spacing.
- [ ] Run focused board and portal contract tests and confirm they pass.

### Task 4: Refine the hero edge blend

**Files:**
- Modify: `app/globals.css`
- Modify: `tests/phoenix-hero-video-contract.test.mjs`

**Interfaces:**
- Consumes: `.phoenix-video-layer`
- Produces: intersected horizontal and bottom-only masks with no top fade

- [ ] Set the horizontal mask to `transparent 0, #000 2%, #000 98%, transparent 100%`.
- [ ] Set the vertical mask to `#000 0, #000 94%, transparent 100%`.
- [ ] Run the focused hero contract test and confirm it passes.

### Task 5: Full verification and production publication

**Files:**
- Verify: all application and test files

**Interfaces:**
- Consumes: completed source tree
- Produces: pushed `main`, saved Sites version, successful public deployment

- [ ] Run `npm test` and require all tests and the production build to pass.
- [ ] Run `git diff --check` and confirm the worktree has no whitespace errors.
- [ ] Commit the implementation, push the exact commit to `main`, save a Sites version, deploy it, and poll until terminal status.
