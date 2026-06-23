"use client";

import { useEffect, useMemo, useState } from "react";

export type ShopHeroCarouselItem = {
  id: string;
  slug: string;
  name: string;
  category: string;
  imageUrl: string;
  priceLabel: string;
};

type ShopHeroCarouselProps = {
  items: ShopHeroCarouselItem[];
};

export function ShopHeroCarousel({ items }: ShopHeroCarouselProps) {
  const slides = useMemo(() => items.filter((item) => item.imageUrl), [items]);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (slides.length <= 1) return;
    const timer = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % slides.length);
    }, 5500);
    return () => window.clearInterval(timer);
  }, [slides.length]);

  if (!slides.length) return null;

  const active = slides[activeIndex] || slides[0];

  function goTo(offset: number) {
    setActiveIndex((current) => (current + offset + slides.length) % slides.length);
  }

  return (
    <div className="shopHeroCarousel" aria-label="Featured shop items">
      <a className="shopHeroFeature" href={`/shop/${active.slug}`} aria-label={`Shop ${active.name}`}>
        <span className="shopHeroTag">Featured shop</span>
        <div className="shopHeroFeatureImage">
          <img src={active.imageUrl} alt="" />
        </div>
        <div className="shopHeroFeatureMeta">
          <span>{active.category}</span>
          <strong>{active.name}</strong>
          <small>{active.priceLabel}</small>
        </div>
      </a>
      {slides.length > 1 ? (
        <div className="shopCarouselControls">
          <button type="button" aria-label="Previous product" onClick={() => goTo(-1)}>Prev</button>
          <div aria-label="Choose featured product">
            {slides.map((item, index) => (
              <button
                aria-label={`Show ${item.name}`}
                aria-current={index === activeIndex ? "true" : undefined}
                key={item.id}
                type="button"
                onClick={() => setActiveIndex(index)}
              />
            ))}
          </div>
          <button type="button" aria-label="Next product" onClick={() => goTo(1)}>Next</button>
        </div>
      ) : null}
    </div>
  );
}
