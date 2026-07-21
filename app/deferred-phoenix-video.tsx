"use client";

import { useEffect, useRef, useState } from "react";

type NavigatorHints = Navigator & {
  connection?: { saveData?: boolean };
  deviceMemory?: number;
};

type IdleWindow = Window & {
  requestIdleCallback?: (callback: () => void, options?: { timeout: number }) => number;
  cancelIdleCallback?: (handle: number) => void;
};

const shouldUsePosterOnly = () => {
  const hints = navigator as NavigatorHints;
  return (
    window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
    hints.connection?.saveData === true ||
    (typeof hints.deviceMemory === "number" && hints.deviceMemory <= 2) ||
    (typeof navigator.hardwareConcurrency === "number" && navigator.hardwareConcurrency <= 2)
  );
};

export function DeferredPhoenixVideo() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [shouldLoad, setShouldLoad] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (shouldUsePosterOnly()) return;

    const idleWindow = window as IdleWindow;
    let idleHandle: number | undefined;
    let timerHandle: number | undefined;

    const queueVideo = () => {
      if (idleWindow.requestIdleCallback) {
        idleHandle = idleWindow.requestIdleCallback(() => setShouldLoad(true), { timeout: 1_500 });
      } else {
        timerHandle = window.setTimeout(() => setShouldLoad(true), 700);
      }
    };

    if (document.readyState === "complete") queueVideo();
    else window.addEventListener("load", queueVideo, { once: true });

    return () => {
      window.removeEventListener("load", queueVideo);
      if (idleHandle !== undefined) idleWindow.cancelIdleCallback?.(idleHandle);
      if (timerHandle !== undefined) window.clearTimeout(timerHandle);
    };
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !shouldLoad) return;

    video.load();
    void video.play().catch(() => setReady(false));

    const syncVisibility = () => {
      if (document.hidden) video.pause();
      else void video.play().catch(() => setReady(false));
    };

    document.addEventListener("visibilitychange", syncVisibility);
    return () => document.removeEventListener("visibilitychange", syncVisibility);
  }, [shouldLoad]);

  return (
    <div className={`phoenix-video-layer${ready ? " has-video" : ""}`} aria-hidden="true">
      <video
        ref={videoRef}
        className={`phoenix-hero-video${ready ? " is-ready" : ""}`}
        autoPlay
        muted
        loop
        playsInline
        preload="none"
        poster="/video/founders-phoenix-poster.webp"
        tabIndex={-1}
        onCanPlay={() => setReady(true)}
      >
        {shouldLoad && (
          <>
            <source media="(max-width: 720px)" src="/video/founders-phoenix-hero-mobile.mp4" type="video/mp4" />
            <source src="/video/founders-phoenix-hero.mp4" type="video/mp4" />
          </>
        )}
      </video>
    </div>
  );
}
