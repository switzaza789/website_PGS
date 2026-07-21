# PGS Phoenix NFT Pass Implementation Plan

**Goal:** Add three phoenix artworks and one reusable membership-pass system without changing Site behavior.

**Files:**

- `public/phoenix/*.png`: Bronze, Silver, and Gold production artwork.
- `app/membership-tiers.ts`: typed names, prices, rarities, artwork, and localized alt text.
- `app/phoenix-pass.tsx`: shared mini, full, hero, and dashboard pass renderer.
- `app/page.tsx`: replace duplicated pass markup while preserving actions.
- `app/globals.css`: shared composition, metal progression, responsive rules, focus, and reduced motion.
- `tests/phoenix-pass-contract.test.mjs`: asset, copy, reuse, and CSS contracts.

## Tasks

1. Generate and validate three standalone phoenix assets.
2. Add typed tier data and the shared PhoenixPass component.
3. Integrate the component across guest, member, hero, and dashboard passes.
4. Add tier styling, responsive behavior, focus states, and reduced-motion handling.
5. Run lint, tests, build, live preview QA, review, and an approved production checkpoint.
