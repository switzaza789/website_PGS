// Simulation parity reference: https://github.com/switzaza789/WEB-3-MLM/blob/main/index.html
// This module intentionally models only the deterministic Board1/Board2 rules; it performs no real payments.
export const BOARD_TIER_RULES = Object.freeze({
  starter: Object.freeze({ key: "starter", packageUsdt: 10, sponsorFeeUsdt: 5, structureFeeUsdt: 5 }),
  core: Object.freeze({ key: "core", packageUsdt: 100, sponsorFeeUsdt: 50, structureFeeUsdt: 50 }),
  founders: Object.freeze({ key: "founders", packageUsdt: 1000, sponsorFeeUsdt: 500, structureFeeUsdt: 500 }),
});

export const BOARD_PACKAGE_USDT = BOARD_TIER_RULES.starter.packageUsdt;
export const SPONSOR_FEE_USDT = BOARD_TIER_RULES.starter.sponsorFeeUsdt;
export const STRUCTURE_FEE_USDT = BOARD_TIER_RULES.starter.structureFeeUsdt;

export function createInitialBoardState(tierKey = "starter") {
  const rules = BOARD_TIER_RULES[tierKey];
  if (!rules) throw new Error("BOARD_TIER_NOT_FOUND");
  return {
    tierKey: rules.key,
    packageUsdt: rules.packageUsdt,
    sponsorFeeUsdt: rules.sponsorFeeUsdt,
    structureFeeUsdt: rules.structureFeeUsdt,
    users: [null, {
      id: 1,
      name: "Me (ฉัน)",
      sponsorId: null,
      wallet: 0,
      sponsorEarnings: 0,
      board1Count: 1,
      board2Count: 0,
      nextPlacementSide: "left",
    }],
    board1: [null, createBoard1Position({ index: 1, ownerId: 1, sponsorId: null, isReentry: false })],
    board2: [],
    totalCapitalIn: 0,
    board2HoldingPool: 0,
    logs: [{ id: 1, type: "system", message: "Created root position #1 for Me (ฉัน)." }],
  };
}

export function addMember(currentState, { name, sponsorId }) {
  const state = structuredClone(currentState);
  const cleanName = String(name || "").trim();
  const sponsor = state.users[sponsorId];
  if (!cleanName) throw new Error("MEMBER_NAME_REQUIRED");
  if (!sponsor) throw new Error("SPONSOR_NOT_FOUND");

  let user = state.users.find((candidate) => candidate?.name.toLowerCase() === cleanName.toLowerCase());
  if (!user) {
    user = {
      id: state.users.length,
      name: cleanName,
      sponsorId,
      wallet: 0,
      sponsorEarnings: 0,
      board1Count: 0,
      board2Count: 0,
      nextPlacementSide: "left",
    };
    state.users.push(user);
  }

  state.totalCapitalIn += state.packageUsdt;
  placeBoard1Position(state, { ownerId: user.id, sponsorId, isReentry: false });
  return state;
}

export function loadReferenceDemo(tierKey = "starter") {
  let state = createInitialBoardState(tierKey);
  const demoMembers = [
    ["Bob", 1],
    ["Charlie", 1],
    ["David", 2],
    ["Eva", 2],
    ["Frank", 3],
    ["Grace", 3],
  ];
  for (const [name, sponsorId] of demoMembers) state = addMember(state, { name, sponsorId });
  return state;
}

export function getBoardSummary(state) {
  return {
    members: state.users.filter(Boolean).length,
    board1Positions: state.board1.filter(Boolean).length,
    board2Positions: state.board2.length,
    completedBoard2: state.board2.filter((position) => position.completed).length,
    totalWallets: state.users.reduce((sum, user) => sum + (user?.wallet || 0), 0),
    totalReserve: state.board1.reduce((sum, position) => sum + (position?.reserve || 0), 0),
  };
}

function createBoard1Position({ index, ownerId, sponsorId, isReentry }) {
  return {
    index,
    ownerId,
    sponsorId,
    reserve: 0,
    completed: false,
    isReentry,
    board2QueueIndex: null,
  };
}

