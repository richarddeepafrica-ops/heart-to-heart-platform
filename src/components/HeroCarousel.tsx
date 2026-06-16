"use client";

import { useEffect, useState } from "react";

type HeroCarouselProps = {
  images: string[];
};

const heroImagePositions: Record<string, string> = {
  "/assets/hero/DSC_0101-scaled.jpg": "center 28%",
  "/assets/hero/DSC_0634-scaled.jpg": "center 34%",
  "/assets/hero/DSC_8428-scaled.jpg": "center 30%",
  "/assets/hero/Heart-to-Heart-Foundation-1.jpg": "center 32%",
  "/assets/hero/Heart-to-Heart-Foundation-3.jpg": "center 34%",
  "/assets/hero/Heart-to-Heart-Foundation-5.jpg": "center 32%",
  "/assets/hero/Heart-to-Heart-Foundation-6.jpg": "center 38%",
  "/assets/hero/Heart-to-Heart-Foundation-9.jpg": "center 34%"
};

export function HeroCarousel({ images }: HeroCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (images.length <= 1) return;

    const timer = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % images.length);
    }, 4200);

    return () => window.clearInterval(timer);
  }, [images.length]);

  return (
    <div className="heroCarousel" aria-hidden="true">
      {images.map((image, index) => (
        <div
          className={index === activeIndex ? "heroSlide active" : "heroSlide"}
          key={image}
          style={{
            backgroundImage: `url(${image})`,
            backgroundPosition: heroImagePositions[image] ?? "center 36%"
          }}
        />
      ))}
    </div>
  );
}
