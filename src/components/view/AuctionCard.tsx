import { useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Heart, Clock, ImageOff } from "lucide-react";
import type { AuctionResponse } from "@/types/auction";

interface AuctionCardProps {
  auction: AuctionResponse;
}

export default function AuctionCard({ auction }: AuctionCardProps) {
  const [imageError, setImageError] = useState(false);

  // Guard clause per auction undefined
  if (!auction) {
    return null;
  }

  const {
    id,
    title,
    startingPrice,
    endDate,
    status,
    auctionImages,
    bids,
    _count,
  } = auction;

  // Costruisci l'URL dell'immagine
  const imageUrl =
    auctionImages?.length > 0
      ? `https://api-challenge.icib.dev/media/${auctionImages[0].imageId}`
      : null;

  // Calcola il prezzo corrente (ultima offerta o prezzo di partenza)
  const currentPrice =
    bids?.length > 0
      ? Math.max(...bids.map((bid) => bid.amount))
      : startingPrice;

  // Calcola il tempo rimanente
  const getTimeRemaining = () => {
    const now = new Date();
    const end = new Date(endDate);
    const diff = end.getTime() - now.getTime();

    if (diff <= 0) return "Scaduta";

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    if (days > 0) return `${days}g ${hours}h`;
    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes}m`;
  };

  const isExpired = new Date(endDate) < new Date();

  return (
    <Link to={`/auctions/${id}`}>
      <Card className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer group h-full flex flex-col">
        <div className="relative w-full h-48 shrink-0 overflow-hidden">
          {imageError || !imageUrl ? (
            <div className="w-full h-full bg-gray-100 flex items-center justify-center">
              <ImageOff className="h-8 w-8 text-gray-400" />
            </div>
          ) : (
            <img
              src={imageUrl}
              alt={title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              onError={() => setImageError(true)}
            />
          )}

          <div className="absolute top-2 left-2">
            {status === "INACTIVE" || isExpired ? (
              <Badge variant="secondary">Terminata</Badge>
            ) : (
              <Badge className="bg-green-500">Attiva</Badge>
            )}
          </div>

          {/* Tempo rimanente */}
          {status === "ACTIVE" && !isExpired && (
            <div className="absolute top-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {getTimeRemaining()}
            </div>
          )}

          {/* Preferiti */}
          {_count && (
            <div className="absolute bottom-2 right-2 bg-white/90 text-gray-700 text-xs px-2 py-1 rounded flex items-center gap-1">
              <Heart className="h-3 w-3" />
              {_count.auctionFavorites}
            </div>
          )}
        </div>

        <CardContent className="p-3 flex-1 flex flex-col">
          <h3 className="font-medium text-sm line-clamp-2 mb-2 flex-1">
            {title}
          </h3>

          <div className="flex items-center justify-between mt-auto">
            <div>
              <p className="text-xs text-gray-500">
                {bids?.length > 0 ? "Offerta attuale" : "Base d'asta"}
              </p>
              <p className="font-bold text-primary">
                €
                {currentPrice?.toLocaleString("it-IT", {
                  minimumFractionDigits: 2,
                })}
              </p>
            </div>

            {bids?.length > 0 && (
              <div className="text-right">
                <p className="text-xs text-gray-500">Offerte</p>
                <p className="font-semibold text-sm">{bids.length}</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
