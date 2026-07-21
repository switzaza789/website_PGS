import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

test("keeps connected desktop navigation fixed without covering portal content", async () => {
  const css = await readFile("app/globals.css", "utf8");
  assert.match(css, /\.sidebar\{[^}]*position:fixed;[^}]*left:0;[^}]*top:0;[^}]*width:250px;[^}]*height:100dvh/);
  assert.match(css, /\.content\{[^}]*margin-left:250px/);
  assert.match(css, /@media\(max-width:1000px\)[\s\S]*\.sidebar\{[^}]*width:82px/);
  assert.match(css, /@media\(max-width:1000px\)[\s\S]*\.content\{[^}]*margin-left:82px/);
  assert.match(css, /@media\(max-width:640px\)[\s\S]*\.content\{[^}]*margin-left:0/);
});

test("renders Network Pulse from the active shared board and opens Network directly", async () => {
  const page = await readFile("app/page.tsx", "utf8");
  const simulator = await readFile("app/demo-board-simulator.tsx", "utf8");
  assert.match(page, /const \[boardStates, setBoardStates\]/);
  assert.match(page, /const \[boardTier, setBoardTier\]/);
  assert.match(page, /<Dashboard[^\n]*boardState=\{boardStates\[boardTier\]\}/);
  assert.match(page, /<Dashboard[^\n]*onOpenNetwork=\{\(\) => selectPage\(2\)\}/);
  assert.match(page, /function NetworkPulse\(/);
  assert.match(page, /state\.board1/);
  assert.match(page, /onClick=\{onOpen\}/);
  assert.match(page, /onKeyDown=\{\(event\) =>/);
  assert.match(simulator, /states: TierStates/);
  assert.match(simulator, /setStates: React\.Dispatch<React\.SetStateAction<TierStates>>/);
  assert.match(simulator, /tier: TierKey/);
  assert.match(simulator, /setTier: \(tier: TierKey\) => void/);
});
