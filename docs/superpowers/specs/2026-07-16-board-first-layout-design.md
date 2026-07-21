# Board-first Layout Design

## Goal

Make Board1 and Board2 the primary content of the board page. The layout must fit desktop and mobile viewports without page-level horizontal overflow, while preserving the existing deterministic simulation rules for all three membership tiers.

## Information hierarchy

The page is ordered by importance:

1. Compact page title and Simulation status.
2. Membership tier selector: Starter 10, Core 100, Founders 1,000 USDT.
3. Compact primary summary: Members, Board1 positions, Board2 positions.
4. Board toolbar and board viewport.
5. Selected-node details.
6. Collapsed financial details, simulation tools, and event stream.

Wallet payout, completed Board2 count, capital in, and accounting balance remain available but no longer compete with the board above the fold.

## Board1 viewer

- Preserve the binary heap indexes and current engine data.
- Default to showing occupied nodes plus the immediate valid empty child positions.
- Provide an `Show all positions` toggle for viewing all 31 simulated positions.
- Keep a maximum of four visible levels in the normal viewport; deeper content is reached through pan/zoom rather than widening the page.
- Add board-local controls for `Fit`, `Zoom in`, `Zoom out`, and `Center root`.
- Keep the root centered on initial load and after tier changes.
- Move selected-node details out of the six-column strip: use a right-side inspector on wide screens and an expandable panel below the board on mobile.
- The board viewport clips its own content and may pan internally. It must never cause document-level horizontal scrolling.

## Board2 viewer

- Preserve FIFO order and payout/re-entry rules.
- Continue rendering the queue vertically from top to bottom.
- Use a compact active/completed queue card and keep scrolling inside the board viewport.

## Desktop layout

- Board stage uses the full available content width.
- Header, tier selector, and primary summary target a combined height of no more than 190px.
- Board viewport uses `clamp(520px, 68vh, 760px)`.
- Board toolbar stays visible at the top of the stage while its canvas scrolls or pans.
- Secondary sections are collapsed by default.

## Mobile layout

- Keep the existing fixed mobile bottom navigation and safe-area padding.
- Use a compact three-option tier selector and two-option Board1/Board2 switch.
- Board viewport width is `100%` and never uses the existing 680px SVG minimum width.
- Board1 uses responsive node spacing and internal pan/zoom at 320–600px widths.
- Selected-node details appear as a compact expandable panel below the viewport.
- Reserve bottom padding so the mobile navigation never covers board content or controls.
- Simulation tools and events remain collapsed by default.

## State and accessibility

- Tier, Board1/Board2 selection, selected node, and simulation state remain independent as they are now.
- The empty-position toggle is presentation state only and cannot change placement outcomes.
- Occupied nodes remain keyboard-selectable with Enter.
- New toolbar controls have bilingual accessible labels and at least 44px touch targets on mobile.
- Focus remains visible; color is not the only indicator for active, completed, or re-entry states.
- Thai and English copy use stable layout slots to prevent movement during language changes.

## Scope exclusions

- No Smart Contract, Polygon transaction, wallet-signature, or production persistence work.
- No changes to membership prices, sponsor/structure splits, Board2 payouts, or re-entry rules.
- No Focus Mode or fullscreen redesign in this iteration.
- No change to the desktop/mobile application navigation outside the board page.

## Verification

- Contract tests prove the board is the dominant page surface and secondary sections are collapsed.
- Component tests prove the default visible-node set contains occupied nodes and immediate valid empty children, while `Show all positions` restores all 31 nodes.
- Responsive tests prevent document-level horizontal overflow and preserve mobile navigation clearance.
- Existing board-engine tests must remain unchanged and pass for 10, 100, and 1,000 USDT tiers.
- Lint, production build, and the full test suite must pass.
