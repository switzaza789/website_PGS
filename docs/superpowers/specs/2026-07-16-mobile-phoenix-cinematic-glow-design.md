# Mobile Phoenix Cinematic Glow Design

## Goal

Restore the richer Founders-card presentation on phones without changing the desktop hero. The mobile visual should feel cinematic and premium while keeping the card, labels, and call to action readable.

## Approved Direction

Use a medium-intensity mobile-only treatment at `max-width: 600px`:

- Restore the existing animated halo behind the Founders pass.
- Keep the existing gentle pass breathing animation.
- Add restrained gold light behind the card and violet ambience near the lower edge.
- Increase the mobile video color and brightness slightly around the visual area.
- Reduce the dark mobile video overlay enough to reveal detail without weakening text contrast.
- Preserve the shallow four-sided feather mask on the video.
- Leave desktop and tablet styling unchanged.

## Motion and Accessibility

Motion remains decorative and non-interactive. Existing `prefers-reduced-motion: reduce` behavior must disable the halo and card animations and retain a stable poster-based composition.

## Responsive Boundaries

All new overrides live inside the existing `@media(max-width:600px)` block and are scoped beneath `.phoenix-landing-hero`. The card and floating status panels retain their current positions and must not overflow the viewport at 320–600 px widths.

## Verification

- Add a contract test proving the halo is restored only inside the mobile breakpoint.
- Verify the mobile video keeps the four-sided mask and moderate opacity/filter values.
- Run the targeted hero-video and Phoenix Pass tests.
- Run lint, production build, and the full test suite.
