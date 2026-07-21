"use client";

import { useMemo, useRef, useState } from "react";
import type React from "react";
import type { Language, TierKey } from "./membership-tiers";
import { membershipTiers, tierOrder } from "./membership-tiers";
import { getVisibleBoard1Indexes } from "./board-view-model.mjs";
import {
  addMember,
  createInitialBoardState,
  getBoardSummary,
  loadReferenceDemo,
} from "./demo-board-engine.mjs";

const quickNames = ["Harry", "Iris", "Jack", "Kevin", "Laura", "Max", "Nora", "Oscar"];
export type BoardState = ReturnType<typeof createInitialBoardState>;
export type TierStates = Record<TierKey, BoardState>;
type TierHistories = Record<TierKey, BoardState[]>;

export const createTierStates = (): TierStates => ({
  starter: createInitialBoardState("starter"),
  core: createInitialBoardState("core"),
  founders: createInitialBoardState("founders"),
});
const createTierHistories = (): TierHistories => ({ starter: [], core: [], founders: [] });
const formatUsdt = (value: number) => new Intl.NumberFormat("en-US").format(value);

export function DemoBoardSimulator({ language, interactive = true, states, setStates, tier, setTier }: { language: Language; interactive?: boolean; states: TierStates; setStates: React.Dispatch<React.SetStateAction<TierStates>>; tier: TierKey; setTier: (tier: TierKey) => void }) {
  const th = language === "th";
  const [histories, setHistories] = useState<TierHistories>(createTierHistories);
  const [board, setBoard] = useState<"board1" | "board2">("board1");
  const [name, setName] = useState("");
  const [sponsorId, setSponsorId] = useState(1);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(1);
  const [error, setError] = useState("");
  const state = states[tier];
  const history = histories[tier];
  const tierData = membershipTiers[tier];
  const summary = useMemo(() => getBoardSummary(state), [state]);
  const auditDifference = state.totalCapitalIn - summary.totalWallets - summary.totalReserve - state.board2HoldingPool;

  const commit = (next: typeof state) => {
    setHistories((items) => ({ ...items, [tier]: [...items[tier].slice(-19), state] }));
    setStates((items) => ({ ...items, [tier]: next }));
    setError("");
  };
  const register = (memberName: string, memberSponsorId: number) => {
    try {
      commit(addMember(state, { name: memberName, sponsorId: memberSponsorId }));
      setName("");
    } catch {
      setError(th ? "กรุณากรอกชื่อและเลือก Sponsor ที่ถูกต้อง" : "Enter a name and choose a valid sponsor.");
    }
  };
  const addQuickMembers = (count: number) => {
    let next = state;
    for (let index = 0; index < count; index += 1) {
      const suffix = next.users.length;
      const memberName = `${quickNames[(suffix - 2) % quickNames.length]} ${String(suffix).padStart(2, "0")}`;
      next = addMember(next, { name: memberName, sponsorId });
    }
    commit(next);
  };
  const undo = () => {
    const previous = history.at(-1);
    if (!previous) return;
    setStates((items) => ({ ...items, [tier]: previous }));
    setHistories((items) => ({ ...items, [tier]: items[tier].slice(0, -1) }));
    setSelectedIndex(1);
  };
  const reset = () => {
    setHistories((items) => ({ ...items, [tier]: [...items[tier].slice(-19), state] }));
    setStates((items) => ({ ...items, [tier]: createInitialBoardState(tier) }));
    setSelectedIndex(1);
    setBoard("board1");
  };
  const loadDemo = () => {
    setHistories((items) => ({ ...items, [tier]: [...items[tier].slice(-19), state] }));
    setStates((items) => ({ ...items, [tier]: loadReferenceDemo(tier) }));
    setSelectedIndex(1);
  };
  const selectTier = (nextTier: TierKey) => {
    setTier(nextTier);
    setSelectedIndex(1);
    setSponsorId(1);
    setError("");
  };

  return <div className="page board-simulator">
    <section className="section-intro compact board-sim-heading">
      <div><span className="status-pill">{interactive ? "WEB-3-MLM RULES · SIMULATION" : "WEB-3-MLM · BOARD VIEWER"}</span><h2>{interactive ? (th ? "ทดลองการทำงาน Board1 และ Board2" : "Test Board1 and Board2 behavior") : (th ? "สถานะ Board1 และ Board2" : "Board1 and Board2 status")}</h2><p>{interactive ? (th ? "เพิ่มสมาชิก เลือก Sponsor และติดตามการจัดตำแหน่ง การจ่าย และ Re-entry แบบ Deterministic" : "Add members, choose sponsors, and trace deterministic placement, payout, and re-entry.") : (th ? "ติดตามตำแหน่ง สถานะการจ่าย และ Re-entry จากข้อมูลระบบ" : "Track positions, payout status, and re-entry from system data.")}</p></div>
      {interactive && <span className="demo-chip">{formatUsdt(state.packageUsdt)} USDT · {formatUsdt(state.sponsorFeeUsdt)} SPONSOR · {formatUsdt(state.structureFeeUsdt)} STRUCTURE</span>}
    </section>

    <section className="board-tier-switcher" aria-label={th ? "เลือกระดับแผนผัง" : "Choose board tier"}>
      {tierOrder.map((tierKey) => { const item = membershipTiers[tierKey]; return <button key={tierKey} className={`board-tier-option ${tierKey} ${tier === tierKey ? "selected" : ""}`} aria-pressed={tier === tierKey} onClick={() => selectTier(tierKey)}><span>{item.rarity}</span><b>{item.name}</b><strong>{item.price} <small>USDT</small></strong><em>Board1 + Board2</em></button>; })}
    </section>

    <section className="board-workbench">
      <div className={`board-stage panel tier-${tier}`}>
        <div className="board-stage-head"><div className="board-stage-titlebar"><div className="board-switch" role="group" aria-label={th ? "เลือกผัง" : "Choose board"}><button className={board === "board1" ? "selected" : ""} onClick={() => setBoard("board1")}>Board1 · Binary</button><button className={board === "board2" ? "selected" : ""} onClick={() => setBoard("board2")}>Board2 · FIFO</button></div><span className={`board-tier-badge ${tier}`}>{tierData.rarity} · {tierData.price} USDT</span></div><small>{th ? "คลิก Node เพื่อดูรายละเอียด" : "Select a node for details"}</small></div>
        {board === "board1" ? <Board1Tree key={tier} state={state} selectedIndex={selectedIndex} onSelect={setSelectedIndex} language={language} /> : <Board2Queue state={state} language={language} />}
      </div>
    </section>

    <section className="board-summary board-primary-summary" aria-label={interactive ? (th ? "สรุปการจำลอง" : "Simulation summary") : (th ? "สรุปสถานะผัง" : "Board status summary")}>
      <Summary label={th ? "สมาชิก" : "Members"} value={summary.members} />
      <Summary label="Board1" value={summary.board1Positions} />
      <Summary label="Board2" value={summary.board2Positions} />
    </section>
    <details className="board-secondary-summary">
      <summary>{th ? "รายละเอียดการเงินและการตรวจสอบสมดุล" : "Financial and balance details"}<span>{auditDifference === 0 ? (th ? "สมดุลแล้ว" : "Balanced") : (th ? "ต้องตรวจสอบ" : "Review")}</span></summary>
      <div className="board-secondary-grid"><Summary label={th ? "จบรอบ Board2" : "Board2 completed"} value={summary.completedBoard2} /><Summary label={th ? "เงินใน Wallet" : "Wallet payout"} value={`${formatUsdt(summary.totalWallets)} U`} /><Summary label={th ? "ทุนเข้า" : "Capital in"} value={`${formatUsdt(state.totalCapitalIn)} U`} /></div>
      <div className={auditDifference === 0 ? "board-audit balanced" : "board-audit unbalanced"}>● {auditDifference === 0 ? (th ? `ตรวจสอบสมดุลแล้ว: Wallet ${summary.totalWallets} + Reserve ${summary.totalReserve} + Board2 Pool ${state.board2HoldingPool} = ${state.totalCapitalIn} USDT` : `Balance verified: Wallet ${summary.totalWallets} + Reserve ${summary.totalReserve} + Board2 Pool ${state.board2HoldingPool} = ${state.totalCapitalIn} USDT`) : (th ? `ยอดไม่สมดุล ${auditDifference} USDT` : `Unbalanced by ${auditDifference} USDT`)}</div>
    </details>

    {interactive && <details className="board-controls panel">
        <summary><span><b>{th ? "เครื่องมือจำลอง" : "Simulation tools"}</b><small>{th ? "เพิ่มสมาชิก · Quick Test · Undo · Reset" : "Add members · Quick test · Undo · Reset"}</small></span><em>{tierData.name} · POLYGON DEMO</em></summary>
        <div className="board-controls-body">
          <label>{th ? "ชื่อสมาชิก" : "Member name"}<input value={name} onChange={(event) => setName(event.target.value)} onKeyDown={(event) => event.key === "Enter" && register(name, sponsorId)} placeholder={th ? "เช่น Somchai" : "e.g. Alice"} /></label>
          <label>Sponsor<select value={sponsorId} onChange={(event) => setSponsorId(Number(event.target.value))}>{state.users.filter(Boolean).map((user) => user && <option value={user.id} key={user.id}>#{user.id} · {user.name}</option>)}</select></label>
          {error && <p className="board-error">{error}</p>}
          <button className="primary-action" onClick={() => register(name, sponsorId)}>{th ? "เพิ่มสมาชิก 1 คน" : "Add one member"}</button>
          <div className="board-control-grid"><button className="outline" onClick={() => addQuickMembers(1)}>Quick +1</button><button className="outline" onClick={() => addQuickMembers(5)}>Quick +5</button><button className="outline" onClick={loadDemo}>{th ? "โหลด Demo 6 คน" : "Load 6-member demo"}</button><button className="outline" onClick={undo} disabled={!history.length}>Undo</button></div>
          <button className="board-reset" onClick={reset}>{th ? "เริ่มการจำลองใหม่" : "Reset simulation"}</button>
          <div className="board-rule-note"><strong>{th ? `กติกา ${tierData.name} · ${tierData.price} USDT` : `${tierData.name} rules · ${tierData.price} USDT`}</strong><ol><li>{th ? "Board1 วางแบบ Binary ซ้าย/ขวาสลับกัน" : "Board1 alternates binary left/right placement."}</li><li>{th ? `Parent รับ ${formatUsdt(state.structureFeeUsdt)} USDT ต่อ Child หนึ่งตำแหน่ง` : `Parent reserves ${formatUsdt(state.structureFeeUsdt)} USDT per child.`}</li><li>{th ? `ครบ ${formatUsdt(state.packageUsdt)} USDT เข้า Board2 FIFO` : `At ${formatUsdt(state.packageUsdt)} USDT, enter Board2 FIFO.`}</li><li>{th ? "คิวคู่จ่ายเงิน คิวคี่สร้าง Re-entry" : "Even queue pays cash; odd queue creates re-entry."}</li></ol></div>
        </div>
      </details>}

    {interactive && <details className="panel board-events"><summary className="panel-head"><div><p className="eyebrow">{tierData.name} · EVENT STREAM</p><h3>{th ? "ลำดับการทำงานจริงของ Engine" : "Engine execution order"}</h3></div><span className="tag">{state.logs.length} EVENTS</span></summary><div className="board-event-list">{[...state.logs].reverse().map((log) => <div className={`board-event ${log.type}`} key={log.id}><b>#{String(log.id).padStart(2, "0")}</b><span>{log.message}</span></div>)}</div></details>}
  </div>;
}

function Summary({ label, value }: { label: string; value: string | number }) { return <article><span>{label}</span><strong>{value}</strong></article>; }

function Board1Tree({ state, selectedIndex, onSelect, language }: { state: ReturnType<typeof createInitialBoardState>; selectedIndex: number | null; onSelect: (index: number) => void; language: Language }) {
  const th = language === "th";
  const [showAllPositions, setShowAllPositions] = useState(false);
  const [zoom, setZoom] = useState(1);
  const canvasRef = useRef<HTMLDivElement>(null);
  const visibleIndexes = useMemo(() => getVisibleBoard1Indexes(state.board1, showAllPositions), [state.board1, showAllPositions]);
  const visibleSet = useMemo(() => new Set(visibleIndexes), [visibleIndexes]);
  const allNodes = Array.from({ length: 31 }, (_, offset) => offset + 1).map((index) => {
    const level = Math.floor(Math.log2(index));
    const count = 2 ** level;
    const column = index - count;
    return { index, x: 500 / count + column * (1000 / count), y: 55 + level * 115, position: state.board1[index] || null };
  });
  const nodes = allNodes.filter((node) => visibleSet.has(node.index));
  const zoomBy = (amount: number) => setZoom((value) => Math.min(2, Math.max(1, Number((value + amount).toFixed(2)))));
  const fitBoard = () => { setZoom(1); canvasRef.current?.scrollTo({ left: 0, top: 0, behavior: "smooth" }); };
  const centerRoot = () => { const canvas = canvasRef.current; if (canvas) canvas.scrollTo({ left: Math.max(0, (canvas.scrollWidth - canvas.clientWidth) / 2), top: 0, behavior: "smooth" }); };

  return <>
    <div className="board-view-tools" aria-label={th ? "เครื่องมือดู Board1" : "Board1 viewer tools"}>
      <button type="button" onClick={fitBoard}>{th ? "พอดีจอ" : "Fit"}</button>
      <button type="button" onClick={() => zoomBy(-.25)} aria-label={th ? "ย่อผัง" : "Zoom out"}>−</button>
      <span>{Math.round(zoom * 100)}%</span>
      <button type="button" onClick={() => zoomBy(.25)} aria-label={th ? "ขยายผัง" : "Zoom in"}>+</button>
      <button type="button" onClick={centerRoot}>{th ? "จัด Root กึ่งกลาง" : "Center root"}</button>
      <button type="button" className={showAllPositions ? "selected" : ""} aria-pressed={showAllPositions} onClick={() => setShowAllPositions((value) => !value)}>{showAllPositions ? (th ? "ซ่อนช่องว่าง" : "Hide empty") : (th ? "แสดงทุกตำแหน่ง" : "Show all positions")}</button>
    </div>
    <div className="board-stage-body board1">
      <div className="board1-canvas" ref={canvasRef}><div className="board1-zoom-layer" style={{ width: `${zoom * 100}%` }}><svg viewBox="0 0 1000 540" role="img" aria-label={th ? "ผัง Board1 แบบ Binary" : "Binary Board1 tree"}>
    {nodes.filter((node) => node.index > 1 && node.position && state.board1[Math.floor(node.index / 2)]).map((node) => { const parent = allNodes[Math.floor(node.index / 2) - 1]; return <line key={`edge-${node.index}`} x1={parent.x} y1={parent.y} x2={node.x} y2={node.y} className={state.board1[Math.floor(node.index / 2)]?.completed ? "complete" : ""} />; })}
    {nodes.map((node) => {
      const user = node.position ? state.users[node.position.ownerId] : null;
      const classes = [node.position ? "occupied" : "empty", node.position?.completed ? "complete" : "", node.position?.isReentry ? "reentry" : "", selectedIndex === node.index ? "selected" : ""].filter(Boolean).join(" ");
      return <g className={classes} key={node.index} onClick={() => node.position && onSelect(node.index)} role={node.position ? "button" : undefined} tabIndex={node.position ? 0 : undefined} onKeyDown={(event) => event.key === "Enter" && node.position && onSelect(node.index)}><circle cx={node.x} cy={node.y} r="30"/><text x={node.x} y={node.y - 4}>{node.position ? `#${node.index}` : "·"}</text>{user && <text className="node-name" x={node.x} y={node.y + 12}>{user.name.slice(0, 10)}</text>}</g>;
    })}
      </svg></div></div>
      <aside className="board-node-inspector">{selectedIndex && state.board1[selectedIndex] ? <NodeDetails state={state} index={selectedIndex} language={language} /> : <p>{th ? "เลือก Node เพื่อดูรายละเอียด" : "Select a node to inspect it."}</p>}</aside>
    </div>
  </>;
}

function NodeDetails({ state, index, language }: { state: ReturnType<typeof createInitialBoardState>; index: number; language: Language }) {
  const th = language === "th"; const position = state.board1[index]; const user = state.users[position.ownerId]; const sponsor = position.sponsorId ? state.users[position.sponsorId] : null; const tierData = membershipTiers[state.tierKey as TierKey];
  return <div className="node-details"><div><span>{th ? "ระดับ" : "Tier"}</span><strong>{tierData.name} · {tierData.price} U</strong></div><div><span>{th ? "ตำแหน่ง" : "Position"}</span><strong>#{index}</strong></div><div><span>{th ? "เจ้าของ" : "Owner"}</span><strong>{user.name}</strong></div><div><span>Sponsor</span><strong>{sponsor?.name || "System"}</strong></div><div><span>Reserve</span><strong>{formatUsdt(position.reserve)}/{formatUsdt(state.packageUsdt)} U</strong></div><div><span>Status</span><strong>{position.completed ? "BOARD2" : position.isReentry ? "RE-ENTRY" : "ACTIVE"}</strong></div></div>;
}

function Board2Queue({ state, language }: { state: ReturnType<typeof createInitialBoardState>; language: Language }) {
  const th = language === "th";
  if (!state.board2.length) return <div className="board-empty">{th ? "ยังไม่มีตำแหน่งใน Board2 — เพิ่มสมาชิกให้ Parent ใน Board1 ครบ 2 ตำแหน่ง" : "Board2 is empty — give a Board1 parent two child positions."}</div>;
  return <div className="board2-queue">{state.board2.map((position, index) => { const user = state.users[position.ownerId]; return <article className={position.completed ? "completed" : index === state.board2.findIndex((item) => !item.completed) ? "active" : ""} key={position.queueIndex}><div><b>QUEUE #{position.queueIndex}</b><small>Board1 #{position.board1Index}</small></div><strong>{user.name}</strong><p><span className={position.hasPaidCash ? "done" : ""}>● {formatUsdt(state.packageUsdt)}U {th ? "เงินสด" : "cash"}</span><span className={position.hasPaidReentry ? "done reentry" : ""}>● {formatUsdt(state.packageUsdt)}U Re-entry</span></p>{index < state.board2.length - 1 && <i>↓</i>}</article>; })}</div>;
}
