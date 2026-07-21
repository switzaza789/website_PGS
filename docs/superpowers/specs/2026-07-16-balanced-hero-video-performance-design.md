# Balanced Hero Video Performance Design

## Goal

Keep the Founders phoenix hero video cinematic, automatic, muted, inline, and looping while reducing startup cost, bandwidth, and continuous rendering load.

## Behavior

- Render the existing poster immediately.
- Defer video source attachment until the page is loaded and the browser has idle time.
- Preserve `autoPlay`, `muted`, `loop`, and `playsInline`.
- Fade the video over the poster only after `canplay`.
- Pause playback when the document is hidden and resume when visible.
- Keep the poster instead of loading video when reduced motion, Data Saver, or a clearly low-resource device is detected.

## Media Targets

- Desktop: H.264, 960×540, 24fps, no audio, fast-start MP4, below 2 MB.
- Mobile: H.264, 640×360, 24fps, no audio, fast-start MP4, below 1 MB.
- Preserve the full 20-second loop to avoid introducing a visible loop cut.

## Visual Constraints

- Do not change hero layout, NFT Card size, typography, overlays, or responsive positioning.
- Preserve the existing edge blend.
- Bake the existing mild color enhancement into the encoded media and remove real-time CSS video filters.

## Verification

- Contract-test deferred loading, autoplay attributes, resource fallbacks, visibility handling, and ready-state fade.
- Assert optimized media size budgets.
- Run the complete production build and test suite.

