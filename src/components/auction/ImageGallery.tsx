import { useState } from "react";
import { ChevronLeft, ChevronRight, ImageOff } from "lucide-react";
import type { AuctionImageResponse } from "@/types/auction";

interface ImageGalleryProps {
  images: AuctionImageResponse[];
  title: string;
}

export default function ImageGallery({ images, title }: ImageGalleryProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [imageErrors, setImageErrors] = useState<Record<number, boolean>>({});

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const handleImageError = (index: number) => {
    setImageErrors((prev) => ({ ...prev, [index]: true }));
  };

  // Costruisci l'URL dell'immagine come nella AuctionCard
  const getImageUrl = (imageId: string) =>
    `https://api-challenge.icib.dev/media/${imageId}`;

  if (images.length === 0) {
    return (
      <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center">
        <ImageOff className="h-12 w-12 text-gray-400" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Immagine principale */}
      <div className="relative aspect-video bg-gray-100 rounded-lg overflow-hidden">
        {imageErrors[currentIndex] ? (
          <div className="w-full h-full flex items-center justify-center">
            <ImageOff className="h-12 w-12 text-gray-400" />
          </div>
        ) : (
          <img
            src={getImageUrl(images[currentIndex].imageId)}
            alt={`${title} - ${currentIndex + 1}`}
            className="w-full h-full object-contain"
            onError={() => handleImageError(currentIndex)}
          />
        )}

        {images.length > 1 && (
          <>
            <button
              onClick={handlePrev}
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow transition-colors"
              aria-label="Immagine precedente">
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              onClick={handleNext}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow transition-colors"
              aria-label="Immagine successiva">
              <ChevronRight className="h-5 w-5" />
            </button>
          </>
        )}

        {/* Indicatore */}
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-black/60 text-white text-xs px-2 py-1 rounded">
          {currentIndex + 1} / {images.length}
        </div>
      </div>

      {/* Miniature */}
      {images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-2">
          {images.map((img, index) => (
            <button
              key={img.imageId}
              onClick={() => setCurrentIndex(index)}
              className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors ${
                index === currentIndex
                  ? "border-primary"
                  : "border-transparent hover:border-gray-300"
              }`}>
              {imageErrors[index] ? (
                <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                  <ImageOff className="h-4 w-4 text-gray-400" />
                </div>
              ) : (
                <img
                  src={getImageUrl(img.imageId)}
                  alt={`${title} ${index + 1}`}
                  className="w-full h-full object-cover"
                  onError={() => handleImageError(index)}
                />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
