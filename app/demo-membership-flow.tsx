"use client";

import { useState } from "react";
import type { Language, TierKey } from "./membership-tiers";
import { membershipTiers, tierOrder } from "./membership-tiers";
import { PhoenixPass } from "./phoenix-pass";

type FlowStage = "details" | "confirm" | "processing" | "success" | "failed";

const features = [
  { th: "NFT Membership Pass", en: "NFT Membership Pass", tiers: [true, true, true] },
  { th: "Member Dashboard", en: "Member Dashboard", tiers: [true, true, true] },
  { th: "Referral Tracking", en: "Referral Tracking", tiers: [true, true, true] },
  { th: "Board Network Access", en: "Board Network Access", tiers: [false, true, true] },
  { th: "Priority Member Benefits", en: "Priority Member Benefits", tiers: [false, false, true] },
];

export function DemoMembershipFlow({ language }: { language: Language }) {
  const th = language === "th";
  const [showComparison, setShowComparison] = useState(false);
  const [selectedTier, setSelectedTier] = useState<TierKey | null>(null);
  const [stage, setStage] = useState<FlowStage>("details");
  const descriptions: Record<TierKey, string> = {
    starter: th ? "เริ่มต้นเข้าถึงระบบ" : "Start accessing the platform",
    core: th ? "ปลดล็อกเครือข่ายและสิทธิ์หลัก" : "Unlock network access and core benefits",
    founders: th ? "ประสบการณ์สมาชิกสูงสุด" : "The complete membership experience",
  };

  const openFlow = (tier: TierKey) => {
    setSelectedTier(tier);
    setStage("details");
  };
  const closeFlow = () => selectedTier && stage !== "processing" && setSelectedTier(null);
  const runDemo = (result: "success" | "failed") => {
    setStage("processing");
    window.setTimeout(() => setStage(result), 1100);
  };

  return (
    <div className="page">
      <section className="section-intro membership-heading">
        <div>
          <span className="status-pill">MEMBERSHIP · POLYGON DEMO</span>
          <h2>{th ? "เลือกสิทธิ์ที่เติบโตไปกับคุณ" : "Choose a membership that grows with you"}</h2>
          <p>{th ? "จำลองการตรวจสอบ NFT บน Polygon ก่อนเชื่อม Smart Contract จริง" : "Simulate Polygon NFT verification before connecting a live smart contract."}</p>
        </div>
        <button className="outline compare-trigger" onClick={() => setShowComparison((value) => !value)} aria-expanded={showComparison}>
          {showComparison ? (th ? "ซ่อนตารางเปรียบเทียบ" : "Hide comparison") : (th ? "เปรียบเทียบสิทธิ์ทั้งหมด" : "Compare all benefits")}
        </button>
      </section>

      {showComparison && (
        <section className="comparison-panel panel" aria-label={th ? "ตารางเปรียบเทียบ Membership" : "Membership comparison"}>
          <div className="comparison-row comparison-head-row"><strong>{th ? "สิทธิประโยชน์" : "Benefit"}</strong>{tierOrder.map((key) => <b key={key}>{membershipTiers[key].name}</b>)}</div>
          {features.map((feature) => <div className="comparison-row" key={feature.en}><span>{th ? feature.th : feature.en}</span>{feature.tiers.map((included, index) => <i key={`${feature.en}-${index}`} className={included ? "included" : ""}>{included ? "✓" : "—"}</i>)}</div>)}
        </section>
      )}

      <div className="tiers">
        {tierOrder.map((tierKey, i) => {
          const tier = membershipTiers[tierKey];
          return <article className={i === 2 ? "tier featured" : "tier"} key={tier.key}>
            {i === 2 && <span className="recommended">{th ? "แนะนำ" : "RECOMMENDED"}</span>}
            <PhoenixPass tier={tierKey} language={language} variant="full" />
            <p className="eyebrow">{tier.name} PASS</p>
            <h3>${tier.price} <small>USDT</small></h3>
            <p>{descriptions[tierKey]}</p>
            <ul>{features.map((feature) => feature.tiers[i] && <li key={feature.en}>✓ {th ? feature.th : feature.en}</li>)}</ul>
            <button onClick={() => openFlow(tierKey)}>{th ? "ดูรายละเอียดและเลือก" : "Review and choose"} {tier.name}</button>
          </article>;
        })}
      </div>

      {selectedTier && <DemoPurchaseDialog language={language} tierKey={selectedTier} stage={stage} onStage={setStage} onRun={runDemo} onClose={closeFlow} />}
    </div>
  );
}

