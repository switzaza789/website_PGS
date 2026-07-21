# Board-first Layout Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make Board1 and Board2 dominate the board page while preventing document-level overflow on desktop and mobile.

**Architecture:** Extract Board1 presentation indexing into a pure view-model module, then compose a responsive viewer around the unchanged board engine. Keep compact primary metrics above the board and move secondary metrics, node details, simulation tools, and events into responsive inspectors or collapsed panels.

**Tech Stack:** React 19, JavaScript view model, CSS, Node test runner.

## Global Constraints

- Preserve the existing Board1 binary heap, Board2 FIFO, payout, re-entry, and three-tier scaling rules.
- Default Board1 to occupied nodes plus immediate valid empty child positions.
- Keep all 31 simulated positions available through an explicit toggle.
- Prevent document-level horizontal overflow at 320–600px widths.
- Keep mobile bottom navigation visible and reserve safe-area clearance.
- Keep simulation tools and event stream collapsed by default.
- Do not add Focus Mode, blockchain writes, or persistence.

---

### Task 1: Board1 visible-node view model

**Files:**
- Create: `app/board-view-model.mjs`
- Create: `tests/board-view-model.test.mjs`

**Interfaces:**
- Produces: `getVisibleBoard1Indexes(board1, showAllPositions, maxIndex = 31): number[]`.
- Consumes: The sparse `state.board1` array produced by `demo-board-engine.mjs`.

- [ ] **Step 1: Write failing view-model tests**

Test that an initial board returns `[1, 2, 3]`, an occupied child exposes only its immediate children, and `showAllPositions=true` returns indexes 1–31.

- [ ] **Step 2: Run RED**

Run `node --test tests/board-view-model.test.mjs` and expect module-not-found or missing-export failure.

- [ ] **Step 3: Implement the pure helper**

Collect occupied indexes, add each occupied node's valid left and right child indexes, always include root index 1, sort numerically, and return all indexes when requested.

- [ ] **Step 4: Run GREEN**

Run `node --test tests/board-view-model.test.mjs` and expect all view-model tests to pass.

---

### Task 2: Responsive Board1 viewer and controls

**Files:**
- Modify: `app/demo-board-simulator.tsx`
- Modify: `tests/board-layout-contract.test.mjs`

**Interfaces:**
- Consumes: `getVisibleBoard1Indexes` from Task 1.
- Produces: Board-local `Fit`, zoom, center-root, and show-all controls; responsive node inspector.

- [ ] **Step 1: Add failing component-contract assertions**

Require `showAllPositions`, `board-view-tools`, bilingual Fit/Center labels, `getVisibleBoard1Indexes`, `board-stage-body`, and an explicit `aria-pressed` show-all toggle.

- [ ] **Step 2: Run RED**

Run `node --test tests/board-layout-contract.test.mjs` and expect the new component assertions to fail.

- [ ] **Step 3: Implement viewer state and composition**

Add local zoom state clamped from 1 to 2, a scroll-container ref, Fit and Center Root actions, and the presentation-only show-all toggle. Render only indexes returned by the view model. Place node details in `.board-node-inspector` next to the canvas on wide screens and below it on narrow screens.

- [ ] **Step 4: Run GREEN**

Run `node --test tests/board-layout-contract.test.mjs tests/board-view-model.test.mjs` and expect all targeted tests to pass.

---

### Task 3: Board-first hierarchy and responsive containment

**Files:**
- Modify: `app/demo-board-simulator.tsx`
- Modify: `app/globals.css`
- Modify: `tests/board-layout-contract.test.mjs`

**Interfaces:**
- Consumes: Board viewer from Task 2 and existing mobile navigation.
- Produces: Compact primary summary, collapsed secondary summary/events, viewport-contained Board1 and vertical Board2.

- [ ] **Step 1: Add failing layout assertions**

Require a three-item primary summary, `<details className="board-secondary-summary">`, collapsed `<details className="panel board-events">`, `.board-simulator{overflow-x:clip}`, `.board1-canvas svg{...min-width:0}`, a `clamp(520px,68vh,760px)` desktop viewport, responsive inspector stacking, and at least 96px mobile bottom clearance.

- [ ] **Step 2: Run RED**

Run `node --test tests/board-layout-contract.test.mjs` and expect the new hierarchy and CSS assertions to fail.

- [ ] **Step 3: Implement hierarchy changes**

Keep Members, Board1, and Board2 in the primary summary. Move completed Board2, Wallet payout, Capital in, and accounting audit into a collapsed secondary details panel. Convert Event Stream to collapsed details while preserving every log entry. Remove the 760/680px SVG minimum widths and contain scrolling inside the board viewport.

- [ ] **Step 4: Add responsive CSS**

Use a full-width stage, `clamp(520px,68vh,760px)` desktop canvas, two-column canvas/inspector layout, one-column mobile layout, 44px mobile toolbar targets, `overflow-x:clip`, internal pan/zoom scrolling, and mobile `padding-bottom:calc(96px + env(safe-area-inset-bottom))`.

- [ ] **Step 5: Verify targeted behavior**

Run `node --test tests/board-layout-contract.test.mjs tests/board-view-model.test.mjs tests/demo-board-engine.test.mjs` and `npm run lint`; expect zero failures.

---

### Task 4: Full verification and commit

**Files:**
- Verify all files modified in Tasks 1–3.

- [ ] **Step 1: Run complete verification**

Run `npm test && git diff --check`; expect production build success and all tests passing.

- [ ] **Step 2: Review scope**

Run `git diff --stat` and `git status --short`; confirm only the view model, board component, board CSS, and board tests changed.

- [ ] **Step 3: Commit**

Run `git add app/board-view-model.mjs app/demo-board-simulator.tsx app/globals.css tests/board-view-model.test.mjs tests/board-layout-contract.test.mjs && git commit -m "feat: prioritize responsive board viewing"`.
