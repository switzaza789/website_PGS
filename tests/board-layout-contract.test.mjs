import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

test("prioritizes board viewing space over introductory content", async () => {
  const css = await readFile("app/globals.css", "utf8");
  assert.match(css, /\.board-sim-heading\{[^}]*padding:1[024]px/);
  assert.match(css, /\.board-workbench\{[^}]*grid-template-columns:1fr/);
  assert.match(css, /\.board-summary article\{[^}]*padding:[89]px/);
});

test("renders Board2 as a vertical FIFO without horizontal scrolling", async () => {
  const css = await readFile("app/globals.css", "utf8");
  assert.match(css, /\.board2-queue\{[^}]*flex-direction:column/);
  assert.match(css, /\.board2-queue\{[^}]*overflow-x:hidden/);
  assert.match(css, /\.board2-queue article>i\{[^}]*bottom:-2[0-9]px/);
});

test("keeps simulation controls separable from the production viewer", async () => {
  const component = await readFile("app/demo-board-simulator.tsx", "utf8");
  assert.match(component, /interactive\?: boolean/);
  assert.match(component, /interactive && <details className="board-controls/);
  assert.match(component, /<summary>/);
});

test("makes the active 10, 100, or 1,000 USDT board tier unmistakable", async () => {
  const component = await readFile("app/demo-board-simulator.tsx", "utf8");
  const css = await readFile("app/globals.css", "utf8");
  assert.match(component, /tierOrder\.map/);
  assert.match(component, /board-tier-switcher/);
  assert.match(component, /board-tier-badge/);
  assert.match(component, /membershipTiers\[tier\]/);
  assert.match(css, /\.board-tier-switcher\{/);
  assert.match(css, /\.board-tier-option\.starter/);
  assert.match(css, /\.board-tier-option\.core/);
  assert.match(css, /\.board-tier-option\.founders/);
});

test("provides a focused Board1 viewer with presentation-only controls", async () => {
  const component = await readFile("app/demo-board-simulator.tsx", "utf8");
  assert.match(component, /getVisibleBoard1Indexes/);
  assert.match(component, /showAllPositions/);
  assert.match(component, /className="board-view-tools"/);
  assert.match(component, /aria-pressed=\{showAllPositions\}/);
  assert.match(component, /พอดีจอ/);
  assert.match(component, /จัด Root กึ่งกลาง/);
  assert.match(component, /className="board-stage-body board1"/);
  assert.match(component, /board-node-inspector/);
});

test("keeps secondary board data collapsed and contains responsive overflow", async () => {
  const component = await readFile("app/demo-board-simulator.tsx", "utf8");
  const css = await readFile("app/globals.css", "utf8");
  assert.match(component, /className="board-summary board-primary-summary"/);
  assert.match(component, /<details className="board-secondary-summary"/);
  assert.match(component, /<details className="panel board-events"/);
  assert.match(css, /\.board-simulator\{[^}]*overflow-x:clip/);
  assert.match(css, /\.board1-canvas\{[^}]*height:clamp\(520px,68vh,760px\)/);
  assert.match(css, /\.board1-canvas svg\{[^}]*min-width:0/);
  assert.match(css, /\.board-stage-body\.board1\{[^}]*grid-template-columns:minmax\(0,1fr\) minmax\(220px,280px\)/);
  assert.match(css, /@media\(max-width:720px\)[\s\S]*\.board-stage-body\.board1\{grid-template-columns:1fr/);
  assert.match(css, /@media\(max-width:720px\)[\s\S]*\.board-simulator\{[^}]*padding-bottom:calc\(96px \+ env\(safe-area-inset-bottom\)\)/);
  assert.match(css, /@media\(max-width:720px\)[\s\S]*\.board-view-tools button\{[^}]*min-height:44px/);
});

test("places the board workbench before secondary summaries and simulation tools", async () => {
  const component = await readFile("app/demo-board-simulator.tsx", "utf8");
  const workbench = component.indexOf('<section className="board-workbench">');
  const primarySummary = component.indexOf('<section className="board-summary board-primary-summary"');
  const financialSummary = component.indexOf('<details className="board-secondary-summary">');
  assert.ok(workbench > 0, "board workbench must exist");
  assert.ok(workbench < primarySummary, "board must appear before the primary summary");
  assert.ok(workbench < financialSummary, "board must appear before financial details");
});
