# Mobile Phoenix Cinematic Glow Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Restore a medium-intensity cinematic Founders-card background on phones without changing desktop or tablet presentation.

**Architecture:** Add narrowly scoped overrides to the existing `max-width:600px` hero rules. Reuse the existing halo and pass animations, adjust only the mobile video treatment, and protect the behavior with a CSS contract test.

**Tech Stack:** Next.js-compatible React, CSS, Node test runner.

## Global Constraints

- Apply new visual overrides only at `max-width: 600px` beneath `.phoenix-landing-hero`.
- Preserve the shallow four-sided video feather mask.
- Keep current card and floating-stat positions at 320–600 px widths.
- Respect `prefers-reduced-motion: reduce`.
- Do not change desktop or tablet styling.

---

### Task 1: Restore the mobile cinematic card treatment

**Files:**
- Modify: `tests/phoenix-hero-video-contract.test.mjs`
- Modify: `app/globals.css`

**Interfaces:**
- Consumes: Existing `.halo`, `.phoenix-video-layer:after`, `.phoenix-hero-video`, and `phoenix-pass-breathe` styles.
- Produces: Mobile-only halo visibility and medium-intensity gold/violet video ambience.

- [ ] **Step 1: Write the failing mobile contract assertions**

Add these assertions to the existing hero-video CSS test:

```js
assert.match(css, /@media\(max-width:600px\)[\s\S]*\.phoenix-landing-hero \.halo\{display:block;[^}]*animation:halo-breathe/);
assert.match(css, /@media\(max-width:600px\)[\s\S]*\.phoenix-hero-video\{[^}]*opacity:\.72;[^}]*saturate\(1\.15\)/);
assert.match(css, /@media\(max-width:600px\)[\s\S]*\.phoenix-video-layer:after\{[^}]*radial-gradient\(circle at 50% 68%/);
```

- [ ] **Step 2: Run the targeted test and verify RED**

Run:

```bash
node --test tests/phoenix-hero-video-contract.test.mjs
```

Expected: the mobile cinematic assertions fail because the halo is globally hidden and the mobile video remains subdued.

- [ ] **Step 3: Add the mobile-only visual overrides**

Inside the existing `@media(max-width:600px)` block, add:

```css
.phoenix-landing-hero .halo{display:block;width:260px;height:260px;z-index:1;opacity:.78;animation:halo-breathe 7s ease-in-out infinite}
.phoenix-video-layer:after{background:linear-gradient(180deg,rgba(8,10,11,.14) 0%,rgba(8,10,11,.26) 55%,rgba(15,8,28,.68) 100%),radial-gradient(circle at 50% 68%,rgba(255,190,36,.16),transparent 42%)}
.phoenix-hero-video{opacity:.72;object-position:center 28%;filter:saturate(1.15) contrast(1.05) brightness(1.06)}
```

Do not modify the base or `max-width:900px` declarations.

- [ ] **Step 4: Run targeted verification and verify GREEN**

Run:

```bash
node --test tests/phoenix-hero-video-contract.test.mjs
npm run lint
```

Expected: three hero-video tests pass and lint exits with status 0.

- [ ] **Step 5: Run complete verification**

Run:

```bash
npm test
git diff --check
```

Expected: production build succeeds, all 25 tests pass, and the diff contains no whitespace errors.

- [ ] **Step 6: Commit the implementation**

```bash
git add app/globals.css tests/phoenix-hero-video-contract.test.mjs
git commit -m "feat: restore mobile phoenix ambience"
```
