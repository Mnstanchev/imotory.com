"use client";

import { useEffect, useRef, useState } from "react";

export default function Carousel({
  items,
  renderItem,
  ariaLabel,
}: {
  items: any[];
  renderItem: (item: any, index: number) => React.ReactNode;
  ariaLabel: string;
}) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const onScroll = () => {
      setAtStart(el.scrollLeft <= 0);
      setAtEnd(el.scrollLeft + el.clientWidth >= el.scrollWidth - 2);
    };
    onScroll();
    el.addEventListener("scroll", onScroll);
    return () => el.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="relative">
      <div
        ref={containerRef}
        className="flex gap-6 overflow-x-auto scroll-smooth pb-2 snap-x snap-mandatory"
        aria-label={ariaLabel}
      >
        {items.map((it, idx) => (
          <div
            key={idx}
            className="shrink-0 snap-start basis-full md:basis-[calc((100%-24px)/2)] lg:basis-[calc((100%-48px)/3)]"
          >
            {renderItem(it, idx)}
          </div>
        ))}
      </div>
      <div className="absolute inset-y-0 left-0 flex items-center">
        <button
          type="button"
          aria-label="Previous"
          disabled={atStart}
          className="mx-2 h-8 w-8 rounded-full border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-50 shadow-sm flex items-center justify-center"
          onClick={() => {
            const el = containerRef.current;
            if (!el) return;
            el.scrollBy({ left: -el.clientWidth, behavior: "smooth" });
          }}
        >
          <span className="sr-only">Previous</span>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="h-4 w-4">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="m15 19-7-7 7-7" />
          </svg>
        </button>
      </div>
      <div className="absolute inset-y-0 right-0 flex items-center">
        <button
          type="button"
          aria-label="Next"
          disabled={atEnd}
          className="mx-2 h-8 w-8 rounded-full border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-50 shadow-sm flex items-center justify-center"
          onClick={() => {
            const el = containerRef.current;
            if (!el) return;
            el.scrollBy({ left: el.clientWidth, behavior: "smooth" });
          }}
        >
          <span className="sr-only">Next</span>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="h-4 w-4">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="m9 5 7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  );
}


