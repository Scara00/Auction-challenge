import { useRef } from "react";
import { Label } from "@/components/ui/label";
import { ImagePlus, X } from "lucide-react";

interface ImagePreview {
  id: string;
  file: File;
  preview: string;
}

interface ImageUploaderProps {
  images: ImagePreview[];
  onImagesChange: (images: ImagePreview[]) => void;
  minImages?: number;
  maxSizeMB?: number;
  error?: string;
  onError: (error: string) => void;
}

export default function ImageUploader({
  images,
  onImagesChange,
  minImages = 3,
  maxSizeMB = 5,
  error,
  onError,
}: ImageUploaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const newImages: ImagePreview[] = [];

    Array.from(files).forEach((file) => {
      if (!file.type.startsWith("image/")) {
        onError("Puoi caricare solo file immagine");
        return;
      }

      if (file.size > maxSizeMB * 1024 * 1024) {
        onError(`Le immagini devono essere inferiori a ${maxSizeMB}MB`);
        return;
      }

      const preview = URL.createObjectURL(file);
      newImages.push({
        id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        file,
        preview,
      });
    });

    onImagesChange([...images, ...newImages]);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleRemoveImage = (imageId: string) => {
    const imageToRemove = images.find((img) => img.id === imageId);
    if (imageToRemove) {
      URL.revokeObjectURL(imageToRemove.preview);
    }
    onImagesChange(images.filter((img) => img.id !== imageId));
  };

  return (
    <div className="space-y-2">
      <Label>
        Immagini <span className="text-red-500">*</span>
        <span className="text-gray-500 font-normal ml-2">
          (minimo {minImages})
        </span>
      </Label>

      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
        {images.map((image) => (
          <div key={image.id} className="relative group">
            <div className="aspect-square rounded-lg overflow-hidden border">
              <img
                src={image.preview}
                alt="Preview"
                className="w-full h-full object-cover"
              />
            </div>
            <button
              type="button"
              onClick={() => handleRemoveImage(image.id)}
              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <X className="h-4 w-4" />
            </button>
          </div>
        ))}

        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className={`aspect-square rounded-lg border-2 border-dashed flex flex-col items-center justify-center gap-1 hover:border-primary hover:bg-gray-50 transition-colors ${
            error ? "border-red-500" : "border-gray-300"
          }`}>
          <ImagePlus className="h-6 w-6 text-gray-400" />
          <span className="text-xs text-gray-500">Aggiungi</span>
        </button>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        onChange={handleImageSelect}
        className="hidden"
      />

      {error && <p className="text-sm text-red-500">{error}</p>}

      <p className="text-xs text-gray-500">
        {images.length}/{minImages} immagini caricate • Max {maxSizeMB}MB per
        immagine
      </p>
    </div>
  );
}
