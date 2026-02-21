import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Heart, Calendar } from "lucide-react";

interface AuctionInfoProps {
  title: string;
  description: string;
  categoryId: string;
  createdAt: string;
  favoritesCount: number;
  isFavorite: boolean;
  onToggleFavorite: () => void;
}

export default function AuctionInfo({
  title,
  description,
  categoryId,
  createdAt,
  favoritesCount,
  isFavorite,
  onToggleFavorite,
}: AuctionInfoProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("it-IT", {
      day: "2-digit",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-start justify-between gap-4">
        <div>
          <Badge className="mb-2">{categoryId}</Badge>
          <h1 className="text-3xl font-bold">{title}</h1>
        </div>
        <Button
          variant="outline"
          size="icon"
          onClick={onToggleFavorite}
          className={isFavorite ? "text-red-500" : ""}>
          <Heart className={`h-5 w-5 ${isFavorite ? "fill-current" : ""}`} />
        </Button>
      </div>

      <p className="text-gray-600">{description}</p>

      <div className="flex flex-wrap gap-4 text-sm text-gray-500">
        <div className="flex items-center gap-1">
          <Calendar className="h-4 w-4" />
          <span>Creata il {formatDate(createdAt)}</span>
        </div>
        <div className="flex items-center gap-1">
          <Heart className="h-4 w-4" />
          <span>{favoritesCount} preferiti</span>
        </div>
      </div>
    </div>
  );
}
