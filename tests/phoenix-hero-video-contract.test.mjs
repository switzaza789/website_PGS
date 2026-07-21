import assert from "node:assert/strict";
import { access, readFile, stat } from "node:fs/promises";
import test from "node:test";

test("mounts a deferred non-interactive phoenix hero video", async () => {
  const page = await readFile("app/page.tsx", "utf8");
  const component = await readFile("app/deferred-phoenix-video.tsx", "utf8");
  assert.match(page, /<DeferredPhoenixVideo\s*\/>/);
  assert.match(component, /phoenix-video-layer\$\{ready \? " has-video" : ""\}/);
  assert.match(component, /autoPlay/);
  assert.match(component, /muted/);
  assert.match(component, /loop/);
  assert.match(component, /playsInline/);
  assert.match(component, /preload="none"/);
  assert.match(component, /aria-hidden="true"/);
  assert.match(component, /requestIdleCallback/);
  assert.match(component, /saveData/);
  assert.match(component, /prefers-reduced-motion: reduce/);
  assert.match(component, /document\.hidden/);
  assert.match(component, /video\.pause\(\)/);
  assert.match(component, /video\.play\(\)/);
  assert.match(component, /onCanPlay/);
});

test("ships optimized desktop, mobile, and poster assets", async () => {
  await Promise.all([
    access("public/video/founders-phoenix-hero.mp4"),
    access("public/video/founders-phoenix-hero-mobile.mp4"),
    access("public/video/founders-phoenix-poster.webp"),
  ]);
  const desktop = await stat("public/video/founders-phoenix-hero.mp4");
  const mobile = await stat("public/video/founders-phoenix-hero-mobile.mp4");
  assert.ok(desktop.size < 2_000_000, `desktop video is ${desktop.size} bytes`);
  assert.ok(mobile.size < 1_000_000, `mobile video is ${mobile.size} bytes`);
});

test("keeps the video behind content and respects reduced motion", async () => {
  const css = await readFile("app/globals.css", "utf8");
  assert.match(css, /\.phoenix-video-layer\{[^}]*pointer-events:none/);
  assert.match(css, /\.phoenix-video-layer\{[^}]*inset:0/);
  assert.match(css, /\.phoenix-video-layer\{[^}]*mask-image:linear-gradient\(to right,transparent 0,#000 2%,#000 98%,transparent 100%\),linear-gradient\(to bottom,#000 0,#000 94%,transparent 100%\)/);
  assert.doesNotMatch(css, /mask-image:[^;}]*linear-gradient\(to bottom,transparent 0/);
  assert.match(css, /\.phoenix-video-layer\{[^}]*mask-composite:intersect/);
  assert.match(css, /\.phoenix-hero-video\{[^}]*object-fit:cover;[^}]*opacity:0;[^}]*transition:opacity/);
  assert.match(css, /\.phoenix-hero-video\.is-ready\{opacity:\.76/);
  assert.match(css, /\.phoenix-video-layer\.has-video\{background-image:none\}/);
  assert.doesNotMatch(css, /\.phoenix-hero-video\{[^}]*filter:/);
  assert.doesNotMatch(css, /\.phoenix-video-layer\{[^}]*mask-image:radial-gradient/);
  assert.doesNotMatch(css, /\.phoenix-video-layer\{[^}]*border:/);
  assert.match(css, /@media\(max-width:600px\)[^{]*\{[^}]*\.phoenix-video-layer\{[^}]*height:4[0-9]{2}px/);
  assert.match(css, /@media\(max-width:600px\)[\s\S]*\.phoenix-landing-hero \.halo\{display:block;[^}]*animation:halo-breathe/);
  assert.match(css, /@media\(max-width:600px\)[\s\S]*\.phoenix-hero-video\.is-ready\{opacity:\.72/);
  assert.match(css, /@media\(max-width:600px\)[\s\S]*\.phoenix-video-layer:after\{[^}]*radial-gradient\(circle at 50% 68%/);
  assert.match(css, /\.phoenix-landing-hero \.fs1\{left:12px/);
  assert.match(css, /\.phoenix-landing-hero \.fs2\{right:12px/);
  assert.match(css, /@media\(prefers-reduced-motion:reduce\)[^{]*\{[^}]*\.phoenix-hero-video\{[^}]*display:none/);
});