function placeBoard1Position(state, { ownerId, sponsorId, isReentry, forcedIndex }) {
  const index = forcedIndex || getNextAvailableBoard1Index(state, sponsorId);
  const position = createBoard1Position({ index, ownerId, sponsorId, isReentry });
  state.board1[index] = position;
  state.users[ownerId].board1Count += 1;

  const effectiveSponsorId = isReentry
    ? (ownerId === 1 ? 1 : state.users[ownerId]?.sponsorId || 1)
    : sponsorId;
  const sponsor = state.users[effectiveSponsorId] || state.users[1];
  sponsor.wallet += state.sponsorFeeUsdt;
  sponsor.sponsorEarnings += state.sponsorFeeUsdt;

  const parentIndex = Math.floor(index / 2);
  const parent = state.board1[parentIndex];
  if (parent) {
    parent.reserve += state.structureFeeUsdt;
    state.logs.push(createLog(state, isReentry ? "reentry" : "board1", `${isReentry ? "Re-entry" : "New"} Board1 position #${index}; sponsor ${sponsor.name} +${state.sponsorFeeUsdt} USDT; parent #${parentIndex} reserve ${parent.reserve}/${state.packageUsdt}.`));
    if (parent.reserve >= state.packageUsdt) {
      parent.reserve -= state.packageUsdt;
      parent.completed = true;
      enterBoard2(state, parent);
    }
  } else {
    state.users[1].wallet += state.structureFeeUsdt;
  }
  return index;
}

function getNextAvailableBoard1Index(state, sponsorId) {
  const sponsor = state.users[sponsorId] || state.users[1];
  let sponsorRoot = 1;
  for (let index = 1; index < state.board1.length; index += 1) {
    if (state.board1[index]?.ownerId === sponsor.id) sponsorRoot = index;
  }

  const side = sponsor.nextPlacementSide || "left";
  let current = sponsorRoot;
  while (true) {
    const candidate = side === "left" ? current * 2 : current * 2 + 1;
    if (!state.board1[candidate]) {
      sponsor.nextPlacementSide = side === "left" ? "right" : "left";
      return candidate;
    }
    current = candidate;
  }
}

export function getReentryBoard1Index(state, ownerId) {
  let ownerRoot = 1;
  for (let index = 1; index < state.board1.length; index += 1) {
    if (state.board1[index]?.ownerId === ownerId) {
      ownerRoot = index;
      break;
    }
  }
  const queue = [ownerRoot];
  while (queue.length) {
    const current = queue.shift();
    const left = current * 2;
    if (!state.board1[left]) return left;
    queue.push(left);
    const right = current * 2 + 1;
    if (!state.board1[right]) return right;
    queue.push(right);
  }
  return 1;
}

function enterBoard2(state, board1Position) {
  const queueIndex = state.board2.length + 1;
  const queuePosition = {
    queueIndex,
    board1Index: board1Position.index,
    ownerId: board1Position.ownerId,
    hasPaidCash: false,
    hasPaidReentry: false,
    completed: false,
  };
  state.board2.push(queuePosition);
  board1Position.board2QueueIndex = queueIndex;
  state.users[board1Position.ownerId].board2Count += 1;
  state.logs.push(createLog(state, "board2", `Board1 #${board1Position.index} entered Board2 queue #${queueIndex}.`));

  if (queueIndex === 1) {
    state.board2HoldingPool += state.packageUsdt;
    return;
  }

  const beneficiaryIndex = Math.floor(queueIndex / 2);
  const beneficiary = state.board2[beneficiaryIndex - 1];
  const beneficiaryUser = state.users[beneficiary.ownerId];
  if (queueIndex % 2 === 0) {
    beneficiary.hasPaidCash = true;
    beneficiaryUser.wallet += state.packageUsdt;
    state.logs.push(createLog(state, "cash", `Queue #${queueIndex} paid ${state.packageUsdt} USDT to queue #${beneficiaryIndex} (${beneficiaryUser.name}).`));
  } else {
    beneficiary.hasPaidReentry = true;
    const reentryIndex = getReentryBoard1Index(state, beneficiary.ownerId);
    placeBoard1Position(state, {
      ownerId: beneficiary.ownerId,
      sponsorId: beneficiaryUser.sponsorId || 1,
      isReentry: true,
      forcedIndex: reentryIndex,
    });
    state.logs.push(createLog(state, "reentry", `Queue #${queueIndex} created a Board1 re-entry for queue #${beneficiaryIndex} (${beneficiaryUser.name}).`));
  }
  beneficiary.completed = beneficiary.hasPaidCash && beneficiary.hasPaidReentry;
}

function createLog(state, type, message) {
  return { id: state.logs.length + 1, type, message };
}
