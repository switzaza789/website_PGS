import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import test from "node:test";

const assets = [
  "public/phoenix/bronze-phoenix.webp",
  "public/phoenix/silver-phoenix.webp",
  "public/phoenix/gold-phoenix.webp",
];

test("ships all three phoenix pass assets", async () => {
  for (const asset of assets) {
    await assert.doesNotReject(access(asset), `missing ${asset}`);
  }
});

test("defines all approved phoenix rarity labels", async () => {
  const source = await readFile("app/membership-tiers.ts", "utf8");
  for (const label of ["BRONZE PHOENIX", "SILVER PHOENIX", "GOLD PHOENIX"]) {
    assert.match(source, new RegExp(label));
  }
});

test("uses one accessible shared pass component", async () => {
  const source = await readFile("app/phoenix-pass.tsx", "utf8");
  assert.match(source, /alt=\{tierData\.artAlt\[language\]\}/);
  assert.match(source, /from "next\/image"/);
  assert.match(source, /phoenix-pass__rarity/);
});

test("reuses PhoenixPass across guest and member experiences", async () => {
  const source = `${await readFile("app/page.tsx", "utf8")}\n${await readFile("app/demo-membership-flow.tsx", "utf8")}`;
  assert.match(source, /variant="hero"/);
  assert.match(source, /variant="full"/);
  assert.match(source, /variant="dashboard"/);
});

test("uses the approved Membership card as the canonical NFT geometry", async () => {
  const css = await readFile("app/globals.css", "utf8");
  assert.match(css, /\.phoenix-pass\{[^}]*--nft-card-ratio:15 \/ 8/);
  assert.match(css, /\.phoenix-pass--full\{[^}]*width:100%;[^}]*max-width:440px;[^}]*aspect-ratio:var\(--nft-card-ratio\);[^}]*height:auto/);
  assert.match(css, /\.phoenix-pass--dashboard\{[^}]*aspect-ratio:var\(--nft-card-ratio\);[^}]*height:auto/);
  assert.doesNotMatch(css, /\.phoenix-pass--(?:mini|full|dashboard)\{[^}]*height:(?:150px|160px|205px)/);
  assert.doesNotMatch(css, /@media\(max-width:(?:720px|420px)\)[\s\S]*?\.phoenix-pass--mini\{[^}]*height:(?:180px|154px|142px)/);
});

test("restores only the landing Hero card to its original dimensions", async () => {
  const css = await readFile("app/globals.css", "utf8");
  assert.match(css, /\.phoenix-pass--hero\{[^}]*width:330px;[^}]*height:205px/);
  assert.match(css, /@media\(max-width:720px\)\{\.phoenix-pass--hero\{[^}]*width:min\(78vw,290px\);[^}]*height:180px/);
  assert.match(css, /@media\(max-width:420px\)\{\.phoenix-pass--hero\{[^}]*width:245px;[^}]*height:154px/);
});

test("uses the full Master card on public, member, and purchase surfaces", async () => {
  const page = await readFile("app/page.tsx", "utf8");
  const flow = await readFile("app/demo-membership-flow.tsx", "utf8");
  assert.match(page, /<article className=\{i===2\?"public-tier featured":"public-tier"\}[\s\S]*?<PhoenixPass tier=\{tierKey\} language=\{language\} variant="full"/);
  assert.equal((flow.match(/variant="full"/g) || []).length, 2, "member cards and purchase dialog must both use the Master");
  assert.doesNotMatch(`${page}\n${flow}`, /variant="mini"/);
});

test("styles every phoenix tier with responsive reduced-motion support", async () => {
  const css = await readFile("app/globals.css", "utf8");
  for (const selector of [".phoenix-pass--starter", ".phoenix-pass--core", ".phoenix-pass--founders", ".phoenix-pass__art"]) {
    assert.ok(css.includes(selector), `missing ${selector}`);
  }
  assert.match(css, /@media\(prefers-reduced-motion:reduce\)/);
  assert.match(css, /\.phoenix-pass[^}]*animation:none!important/);
  assert.match(css, /\.recommended\{[^}]*z-index:[1-9]/);
});

test("keeps membership cards aligned and provides mobile portal navigation", async () => {
  const page = await readFile("app/page.tsx", "utf8");
  const css = await readFile("app/globals.css", "utf8");

  assert.match(page, /className="mobile-bottom-nav"/);
  assert.match(page, /aria-current=\{active === i \? "page" : undefined\}/);
  assert.match(css, /\.tier\{[^}]*display:grid[^}]*grid-template-rows/);
  assert.match(css, /\.tier>button\{[^}]*margin-top:auto/);
  assert.match(css, /@media\(max-width:720px\)/);
  assert.match(css, /\.mobile-bottom-nav\{[^}]*display:grid/);
  assert.match(css, /padding-bottom:calc\([^)]*env\(safe-area-inset-bottom\)/);
});
