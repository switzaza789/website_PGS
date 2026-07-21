# Board-first Portal Polish Design

## Goal

Make the public hero blend cleanly at desktop sizes, keep the connected-member navigation stationary, place the board viewer before secondary board information, and make Dashboard Network Pulse a live, clickable projection of the same simulation state shown on the Network page.

## Approved behavior

- The hero video has no top mask. Its left and right edges feather only 2%, while its bottom edge fades over 6%.
- The desktop member sidebar remains fixed while the document scrolls. Content is offset by the exact sidebar width. The mobile bottom navigation remains fixed and safe-area aware.
- The Network page orders content as tier selector, Board1/Board2 selector and board canvas, then primary/financial summaries, simulation controls, and events.
- Dashboard Network Pulse is not hard-coded. It renders the selected tier's current Board1 positions from the same in-memory simulation state as the Network page.
- Clicking Network Pulse or its call to action selects the Network navigation item and scrolls to the top.
- The experience remains explicitly Polygon Demo / Simulation and does not perform real transactions.

## State and component boundaries

`Home` owns the tier states and selected tier so Dashboard and Network cannot drift. `DemoBoardSimulator` receives those values and callbacks, and still owns presentation-only state such as the selected board tab, selected node, and zoom. A focused `NetworkPulse` component renders a compact SVG preview from the active Board1 state and acts as one accessible navigation control.

## Responsive behavior

Desktop uses a fixed 250px sidebar and a content margin of 250px. The compact 82px sidebar breakpoint uses the same fixed-position model. Below 640px the sidebar is removed and the fixed bottom navigation remains the only persistent navigation. Board canvas overflow stays contained inside its own viewer.

## Verification

Contract tests cover the video mask, fixed navigation, board-first source order, shared state props, live Network Pulse, and direct navigation. Existing board-engine tests ensure no simulation rules change. The complete production build and test suite must pass before deployment.
