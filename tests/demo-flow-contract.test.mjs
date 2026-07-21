import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

test("labels the experience as a Polygon simulation", async () => {
  const page = await readFile("app/page.tsx", "utf8");
  assert.match(page, /Polygon/);
  assert.match(page, /Demo Mode|โหมดจำลอง/);
  assert.doesNotMatch(page, /BNB Smart Chain/);
});

test("ships a tier comparison and simulated purchase state machine", async () => {
  const flow = await readFile("app/demo-membership-flow.tsx", "utf8");
  assert.match(flow, /comparison-panel/);
  assert.match(flow, /details.*confirm.*processing.*success.*failed/s);
  assert.match(flow, /Polygon/);
  assert.match(flow, /NFT.*MOCK|MOCK.*NFT/s);
});

test("ships searchable filterable downloadable demo transactions", async () => {
  const transactions = await readFile("app/demo-transactions.tsx", "utf8");
  assert.match(transactions, /type="search"/);
  assert.match(transactions, /<select/);
  assert.match(transactions, /text\/csv/);
  assert.match(transactions, /URL\.createObjectURL/);
  assert.match(transactions, /DEMO/);
});

test("locks bilingual card content into stable layout slots", async () => {
  const css = await readFile("app/globals.css", "utf8");
  assert.match(css, /\.tier\{[^}]*grid-template-rows/);
  assert.match(css, /\.public-tier\{[^}]*grid-template-rows/);
  assert.match(css, /line-clamp/);
});
