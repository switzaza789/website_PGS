# Master NFT Card Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Standardize every Phoenix NFT card on the approved connected Membership card geometry.

**Architecture:** Define one CSS ratio token on `.phoenix-pass`, make all variants derive height from that ratio, and reuse the `full` presentation for product-selection and purchase-dialog surfaces. Context variants retain only width, rotation, and ambient effects.

**Tech Stack:** React 19, TypeScript, CSS, Node test runner, Vinext/Vite

## Global Constraints

- Canonical NFT card ratio is exactly `15 / 8`.
- Standard desktop NFT card width is at most `440px`.
- No change to tier prices, artwork files, wallet simulation, or purchase flow.
- Preserve TH/EN and current mobile navigation.

---

### Task 1: Lock the master-card contract

**Files:**
- Modify: `tests/phoenix-pass-contract.test.mjs`
- Modify: `tests/demo-flow-contract.test.mjs`

- [ ] Assert a `--nft-card-ratio:15 / 8` token and ratio use by full, hero, dashboard, and mobile cards.
- [ ] Assert that public product cards and purchase dialogs both render `variant="full"`.
- [ ] Assert that fixed `150px`, `160px`, and `205px` PhoenixPass heights are absent.
- [ ] Run the two focused tests and confirm they fail for the missing standard.

### Task 2: Apply the canonical PhoenixPass geometry

**Files:**
- Modify: `app/globals.css`

- [ ] Add the canonical ratio token to `.phoenix-pass`.
- [ ] Make full cards `width:100%`, `max-width:440px`, `aspect-ratio:var(--nft-card-ratio)`, and `height:auto`.
- [ ] Make mini, hero, and dashboard cards preserve the same ratio while retaining context width/effects.
- [ ] Remove fixed variant and mobile heights.
- [ ] Run the focused PhoenixPass contract and confirm it passes.

### Task 3: Reuse the Master on public and dialog surfaces

**Files:**
- Modify: `app/page.tsx`
- Modify: `app/demo-membership-flow.tsx`

- [ ] Change public tier cards from `mini` to `full`.
- [ ] Change the purchase dialog from `mini` to `full`.
- [ ] Keep current click behavior and tier content unchanged.
- [ ] Run focused flow contracts and confirm they pass.

### Task 4: Verify and publish

**Files:**
- Verify: all application and test files

- [ ] Run `npm test` and require the production build and all tests to pass.
- [ ] Run `git diff --check`.
- [ ] Commit, push exact HEAD to `main`, save a Sites version, deploy it, and poll to terminal success.
