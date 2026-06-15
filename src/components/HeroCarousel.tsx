"use client";

import { useEffect, useState } from "react";

type HeroCarouselProps = {
  images: string[];
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
          style={{ backgroundImage: `url(${image})` }}
        />
      ))}
    </div>
  );
}
