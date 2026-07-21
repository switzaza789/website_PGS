import assert from "node:assert/strict";
import test from "node:test";

import { getVisibleBoard1Indexes } from "../app/board-view-model.mjs";

test("shows the root and its immediate open positions on an initial board", () => {
  const board1 = [];
  board1[1] = { ownerId: 1 };

  assert.deepEqual(getVisibleBoard1Indexes(board1, false), [1, 2, 3]);
});

test("shows occupied positions and only their immediate valid children", () => {
  const board1 = [];
  board1[1] = { ownerId: 1 };
  board1[2] = { ownerId: 2 };

  assert.deepEqual(getVisibleBoard1Indexes(board1, false), [1, 2, 3, 4, 5]);
});

test("restores all 31 simulated positions when requested", () => {
  const board1 = [];
  board1[1] = { ownerId: 1 };

  assert.deepEqual(getVisibleBoard1Indexes(board1, true), Array.from({ length: 31 }, (_, index) => index + 1));
});

test("does not preview empty children deeper than four visible levels", () => {
  const board1 = [];
  board1[1] = { ownerId: 1 };
  board1[9] = { ownerId: 2 };

  assert.deepEqual(getVisibleBoard1Indexes(board1, false), [1, 2, 3, 9]);
});
