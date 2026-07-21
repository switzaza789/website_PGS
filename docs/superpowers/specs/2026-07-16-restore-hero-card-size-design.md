# Restore Hero NFT Card Size

## Goal

Restore only the floating Founders NFT card in the public landing-page hero to its previous dimensions. All other NFT card placements continue using the approved Membership Card Master standard.

## Scope

- Desktop hero card: `330px × 205px`.
- Screens up to `720px`: retain responsive width `min(78vw, 290px)` and restore height to `180px`.
- Screens up to `420px`: restore size to `245px × 154px`.
- Preserve the existing rotation, breathing animation, typography, artwork, and responsive positioning.
- Do not change cards in Membership selection, purchase review modal, connected portal, or dashboard.

## Implementation Boundary

Only the `.phoenix-pass--hero` geometry rules and their existing responsive overrides may change. The canonical `--nft-card-ratio` and Full/Mini/Dashboard variants remain unchanged.

## Verification

- Add a focused contract test that requires the legacy fixed hero dimensions at all three breakpoints.
- Keep the Master-card tests for all non-Hero placements passing.
- Run the full test suite, production build, and whitespace validation.

