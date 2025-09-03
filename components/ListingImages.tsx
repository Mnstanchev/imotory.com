"use client";

import { useEffect, useState } from "react";
import { resolveAssetUrl } from "@/lib/api";

export default function ListingImages({ images, listingId }: { images: string[]; listingId?: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const [fullscreenIndex, setFullscreenIndex] = useState<number | null>(null);

  // Filter out invalid images (null, undefined, empty strings)
  const validImages = images?.filter(img => img && typeof img === 'string' && img.trim() !== '') || [];

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (fullscreenIndex !== null) {
          setFullscreenIndex(null);
        } else {
          setIsOpen(false);
        }
      } else if (fullscreenIndex !== null) {
        if (e.key === "ArrowLeft") {
          setFullscreenIndex(prev => prev! > 0 ? prev! - 1 : validImages.length - 1);
        } else if (e.key === "ArrowRight") {
          setFullscreenIndex(prev => prev! < validImages.length - 1 ? prev! + 1 : 0);
        }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [fullscreenIndex, validImages.length]);
  const [first, second, third] = validImages;
  const countLabel = `${validImages.length}+`;

  const openModal = (index?: number) => {
    setIsOpen(true);
    if (index !== undefined) {
      setFullscreenIndex(index);
    }
  };

  const closeModal = () => {
    setIsOpen(false);
    setFullscreenIndex(null);
  };

  const openFullscreen = (index: number) => {
    setFullscreenIndex(index);
  };

  const closeFullscreen = () => {
    setFullscreenIndex(null);
  };

  const nextImage = () => {
    setFullscreenIndex(prev => prev! < validImages.length - 1 ? prev! + 1 : 0);
  };

  const prevImage = () => {
    setFullscreenIndex(prev => prev! > 0 ? prev! - 1 : validImages.length - 1);
  };

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <button
          type="button"
          onClick={() => openModal(0)}
          className="md:col-span-2 aspect-[16/9] relative overflow-hidden rounded-lg bg-gray-100 cursor-pointer hover:opacity-90 transition-opacity"
        >
          {first && <img src={resolveAssetUrl(first, { listingId, entityType: 'listing' })} alt="Image 1" className="w-full h-full object-cover" onError={(e) => { e.currentTarget.src = "/next.svg"; }} />}
        </button>
        <div className="grid grid-rows-2 gap-3">
          <button
            type="button"
            onClick={() => openModal(1)}
            className="aspect-[16/9] relative overflow-hidden rounded-lg bg-gray-100 cursor-pointer hover:opacity-90 transition-opacity"
          >
            {second && <img src={resolveAssetUrl(second, { listingId, entityType: 'listing' })} alt="Image 2" className="w-full h-full object-cover" onError={(e) => { e.currentTarget.src = "/next.svg"; }} />}
          </button>
          <button
            type="button"
            onClick={() => openModal(2)}
            className="relative aspect-[16/9] overflow-hidden rounded-lg bg-gray-100 text-gray-900 cursor-pointer hover:opacity-90 transition-opacity"
          >
            {third && <img src={resolveAssetUrl(third, { listingId, entityType: 'listing' })} alt="Image 3" className="w-full h-full object-cover" onError={(e) => { e.currentTarget.src = "/next.svg"; }} />}
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
          <div className="absolute inset-0 bg-gray-900/50" onClick={closeModal} />
          <div className="relative bg-white border border-gray-200 shadow-xl rounded-md max-w-5xl w-[92vw] max-h-[88vh] overflow-auto">
            <div className="sticky top-0 flex items-center justify-between border-b border-gray-200 bg-white px-4 py-3">
              <div className="text-gray-900 font-medium">Images</div>
              <button className="text-gray-700 hover:bg-gray-50 border border-gray-200 rounded px-3 py-1" onClick={closeModal}>
                Close
              </button>
            </div>
            <div className="p-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {validImages.map((src, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => openFullscreen(i)}
                  className="relative aspect-[16/9] overflow-hidden rounded-md bg-gray-100 cursor-pointer hover:opacity-90 transition-opacity"
                >
                  <img src={resolveAssetUrl(src, { listingId, entityType: 'listing' })} alt={`Image ${i + 1}`} className="w-full h-full object-cover" onError={(e) => { e.currentTarget.src = "/next.svg"; }} />
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {fullscreenIndex !== null && (
        <div
          className="fixed inset-0 z-[60] bg-black flex items-center justify-center"
          aria-modal="true"
          role="dialog"
        >
          <div className="absolute inset-0" onClick={closeFullscreen} />
          
          {/* Navigation arrows */}
          {validImages.length > 1 && (
            <>
              <button
                type="button"
                onClick={prevImage}
                className="absolute left-4 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
                aria-label="Previous image"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="h-6 w-6">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="m15 19-7-7 7-7" />
                </svg>
              </button>
              <button
                type="button"
                onClick={nextImage}
                className="absolute right-4 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
                aria-label="Next image"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="h-6 w-6">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="m9 5 7 7-7 7" />
                </svg>
              </button>
            </>
          )}

          {/* Close button */}
          <button
            type="button"
            onClick={closeFullscreen}
            className="absolute top-4 right-4 z-10 p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
            aria-label="Close fullscreen"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="h-6 w-6">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Image counter */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 px-3 py-1 rounded-full bg-black/50 text-white text-sm">
            {fullscreenIndex + 1} / {validImages.length}
          </div>

          {/* Main image */}
          <div className="relative max-w-[95vw] max-h-[95vh] flex items-center justify-center">
            <img
              src={resolveAssetUrl(validImages[fullscreenIndex], { listingId, entityType: 'listing' })}
              alt={`Image ${fullscreenIndex + 1}`}
              className="max-w-full max-h-full object-contain"
              onError={(e) => { e.currentTarget.src = "/next.svg"; }}
            />
          </div>
        </div>
      )}
    </div>
  );
}


