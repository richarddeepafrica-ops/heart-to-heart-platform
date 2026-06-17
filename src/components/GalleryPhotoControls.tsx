"use client";

import { useEffect } from "react";

type GalleryPhotoControlsProps = {
  previousHref: string;
  nextHref: string;
};

export function GalleryPhotoControls({ previousHref, nextHref }: GalleryPhotoControlsProps) {
  useEffect(() => {
    let startX = 0;
    let startY = 0;

    function navigateTo(href: string) {
      window.location.href = href;
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return;
      if (event.key === "ArrowLeft") navigateTo(previousHref);
      if (event.key === "ArrowRight") navigateTo(nextHref);
    }

    function handleTouchStart(event: TouchEvent) {
      const touch = event.changedTouches[0];
      startX = touch.clientX;
      startY = touch.clientY;
    }

    function handleTouchEnd(event: TouchEvent) {
      const touch = event.changedTouches[0];
      const deltaX = touch.clientX - startX;
      const deltaY = touch.clientY - startY;
      if (Math.abs(deltaX) < 54 || Math.abs(deltaX) < Math.abs(deltaY) * 1.35) return;
      navigateTo(deltaX > 0 ? previousHref : nextHref);
    }

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("touchstart", handleTouchStart, { passive: true });
    window.addEventListener("touchend", handleTouchEnd, { passive: true });

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchend", handleTouchEnd);
    };
  }, [nextHref, previousHref]);

  return null;
}
