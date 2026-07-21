"use client";

import { useMemo, useState } from "react";
import type { Language } from "./membership-tiers";

const demoTransactions = [
  { id: "DEMO-0107", type: "Membership", detail: "Founders Pass", amount: "+1 NFT", status: "Confirmed", date: "16 Jul 2026 · 14:32" },
  { id: "DEMO-0106", type: "Referral", detail: "SOMCHAI.K", amount: "+10.00 USDT", status: "Confirmed", date: "16 Jul 2026 · 11:08" },
  { id: "DEMO-0105", type: "Reward", detail: "Daily node distribution", amount: "+15.00 FCD", status: "Pending", date: "15 Jul 2026 · 00:05" },
  { id: "DEMO-0104", type: "Membership", detail: "Core upgrade attempt", amount: "100 USDT", status: "Failed", date: "13 Jul 2026 · 18:20" },
  { id: "DEMO-0103", type: "Referral", detail: "PIMPA.P", amount: "+10.00 USDT", status: "Confirmed", date: "12 Jul 2026 · 09:45" },
];

export function DemoTransactions({ language }: { language: Language }) {
  const th = language === "th";
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("All");
  const [type, setType] = useState("All");
  const filtered = useMemo(() => demoTransactions.filter((transaction) => {
    const matchesQuery = `${transaction.id} ${transaction.detail}`.toLowerCase().includes(query.toLowerCase());
    return matchesQuery && (status === "All" || transaction.status === status) && (type === "All" || transaction.type === type);
  }), [query, status, type]);

  const downloadCsv = () => {
    const rows = [["Demo ID", "Type", "Detail", "Amount", "Status", "Date"], ...filtered.map((item) => [item.id, item.type, item.detail, item.amount, item.status, item.date])];
    const csv = rows.map((row) => row.map((cell) => `"${cell.replaceAll('"', '""')}"`).join(",")).join("\n");
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "pgs-demo-transactions.csv";
    anchor.click();
    URL.revokeObjectURL(url);
  };

  return <div className="page">
    <section className="section-intro compact transaction-heading"><div><span className="status-pill">POLYGON LEDGER · DEMO</span><h2>{th ? "ธุรกรรมที่ค้นหาและตรวจสอบได้" : "Searchable transaction history"}</h2><p>{th ? "ข้อมูลทั้งหมดเป็นตัวอย่างเพื่อทดสอบ Flow ก่อนเชื่อม Polygon Explorer" : "All records are simulated before connecting Polygon Explorer."}</p></div><button className="outline" onClick={downloadCsv}>{th ? "ดาวน์โหลด CSV" : "Download CSV"}</button></section>
    <article className="panel transaction-panel">
      <div className="transaction-toolbar">
        <label className="transaction-search"><span>⌕</span><input type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder={th ? "ค้นหา ID หรือรายละเอียด" : "Search ID or detail"} /></label>
        <select value={type} onChange={(event) => setType(event.target.value)} aria-label={th ? "กรองประเภทธุรกรรม" : "Filter transaction type"}><option value="All">{th ? "ทุกประเภท" : "All types"}</option><option>Membership</option><option>Referral</option><option>Reward</option></select>
        <select value={status} onChange={(event) => setStatus(event.target.value)} aria-label={th ? "กรองสถานะ" : "Filter status"}><option value="All">{th ? "ทุกสถานะ" : "All statuses"}</option><option>Confirmed</option><option>Pending</option><option>Failed</option></select>
      </div>
      <div className="transaction-table" role="table" aria-label={th ? "ธุรกรรมจำลอง" : "Demo transactions"}>
        <div className="transaction-row transaction-row-head" role="row"><b>ID</b><b>{th ? "รายการ" : "Transaction"}</b><b>{th ? "จำนวน" : "Amount"}</b><b>{th ? "สถานะ" : "Status"}</b><b>{th ? "วันที่" : "Date"}</b></div>
        {filtered.map((item) => <div className="transaction-row" role="row" key={item.id}><code>{item.id}</code><span><strong>{item.type}</strong><small>{item.detail}</small></span><b>{item.amount}</b><i className={`transaction-status ${item.status.toLowerCase()}`}>{item.status}</i><time>{item.date}</time></div>)}
        {!filtered.length && <div className="empty-state">{th ? "ไม่พบธุรกรรมที่ตรงกับตัวกรอง" : "No transactions match your filters."}</div>}
      </div>
    </article>
  </div>;
}