function DemoPurchaseDialog({ language, tierKey, stage, onStage, onRun, onClose }: { language: Language; tierKey: TierKey; stage: FlowStage; onStage: (stage: FlowStage) => void; onRun: (result: "success" | "failed") => void; onClose: () => void }) {
  const th = language === "th";
  const tier = membershipTiers[tierKey];
  return <div className="dialog-backdrop" role="presentation" onMouseDown={(event) => event.currentTarget === event.target && onClose()}>
    <section className="purchase-dialog" role="dialog" aria-modal="true" aria-labelledby="purchase-title">
      <button className="dialog-close" onClick={onClose} aria-label={th ? "ปิด" : "Close"} disabled={stage === "processing"}>×</button>
      <span className="demo-chip">POLYGON · DEMO MODE</span>
      {stage === "details" && <>
        <h2 id="purchase-title">{th ? "ตรวจสอบรายละเอียด Membership" : "Review membership details"}</h2>
        <div className="dialog-pass"><PhoenixPass tier={tierKey} language={language} variant="full" /></div>
        <dl><div><dt>{th ? "แพ็กเกจ" : "Tier"}</dt><dd>{tier.name}</dd></div><div><dt>{th ? "ราคาอ้างอิง" : "Reference price"}</dt><dd>{tier.price} USDT</dd></div><div><dt>{th ? "เครือข่ายเป้าหมาย" : "Target network"}</dt><dd>Polygon PoS</dd></div><div><dt>NFT Verification</dt><dd>MOCK · ELIGIBLE</dd></div></dl>
        <p className="demo-disclaimer">{th ? "ขั้นตอนนี้เป็นการจำลอง ไม่มีการเชื่อม Wallet หรือส่งธุรกรรมจริง" : "Simulation only. No wallet connection or live transaction will occur."}</p>
        <button className="primary-action dialog-primary" onClick={() => onStage("confirm")}>{th ? "ดำเนินการต่อ" : "Continue"}</button>
      </>}
      {stage === "confirm" && <>
        <h2 id="purchase-title">{th ? "ยืนยันข้อมูลก่อนทำรายการ" : "Confirm before continuing"}</h2>
        <div className="confirm-summary"><span>{tier.name} · {tier.rarity}</span><strong>{tier.price} USDT</strong><small>Polygon PoS · Wallet 0x7A3...91F2</small></div>
        <label className="confirm-check"><input type="checkbox" defaultChecked /> <span>{th ? "ฉันเข้าใจว่านี่คือธุรกรรมจำลองสำหรับทดสอบ Flow" : "I understand this is a simulated transaction for flow testing."}</span></label>
        <div className="dialog-actions"><button className="outline" onClick={() => onStage("details")}>{th ? "ย้อนกลับ" : "Back"}</button><button className="failure-test" onClick={() => onRun("failed")}>{th ? "ทดสอบกรณีล้มเหลว" : "Test failure"}</button><button className="primary-action" onClick={() => onRun("success")}>{th ? "ยืนยันรายการจำลอง" : "Confirm simulation"}</button></div>
      </>}
      {stage === "processing" && <div className="flow-state"><span className="flow-spinner" /><h2 id="purchase-title">{th ? "กำลังประมวลผลรายการจำลอง" : "Processing simulation"}</h2><p>{th ? "กำลังจำลองการตรวจสอบ Polygon และ NFT Pass" : "Simulating Polygon and NFT Pass verification."}</p></div>}
      {stage === "success" && <div className="flow-state success"><span>✓</span><h2 id="purchase-title">{th ? "จำลองธุรกรรมสำเร็จ" : "Simulation successful"}</h2><p>DEMO TX · 0x9F2...A81</p><button className="primary-action" onClick={onClose}>{th ? "เสร็จสิ้น" : "Done"}</button></div>}
      {stage === "failed" && <div className="flow-state failed"><span>!</span><h2 id="purchase-title">{th ? "จำลองธุรกรรมไม่สำเร็จ" : "Simulation failed"}</h2><p>{th ? "ตัวอย่างสถานะเมื่อผู้ใช้ปฏิเสธหรือเครือข่ายขัดข้อง" : "Example state for a rejected request or network issue."}</p><div className="dialog-actions"><button className="outline" onClick={onClose}>{th ? "ปิด" : "Close"}</button><button className="primary-action" onClick={() => onStage("confirm")}>{th ? "ลองอีกครั้ง" : "Try again"}</button></div></div>}
    </section>
  </div>;
}
