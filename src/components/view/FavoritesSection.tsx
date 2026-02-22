import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Heart } from "lucide-react";
import AuctionCard from "./AuctionCard";
import type { AuctionResponse } from "@/types/auction";

interface FavoritesSectionProps {
  favorites: AuctionResponse[];
  isLoading?: boolean;
}

export default function FavoritesSection({
  favorites,
  isLoading = false,
}: FavoritesSectionProps) {
  if (isLoading) {
    return (
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
          <Heart className="h-6 w-6 text-red-500" />I tuoi Preferiti
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="aspect-[4/3] bg-gray-200 rounded-lg" />
            </div>
          ))}
        </div>
      </section>
    );
  }

  if (favorites.length === 0) {
    return (
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
          <Heart className="h-6 w-6 text-red-500" />I tuoi Preferiti
        </h2>
        <div className="text-center py-8 bg-gray-50 rounded-lg">
          <Heart className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 mb-4">
            Non hai ancora salvato nessuna asta nei preferiti.
          </p>
          <Link to="/auctions/latest">
            <Button variant="outline">Esplora le aste</Button>
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="mb-12">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <Heart className="h-6 w-6 text-red-500" />I tuoi Preferiti
        </h2>
        <Link to="/search?favorites=true">
          <Button variant="outline" className="gap-2">
            Vedi tutti
            <ArrowRight className="h-4 w-4" />
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
        {favorites.slice(0, 6).map((auction) => (
          <AuctionCard auction={auction} key={auction.id} />
        ))}
      </div>
    </section>
  );
}
