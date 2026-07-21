import assert from "node:assert/strict";
import test from "node:test";

import * as boardEngine from "../app/demo-board-engine.mjs";

const {
  addMember,
  createInitialBoardState,
  getReentryBoard1Index,
  loadReferenceDemo,
} = boardEngine;

test("Board1 alternates root placement between binary heap indexes 2 and 3", () => {
  let state = createInitialBoardState();
  state = addMember(state, { name: "Bob", sponsorId: 1 });
  state = addMember(state, { name: "Charlie", sponsorId: 1 });

  assert.equal(state.board1[2].ownerId, 2);
  assert.equal(state.board1[3].ownerId, 3);
  assert.equal(state.users[1].wallet, 10);
});

test("a Board1 parent enters Board2 after receiving two 5 USDT structure fees", () => {
  let state = createInitialBoardState();
  state = addMember(state, { name: "Bob", sponsorId: 1 });
  assert.equal(state.board1[1].reserve, 5);
  state = addMember(state, { name: "Charlie", sponsorId: 1 });

  assert.equal(state.board1[1].reserve, 0);
  assert.equal(state.board1[1].completed, true);
  assert.equal(state.board2.length, 1);
  assert.equal(state.board2[0].ownerId, 1);
});

test("Board2 even queue pays cash and odd queue creates Board1 re-entry", () => {
  const state = loadReferenceDemo();

  assert.equal(state.board2.length, 3);
  assert.equal(state.board2[0].hasPaidCash, true);
  assert.equal(state.board2[0].hasPaidReentry, true);
  assert.equal(state.board2[0].completed, true);
  assert.equal(state.users[1].wallet, 25);
  assert.ok(Object.values(state.board1).some((position) => position?.ownerId === 1 && position.isReentry));
});

test("re-entry uses first empty BFS slot under the owner's first Board1 position", () => {
  const state = loadReferenceDemo();
  assert.equal(getReentryBoard1Index(state, 2), 9);
});

test("reference demo preserves 10 USDT package accounting inputs", () => {
  const state = loadReferenceDemo();
  assert.equal(state.totalCapitalIn, 60);
  assert.equal(state.users.length - 1, 7);
  const walletTotal = state.users.reduce((sum, user) => sum + (user?.wallet || 0), 0);
  const reserveTotal = state.board1.reduce((sum, position) => sum + (position?.reserve || 0), 0);
  assert.equal(walletTotal + reserveTotal + state.board2HoldingPool, state.totalCapitalIn);
  assert.ok(state.logs.some((entry) => entry.type === "cash"));
  assert.ok(state.logs.some((entry) => entry.type === "reentry"));
});

test("all membership tiers use identical board rules scaled by package value", () => {
  const { BOARD_TIER_RULES } = boardEngine;
  assert.ok(BOARD_TIER_RULES, "BOARD_TIER_RULES must be exported");
  const expected = {
    starter: { packageUsdt: 10, sponsorFeeUsdt: 5, structureFeeUsdt: 5 },
    core: { packageUsdt: 100, sponsorFeeUsdt: 50, structureFeeUsdt: 50 },
    founders: { packageUsdt: 1000, sponsorFeeUsdt: 500, structureFeeUsdt: 500 },
  };

  for (const [tierKey, values] of Object.entries(expected)) {
    assert.deepEqual(BOARD_TIER_RULES[tierKey], { key: tierKey, ...values });
    let state = createInitialBoardState(tierKey);
    state = addMember(state, { name: "Bob", sponsorId: 1 });
    state = addMember(state, { name: "Charlie", sponsorId: 1 });
    assert.equal(state.tierKey, tierKey);
    assert.equal(state.totalCapitalIn, values.packageUsdt * 2);
    assert.equal(state.users[1].sponsorEarnings, values.sponsorFeeUsdt * 2);
    assert.equal(state.board1[1].completed, true);
    assert.equal(state.board2.length, 1);
  }
});

test("each tier reference demo preserves scaled accounting balance", () => {
  const { BOARD_TIER_RULES } = boardEngine;
  assert.ok(BOARD_TIER_RULES, "BOARD_TIER_RULES must be exported");
  for (const tierKey of ["starter", "core", "founders"]) {
    const state = loadReferenceDemo(tierKey);
    const walletTotal = state.users.reduce((sum, user) => sum + (user?.wallet || 0), 0);
    const reserveTotal = state.board1.reduce((sum, position) => sum + (position?.reserve || 0), 0);
    assert.equal(walletTotal + reserveTotal + state.board2HoldingPool, state.totalCapitalIn);
    assert.equal(state.totalCapitalIn, BOARD_TIER_RULES[tierKey].packageUsdt * 6);
  }
});
