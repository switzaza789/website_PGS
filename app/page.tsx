"use client";

import { useState } from "react";
import type { Language, TierKey } from "./membership-tiers";
import { membershipTiers, tierOrder } from "./membership-tiers";
import { PhoenixPass } from "./phoenix-pass";
import { DemoMembershipFlow } from "./demo-membership-flow";
import { DemoTransactions } from "./demo-transactions";
import { createTierStates, DemoBoardSimulator } from "./demo-board-simulator";
import type { BoardState, TierStates } from "./demo-board-simulator";
import { DeferredPhoenixVideo } from "./deferred-phoenix-video";

const navCopy = { th: ["ภาพรวม", "สมาชิก", "แผนผัง", "รายได้", "ธุรกรรม"], en: ["Overview", "Membership", "Network", "Earnings", "Transactions"] };
const navIcons = ["⌂", "◇", "⌘", "↗", "≋"];

const Icon = ({ name }: { name: string }) => <span className="icon" aria-hidden>{name}</span>;

export default function Home() {
  const [active, setActive] = useState(0);
  const [copied, setCopied] = useState(false);
  const [wallet, setWallet] = useState(false);
  const [connecting, setConnecting] = useState(false);
  const [language, setLanguage] = useState<Language>("th");
  const [boardStates, setBoardStates] = useState<TierStates>(createTierStates);
  const [boardTier, setBoardTier] = useState<TierKey>("starter");
  const nav = navCopy[language];
  const selectPage = (index: number) => {
    setActive(index);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  const connectDemo = () => {
    setConnecting(true);
    window.setTimeout(() => {
      setWallet(true);
      setConnecting(false);
    }, 850);
  };

  if (!wallet) {
    return <PublicLanding onConnect={connectDemo} connecting={connecting} language={language} setLanguage={setLanguage} />;
  }

  return (
    <main className="shell">
      <div className="demo-ribbon">POLYGON · {language === "th" ? "โหมดจำลอง" : "DEMO MODE"}</div>
      <aside className="sidebar">
        <div className="brand"><div className="brandmark">P</div><div><strong>PGS</strong><span>MEMBER NETWORK</span></div></div>
        <nav>
          <p className="nav-label">{language === "th" ? "พื้นที่สมาชิก" : "Member area"}</p>
          {nav.map((item, i) => <button key={item} className={active === i ? "nav-item active" : "nav-item"} aria-current={active === i ? "page" : undefined} onClick={() => selectPage(i)}><Icon name={navIcons[i]} />{item}</button>)}
        </nav>
        <div className="sidebar-bottom">
          <div className="security"><span className="live-dot"/><div><strong>{language === "th" ? "ระบบจำลองพร้อมใช้งาน" : "Simulation ready"}</strong><small>Polygon · Demo</small></div></div>
          <button className="profile"><div className="avatar">NP</div><div><strong>Niwborn</strong><small>0x7A3...91F2</small></div><span>•••</span></button>
        </div>
      </aside>

      <section className="content">
        <header>
          <button className="mobile-brand" aria-label={language === "th" ? "กลับไปหน้าภาพรวม" : "Go to overview"} onClick={() => selectPage(0)}>PGS</button>
          <div><p className="eyebrow">PGS MEMBER PORTAL</p><h1>{nav[active]}</h1></div>
          <div className="header-actions"><LanguageToggle language={language} setLanguage={setLanguage}/><button className={wallet ? "wallet connected" : "wallet"} onClick={() => setWallet(!wallet)}>{wallet ? "● DEMO · 0x7A3...91F2" : language === "th" ? "ทดลองเชื่อม Wallet" : "Try demo Wallet"}</button></div>
        </header>

        {active === 0 && <Dashboard language={language} copied={copied} onCopy={() => {setCopied(true); setTimeout(()=>setCopied(false), 1500)}} boardState={boardStates[boardTier]} boardTier={boardTier} onOpenNetwork={() => selectPage(2)} />}
        {active === 1 && <Membership language={language} />}
        {active === 2 && <Network language={language} states={boardStates} setStates={setBoardStates} tier={boardTier} setTier={setBoardTier} />}
        {active === 3 && <Earnings language={language} />}
        {active === 4 && <Transactions language={language} />}
      </section>
      <nav className="mobile-bottom-nav" aria-label={language === "th" ? "เมนูสมาชิก" : "Member navigation"}>
        {nav.map((item, i) => (
          <button key={item} className={active === i ? "active" : ""} aria-current={active === i ? "page" : undefined} onClick={() => selectPage(i)}>
            <Icon name={navIcons[i]} />
            <span>{item}</span>
          </button>
        ))}
      </nav>
    </main>
  );
}

function LanguageToggle({language,setLanguage}:{language:Language;setLanguage:(language:Language)=>void}) {
  return <div className="language-toggle" role="group" aria-label="Language"><button className={language === "th" ? "selected" : ""} onClick={()=>setLanguage("th")}>TH</button><button className={language === "en" ? "selected" : ""} onClick={()=>setLanguage("en")}>EN</button></div>
}

function PublicLanding({ onConnect, connecting, language, setLanguage }: { onConnect: () => void; connecting: boolean; language: Language; setLanguage: (language:Language)=>void }) {
  const th = language === "th";
  const tierDescriptions: Record<TierKey, string> = {
    starter: th ? "เริ่มต้นเรียนรู้ระบบ" : "A simple way to get started",
    core: th ? "สำหรับสมาชิกที่พร้อมเติบโต" : "For members ready to grow",
    founders: th ? "สิทธิ์สมาชิกระดับสูงสุด" : "The complete member experience",
  };
  return <main className="public-site">
    <div className="demo-ribbon">POLYGON · {th ? "โหมดจำลอง" : "DEMO MODE"}</div>
    <nav className="public-nav">
      <div className="brand"><div className="brandmark">P</div><div><strong>PGS</strong><span>MEMBER NETWORK</span></div></div>
      <div className="public-links"><a href="#membership">Membership</a><a href="#how">{th ? "วิธีเริ่มต้น" : "How it works"}</a></div>
      <div className="public-actions"><LanguageToggle language={language} setLanguage={setLanguage}/><button className="wallet" onClick={onConnect} disabled={connecting}>{connecting ? (th ? "กำลังจำลอง..." : "Simulating...") : (th ? "ทดลองเชื่อม Wallet" : "Try demo Wallet")}</button></div>
    </nav>

    <section className="landing-hero phoenix-landing-hero">
      <DeferredPhoenixVideo />
      <div className="landing-copy">
        <span className="status-pill">● WEB3 MEMBERSHIP EXPERIENCE</span>
        <h1>{th ? "สมาชิกดิจิทัล" : "Digital membership"}<br/><em>{th ? "ที่คุณตรวจสอบได้" : "you can verify"}</em></h1>
        <p>{th ? "เข้าถึง NFT Membership, เครือข่ายสมาชิก และรายงานผลตอบแทน ผ่านระบบเดียวที่ออกแบบให้โปร่งใสและเข้าใจง่าย" : "Access your NFT membership, member network, and earning reports through one transparent, easy-to-understand experience."}</p>
        <div className="landing-cta"><button className="primary-action" onClick={onConnect} disabled={connecting}>{connecting ? (th ? "กำลังเปิด Demo Portal..." : "Opening demo portal...") : (th ? "ทดลอง Flow เชื่อม Wallet" : "Try the Wallet flow")}</button><a href="#membership">{th ? "ดู Membership ทั้ง 3 ระดับ" : "Explore all 3 membership tiers"} ↓</a></div>
        <div className="trust-row"><span>✓ Polygon Target Chain</span><span>✓ Mock NFT Verification</span><span>✓ No Real Transaction</span></div>
      </div>
      <div className="hero-visual">
        <div className="halo"/><PhoenixPass tier="founders" language={language} variant="hero" />
        <div className="float-stat fs1"><small>{th ? "สมาชิกในเครือข่าย" : "Network members"}</small><strong>42</strong><span>{th ? "+8 เดือนนี้" : "+8 this month"}</span></div>
        <div className="float-stat fs2"><small>{th ? "ระบบเครือข่าย" : "Network status"}</small><strong>DEMO</strong><span>● Polygon</span></div>
      </div>
    </section>

    <section className="public-stats"><div><strong>3</strong><span>Membership Tiers</span></div><div><strong>24/7</strong><span>On-chain Access</span></div><div><strong>2</strong><span>Board Networks</span></div><div><strong>TH / EN</strong><span>Supported</span></div></section>

    <section className="membership-section" id="membership"><p className="eyebrow">CHOOSE YOUR MEMBERSHIP</p><h2>{th ? "เริ่มต้นในระดับที่เหมาะกับคุณ" : "Start with the tier that fits you"}</h2><p className="section-lede">{th ? "สมาชิกทุกระดับได้รับ NFT Pass และพื้นที่ติดตามข้อมูลส่วนตัว" : "Every tier includes an NFT Pass and a personal member dashboard."}</p><div className="public-tiers">{tierOrder.map((tierKey,i)=>{const tier=membershipTiers[tierKey];return <article className={i===2?"public-tier featured":"public-tier"} key={tier.key}>{i===2&&<span className="recommended">{th ? "ยอดนิยม" : "POPULAR"}</span>}<PhoenixPass tier={tierKey} language={language} variant="full"/><small>{tier.name} MEMBERSHIP</small><h3>${tier.price} <i>USDT</i></h3><p>{tierDescriptions[tierKey]}</p><ul><li>✓ NFT Member Pass</li><li>✓ Personal Dashboard</li><li>✓ Referral Tracking</li>{i>0&&<li>✓ Board Network Access</li>}</ul><button onClick={onConnect}>{th ? "เลือก" : "Choose"} {tier.name}</button></article>})}</div></section>

    <section className="how-section" id="how"><p className="eyebrow">HOW IT WORKS · SIMULATION</p><h2>{th ? "ทดลองใช้งานเพียง 3 ขั้นตอน" : "Try the experience in 3 steps"}</h2><div className="how-grid"><article><b>01</b><span>⌁</span><h3>{th ? "จำลองการเชื่อม Wallet" : "Simulate Wallet connection"}</h3><p>{th ? "ทดลองสถานะเชื่อมต่อ Wallet โดยยังไม่ขอลายเซ็นหรือเชื่อมเครือข่ายจริง" : "Preview the connected Wallet state without requesting a signature or live network access."}</p></article><article><b>02</b><span>◇</span><h3>{th ? "เลือกและเปรียบเทียบ Membership" : "Compare Memberships"}</h3><p>{th ? "เปรียบเทียบแพ็กเกจและตรวจสอบรายละเอียดก่อนยืนยันรายการจำลอง" : "Compare tiers and review details before confirming a simulated transaction."}</p></article><article><b>03</b><span>⌘</span><h3>{th ? "ทดสอบ Member Portal" : "Test Member Portal"}</h3><p>{th ? "ทดลอง NFT Pass, เครือข่าย, Referral และรายงานธุรกรรมบน Polygon Demo" : "Explore NFT Passes, network, referrals, and Polygon demo transaction reports."}</p></article></div></section>
    <footer><div className="brand"><div className="brandmark">P</div><div><strong>PGS</strong><span>MEMBER NETWORK</span></div></div><p>{th ? "ข้อมูลและธุรกรรมทั้งหมดเป็น Simulation ไม่มีการใช้สินทรัพย์จริง" : "All data and transactions are simulated; no real assets are used."}</p><button className="wallet" onClick={onConnect} disabled={connecting}>{th ? "ทดลอง Member Portal" : "Try Member Portal"} →</button></footer>
  </main>
}

function Dashboard({language,copied,onCopy,boardState,boardTier,onOpenNetwork}:{language:Language;copied:boolean;onCopy:()=>void;boardState:BoardState;boardTier:TierKey;onOpenNetwork:()=>void}) {
 const th=language==="th";
 return <div className="page">
   <section className="hero">
    <div><span className="status-pill">● NFT MOCK VERIFIED · POLYGON</span><h2>{th?"สวัสดี":"Welcome"}, Niwborn</h2><p>{th?"ภาพรวมจำลองของสมาชิก เครือข่าย และผลตอบแทนในที่เดียว":"Your simulated membership, network, and earnings in one place."}</p></div>
    <PhoenixPass tier="founders" language={language} variant="dashboard" memberId="#PGS-01042" memberSince="MEMBER SINCE · JUL 2026" />
   </section>
   <section className="metrics">
    <Metric label={th?"มูลค่าสมาชิก":"Membership value"} value="$1,000.00" note="Founders Tier" icon="◈" />
    <Metric label={th?"รายได้รวม":"Total earnings"} value="$284.50" note={th?"↑ 12.4% เดือนนี้":"↑ 12.4% this month"} icon="↗" positive />
    <Metric label={th?"สมาชิกในเครือข่าย":"Network members"} value="42" note={th?"8 แนะนำโดยตรง":"8 direct referrals"} icon="⌘" />
    <Metric label={th?"FCD พร้อมใช้":"Available FCD"} value="1,284.20" note="≈ $128.42" icon="F" />
   </section>
   <section className="main-grid">
    <NetworkPulse state={boardState} tier={boardTier} language={language} onOpen={onOpenNetwork} />
    <article className="panel"><div className="panel-head"><div><p className="eyebrow">QUICK ACTION</p><h3>{th?"ลิงก์แนะนำของคุณ":"Your referral link"}</h3></div><span className="tag">{th?"พร้อมแชร์":"Ready to share"}</span></div><p className="muted">{th?"เชิญสมาชิกใหม่เข้าสู่เครือข่าย PGS ผ่านลิงก์เฉพาะของคุณ":"Invite new members to PGS with your personal referral link."}</p><div className="ref-box"><code>pgs.network/r/NIWBORN25</code><button onClick={onCopy}>{copied ? (th?"คัดลอกแล้ว ✓":"Copied ✓") : (th?"คัดลอก":"Copy")}</button></div><div className="ref-stats"><div><strong>8</strong><span>{th?"สมัครแล้ว":"Sign-ups"}</span></div><div><strong>5</strong><span>Active</span></div><div><strong>62.5%</strong><span>Conversion</span></div></div></article>
   </section>
   <section className="panel activity"><div className="panel-head"><div><p className="eyebrow">RECENT ACTIVITY</p><h3>{th?"ความเคลื่อนไหวล่าสุด":"Recent activity"}</h3></div><button className="text-btn">{th?"ดูทั้งหมด":"View all"}</button></div><Activity /></section>
 </div>
}

function Metric({label,value,note,icon,positive}:{label:string,value:string,note:string,icon:string,positive?:boolean}) {return <article className="metric"><div className="metric-top"><span>{label}</span><b>{icon}</b></div><strong>{value}</strong><small className={positive?"positive":""}>{note}</small></article>}

function NetworkPulse({state,tier,language,onOpen}:{state:BoardState;tier:TierKey;language:Language;onOpen:()=>void}) {
  const th = language === "th";
  const tierData = membershipTiers[tier];
  const positions = [
    {index:1,x:300,y:34}, {index:2,x:175,y:112}, {index:3,x:425,y:112},
    {index:4,x:105,y:202}, {index:5,x:245,y:202}, {index:6,x:355,y:202}, {index:7,x:495,y:202},
  ];
  const visible = positions.filter(({index}) => state.board1[index] || (index > 1 && state.board1[Math.floor(index / 2)]));
  const initials = (name:string) => name.replace(/\s*\([^)]*\)\s*/g, " ").trim().split(/\s+/).map((part) => part[0]).join("").slice(0,2).toUpperCase();
  return <article className={`panel network-preview tier-${tier}`} role="link" tabIndex={0} onClick={onOpen} onKeyDown={(event) => (event.key === "Enter" || event.key === " ") && onOpen()} aria-label={th ? `เปิดแผนผัง ${tierData.name} ${tierData.price} USDT` : `Open ${tierData.name} ${tierData.price} USDT network`}>
    <div className="panel-head"><div><p className="eyebrow">NETWORK PULSE · LIVE SIMULATION</p><h3>{th?"แผนผังสมาชิกปัจจุบัน":"Current member network"}</h3></div><span className="text-btn">{th?"เปิดหน้าผัง":"Open network"} →</span></div>
    <div className="pulse-tier-row"><span className={`board-tier-badge ${tier}`}>{tierData.name} · {tierData.price} USDT</span><small>{state.board1.filter(Boolean).length} Board1 · {state.board2.length} Board2</small></div>
    <svg className="network-pulse-tree" viewBox="0 0 600 245" role="img" aria-label={th ? "ภาพย่อแผนผัง Board1 ปัจจุบัน" : "Current Board1 preview"}>
      {visible.filter(({index}) => index > 1).map((node) => { const parent = positions.find(({index}) => index === Math.floor(node.index / 2)); return parent ? <line key={`line-${node.index}`} x1={parent.x} y1={parent.y} x2={node.x} y2={node.y} className={state.board1[node.index] ? "active" : "available"} /> : null; })}
      {visible.map((node) => { const position = state.board1[node.index]; const user = position ? state.users[position.ownerId] : null; return <g key={node.index} className={position ? (node.index === 1 ? "you" : "active") : "available"}><circle cx={node.x} cy={node.y} r={node.index === 1 ? 29 : 25}/><text x={node.x} y={node.y + 4}>{user ? initials(user.name) : "+"}</text></g>; })}
    </svg>
    <div className="legend"><span><i className="gold"/>{th?"คุณ":"You"}</span><span><i className="green"/>Active</span><span><i/>{th?"ตำแหน่งว่าง":"Available"}</span></div>
  </article>;
}

