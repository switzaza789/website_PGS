# Restore Hero NFT Card Size Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Restore the landing-page Founders Hero card to its legacy fixed dimensions without changing any other NFT Card placement.

**Architecture:** Keep the shared `PhoenixPass` component and Master geometry token unchanged. Add a narrow CSS exception for the existing `hero` variant and protect the exception with a source contract test.

**Tech Stack:** React 19, Next.js 16, CSS, Node.js test runner

## Global Constraints

- Desktop Hero card is exactly `330px × 205px`.
- At widths up to `720px`, Hero width remains `min(78vw, 290px)` and height is `180px`.
- At widths up to `420px`, Hero card is exactly `245px × 154px`.
- Full, Mini, and Dashboard variants continue using the approved Master geometry.
- Rotation, animation, typography, artwork, and positioning remain unchanged.

---

### Task 1: Restore the isolated Hero geometry

**Files:**
- Modify: `tests/phoenix-pass-contract.test.mjs`
- Modify: `app/globals.css`

**Interfaces:**
- Consumes: Existing `PhoenixPass` `hero` variant and `.phoenix-pass--hero` CSS selector.
- Produces: Legacy Hero dimensions at desktop, `720px`, and `420px` breakpoints.

- [ ] **Step 1: Write the failing contract test**

Replace the Hero assertions inside `uses the approved Membership card as the canonical NFT geometry` with a separate assertion that requires:

```js
assert.match(css, /\.phoenix-pass--hero\{[^}]*width:330px;[^}]*height:205px/);
assert.match(css, /@media\(max-width:720px\)\{\.phoenix-pass--hero\{[^}]*width:min\(78vw,290px\);[^}]*height:180px/);
assert.match(css, /@media\(max-width:420px\)\{\.phoenix-pass--hero\{[^}]*width:245px;[^}]*height:154px/);
```

Keep Full and Dashboard Master assertions, and limit fixed-height rejection to Mini/Full/Dashboard selectors.

- [ ] **Step 2: Verify the contract test fails**

Run:

```bash
node --test tests/phoenix-pass-contract.test.mjs
```

Expected: FAIL because `.phoenix-pass--hero` still uses `aspect-ratio` and `height:auto`.

- [ ] **Step 3: Restore only the Hero CSS dimensions**

Use these exact geometry declarations while retaining every existing non-geometry declaration:

```css
.phoenix-pass--hero{width:330px;height:205px;...}
@media(max-width:720px){.phoenix-pass--hero{width:min(78vw,290px);height:180px}...}
@media(max-width:420px){.phoenix-pass--hero{width:245px;height:154px}...}
```

Do not modify `.phoenix-pass--full`, `.phoenix-pass--mini`, or `.phoenix-pass--dashboard`.

- [ ] **Step 4: Verify the focused test passes**

Run:

```bash
node --test tests/phoenix-pass-contract.test.mjs
```

Expected: all Phoenix Pass contract tests PASS.

- [ ] **Step 5: Verify the complete project**

Run:

```bash
npm test && git diff --check
```

Expected: production build succeeds, all tests pass, and no whitespace errors are reported.

- [ ] **Step 6: Commit the isolated restoration**

```bash
git add app/globals.css tests/phoenix-pass-contract.test.mjs docs/superpowers/plans/2026-07-16-restore-hero-card-size.md
git commit -m "fix: restore landing hero card size"
```

