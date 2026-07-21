# Balanced Hero Video Performance Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Preserve automatic cinematic playback while lowering hero video download and rendering costs.

**Architecture:** Move hero video lifecycle behavior into a focused client component. Attach responsive sources after initial page load during idle time, use an immediate poster fallback, and encode smaller 24fps H.264 assets.

**Tech Stack:** React 19, Next.js 16, CSS, Node.js test runner, FFmpeg

## Global Constraints

- Preserve automatic, muted, inline, looping playback.
- Do not change hero or NFT Card geometry.
- Desktop media must remain below 2 MB; mobile media below 1 MB.
- Reduced Motion, Data Saver, and clearly low-resource devices use the poster.

---

### Task 1: Add performance contracts

**Files:**
- Modify: `tests/phoenix-hero-video-contract.test.mjs`

- [ ] Require a dedicated deferred video component, idle loading, runtime fallbacks, visibility pause/resume, ready-state fade, and media size budgets.
- [ ] Run `node --test tests/phoenix-hero-video-contract.test.mjs` and confirm failure because deferred behavior is absent and assets exceed budget.

### Task 2: Implement deferred video lifecycle

**Files:**
- Create: `app/deferred-phoenix-video.tsx`
- Modify: `app/page.tsx`
- Modify: `app/globals.css`

- [ ] Render the poster immediately and conditionally attach sources after load plus idle time.
- [ ] Keep `autoPlay`, `muted`, `loop`, `playsInline`, use `preload="none"`, and fade on `canplay`.
- [ ] Pause while hidden, resume while visible, and retain poster for fallback conditions.
- [ ] Remove real-time CSS color filters without changing layout or edge blend.

### Task 3: Encode optimized media

**Files:**
- Modify: `public/video/founders-phoenix-hero.mp4`
- Modify: `public/video/founders-phoenix-hero-mobile.mp4`

- [ ] Encode desktop at 960×540, 24fps, H.264 CRF 28, no audio, fast-start.
- [ ] Encode mobile at 640×360, 24fps, H.264 CRF 29, no audio, fast-start.
- [ ] Confirm focused contracts pass.

### Task 4: Verify and commit

- [ ] Run `npm test && git diff --check`.
- [ ] Commit the tested implementation with `perf: optimize deferred phoenix hero video`.