function Activity(){const rows=[["Membership upgraded","Founders Tier · $1,000","วันนี้ 14:32","+$900.00"],["Referral reward","จากสมาชิก SOMCHAI.K","วันนี้ 11:08","+$10.00"],["FCD daily reward","Node distribution","เมื่อวาน 00:05","+15.00 FCD"]];return <div className="rows">{rows.map((r,i)=><div className="row" key={r[0]}><span className="row-icon">{["◇","↗","F"][i]}</span><div><strong>{r[0]}</strong><small>{r[1]}</small></div><time>{r[2]}</time><b>{r[3]}</b></div>)}</div>}

function Membership({language}:{language:Language}){return <DemoMembershipFlow language={language}/>}

function Network({language,states,setStates,tier,setTier}:{language:Language;states:TierStates;setStates:React.Dispatch<React.SetStateAction<TierStates>>;tier:TierKey;setTier:(tier:TierKey)=>void}){return <DemoBoardSimulator language={language} states={states} setStates={setStates} tier={tier} setTier={setTier}/>}

function Earnings({language}:{language:Language}){const th=language==="th";return <div className="page"><section className="metrics"><Metric label={th?"รายได้รวม":"Total earnings"} value="$284.50" note="All time" icon="↗"/><Metric label={th?"รายได้เดือนนี้":"This month"} value="$64.20" note="↑ 12.4%" icon="◫" positive/><Metric label={th?"รอรับ":"Pending"} value="$18.00" note={th?"กำลังตรวจสอบ":"Under review"} icon="◷"/><Metric label="FCD Reward" value="1,284.20" note={th?"พร้อมใช้งาน":"Available"} icon="F"/></section><article className="panel chart"><div className="panel-head"><div><p className="eyebrow">EARNING TREND</p><h3>{th?"ภาพรวมผลตอบแทน 30 วัน":"30-day earning overview"}</h3></div><select><option>{th?"30 วันล่าสุด":"Last 30 days"}</option></select></div><div className="bars">{[22,36,28,48,44,62,57,78,65,88,74,94].map((h,i)=><i key={i} style={{height:h+'%'}}/>)}</div><div className="chart-labels"><span>15 Jun</span><span>22 Jun</span><span>29 Jun</span><span>6 Jul</span><span>14 Jul</span></div></article></div>}

function Transactions({language}:{language:Language}){return <DemoTransactions language={language}/>}
