# Master NFT Card Design

## Goal

Use the connected Membership page's NFT card as the single visual master for Starter, Core, and Founders everywhere in the experience.

## Canonical geometry

- Master aspect ratio: `15 / 8`, matching the approved connected Membership reference.
- Standard desktop width: `100%` of the card slot with a `440px` maximum.
- Height is always derived from the aspect ratio; no product card may use an independent fixed height.
- Tablet and mobile reduce width only. They must not distort, crop by changing container ratio, or move overlay copy into different slots.

## Shared presentation

- Public membership cards, connected Membership cards, and purchase-dialog cards use the `full` PhoenixPass presentation.
- Hero and Dashboard presentations may use different widths, rotation, and ambient effects, but retain the master ratio and internal copy anchors.
- Starter, Core, and Founders share identical container geometry, copy padding, title baseline, rarity baseline, and price anchor.
- Tier identity remains limited to artwork, metal color, glow color, text values, and the Founders recommendation badge.

## Responsive and language behavior

- All variants preserve `15 / 8` at every breakpoint.
- TH/EN switching must not change card geometry.
- The mobile card uses the available width up to its existing viewport constraint and derives height from `15 / 8`.

## Verification

Contract tests confirm the canonical ratio token, absence of fixed product-card heights, full presentation reuse on public and dialog surfaces, and ratio preservation for hero and Dashboard variants. The full production build and test suite must pass before deployment.
