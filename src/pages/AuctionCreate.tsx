import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/store/useAuthStore";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, Loader2 } from "lucide-react";
import {
  createAuction,
  getAuctionsCategory,
} from "@/api/services/AuctionServiceApi";
import { uploadMedia } from "@/api/services/MediaServiceApi";

// Componenti form
import FormField from "@/components/form/FormField";
import CategorySelect from "@/components/form/CategorySelect";
import ImageUploader from "@/components/form/ImageUploader";
import FormActions from "@/components/form/FormActions";

interface ImagePreview {
  id: string;
  file: File;
  preview: string;
}

interface Category {
  id: string;
  name: string;
  icon: string;
}

export default function CreateAuctionPage() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    startingPrice: "",
    category: "",
  });
  const [images, setImages] = useState<ImagePreview[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<string>("");

  // State per le categorie
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoadingCategories, setIsLoadingCategories] = useState(true);

  // Redirect se non autenticato
  if (!isAuthenticated) {
    navigate("/login");
    return null;
  }

  // Carica le categorie all'avvio
  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setIsLoadingCategories(true);
        const data = await getAuctionsCategory();
        setCategories(data.list);
      } catch (error) {
        console.error("Errore nel caricamento delle categorie:", error);
        setErrors((prev) => ({
          ...prev,
          categories: "Errore nel caricamento delle categorie",
        }));
      } finally {
        setIsLoadingCategories(false);
      }
    };

    fetchCategories();
  }, []);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleCategoryChange = (value: string) => {
    setFormData((prev) => ({ ...prev, category: value }));
    if (errors.category) {
      setErrors((prev) => ({ ...prev, category: "" }));
    }
  };

  const handleImagesChange = (newImages: ImagePreview[]) => {
    setImages(newImages);
    if (errors.images) {
      setErrors((prev) => ({ ...prev, images: "" }));
    }
  };

  const handleImageError = (error: string) => {
    setErrors((prev) => ({ ...prev, images: error }));
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = "Il titolo è obbligatorio";
    } else if (formData.title.trim().length < 5) {
      newErrors.title = "Il titolo deve avere almeno 5 caratteri";
    }

    if (!formData.description.trim()) {
      newErrors.description = "La descrizione è obbligatoria";
    } else if (formData.description.trim().length < 20) {
      newErrors.description = "La descrizione deve avere almeno 20 caratteri";
    }

    if (!formData.startingPrice) {
      newErrors.startingPrice = "La base d'asta è obbligatoria";
    } else if (
      isNaN(parseFloat(formData.startingPrice)) ||
      parseFloat(formData.startingPrice) <= 0
    ) {
      newErrors.startingPrice = "Inserisci un importo valido maggiore di 0";
    }

    if (!formData.category) {
      newErrors.category = "Seleziona una categoria";
    }

    if (images.length < 3) {
      newErrors.images = "Devi caricare almeno 3 immagini";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const uploadAllImages = async (): Promise<string[]> => {
    const mediaIds: string[] = [];

    for (let i = 0; i < images.length; i++) {
      const image = images[i];
      setUploadProgress(`Caricamento immagine ${i + 1} di ${images.length}...`);

      try {
        const response = await uploadMedia(image.file);
        mediaIds.push(response.id);
      } catch (error) {
        console.error(`Errore caricamento immagine ${i + 1}:`, error);
        throw new Error(`Errore nel caricamento dell'immagine ${i + 1}`);
      }
    }

    return mediaIds;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);
    setUploadProgress("");

    try {
      const imageIds = await uploadAllImages();
      setUploadProgress("Creazione asta in corso...");

      const auctionData = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        startingPrice: parseFloat(formData.startingPrice),
        categoryId: formData.category,
        imageIds,
      };

      const result = await createAuction(auctionData);
      console.log("Asta creata con successo:", result);

      navigate(`/auctions/${result.id}`, {
        state: { message: "Asta creata con successo!" },
      });
    } catch (error: any) {
      console.error("Errore nella creazione dell'asta:", error);
      setErrors((prev) => ({
        ...prev,
        submit:
          error.response?.data?.message ||
          error.message ||
          "Errore durante la creazione dell'asta. Riprova.",
      }));
    } finally {
      setIsSubmitting(false);
      setUploadProgress("");
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Crea una nuova asta</CardTitle>
          <p className="text-gray-500 text-sm">
            L'asta avrà una durata di 7 giorni dalla creazione
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {errors.submit && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{errors.submit}</AlertDescription>
              </Alert>
            )}

            <FormField
              id="title"
              label="Titolo"
              required
              placeholder="Es: iPhone 15 Pro Max 256GB - Nuovo"
              value={formData.title}
              onChange={handleInputChange}
              error={errors.title}
            />

            <FormField
              id="description"
              label="Descrizione"
              type="textarea"
              required
              placeholder="Descrivi dettagliatamente l'oggetto in vendita..."
              value={formData.description}
              onChange={handleInputChange}
              error={errors.description}
              helperText={`${formData.description.length}/20 caratteri minimi`}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                id="startingPrice"
                label="Base d'asta (€)"
                type="number"
                required
                placeholder="0.00"
                value={formData.startingPrice}
                onChange={handleInputChange}
                error={errors.startingPrice}
                min="0.01"
                step="0.01"
              />

              {isLoadingCategories ? (
                <div className="space-y-2">
                  <p className="text-sm font-medium">Categoria</p>
                  <div className="flex items-center gap-2 h-10 text-gray-500">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span className="text-sm">Caricamento categorie...</span>
                  </div>
                </div>
              ) : (
                <CategorySelect
                  value={formData.category}
                  onChange={handleCategoryChange}
                  categories={categories}
                  error={errors.category}
                  required
                />
              )}
            </div>

            <ImageUploader
              images={images}
              onImagesChange={handleImagesChange}
              minImages={3}
              maxSizeMB={5}
              error={errors.images}
              onError={handleImageError}
            />

            <FormActions
              isSubmitting={isSubmitting}
              submitLabel="Crea asta"
              loadingLabel={uploadProgress || "Creazione in corso..."}
              onCancel={() => navigate(-1)}
            />
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
