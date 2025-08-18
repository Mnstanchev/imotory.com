"use client";

import { useEffect, useState } from "react";
import { resolveAssetUrl } from "@/lib/api";

export default function ListingImages({ images }: { images: string[] }) {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const [first, second, third] = images;
  const countLabel = `${images.length}+`;

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div className="md:col-span-2 aspect-[16/9] relative overflow-hidden rounded-lg bg-gray-100">
          {first && <img src={resolveAssetUrl(first)} alt="Image 1" className="w-full h-full object-cover" />}
        </div>
        <div className="grid grid-rows-2 gap-3">
          <div className="aspect-[16/9] relative overflow-hidden rounded-lg bg-gray-100">
            {second && <img src={resolveAssetUrl(second)} alt="Image 2" className="w-full h-full object-cover" />}
          </div>
          <button
            type="button"
            onClick={() => setIsOpen(true)}
            className="relative aspect-[16/9] overflow-hidden rounded-lg bg-gray-100 text-gray-900"
          >
            {third && <img src={resolveAssetUrl(third)} alt="Image 3" className="w-full h-full object-cover" />}
            <span className="absolute inset-0 bg-gray-900/40 flex items-center justify-center text-white text-2xl font-semibold">
              {countLabel}
            </span>
          </button>
        </div>
      </div>

      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center"
          aria-modal="true"
          role="dialog"
        >
          <div className="absolute inset-0 bg-gray-900/50" onClick={() => setIsOpen(false)} />
          <div className="relative bg-white border border-gray-200 shadow-xl rounded-md max-w-5xl w-[92vw] max-h-[88vh] overflow-auto">
            <div className="sticky top-0 flex items-center justify-between border-b border-gray-200 bg-white px-4 py-3">
              <div className="text-gray-900 font-medium">Images</div>
              <button className="text-gray-700 hover:bg-gray-50 border border-gray-200 rounded px-3 py-1" onClick={() => setIsOpen(false)}>
                Close
              </button>
            </div>
            <div className="p-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {images.map((src, i) => (
                <div key={i} className="relative aspect-[16/9] overflow-hidden rounded-md bg-gray-100">
                  <img src={resolveAssetUrl(src)} alt={`Image ${i + 1}`} className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


