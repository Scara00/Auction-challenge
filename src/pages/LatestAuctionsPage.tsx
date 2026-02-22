import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import AuctionCard from "@/components/view/AuctionCard";
import type { AuctionResponse } from "@/types/auction";
import { getAuctions } from "@/api/services/AuctionServiceApi";

export default function LatestAuctionsPage() {
  const navigate = useNavigate();
  const [auctions, setAuctions] = useState<AuctionResponse[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const getListAuctions = async (favoritesOnly = false) => {
    try {
      const params: any = {
        page: 1,
        limit: 40,
      };

      // Passa showFavoritesOnly solo se richiesto
      if (favoritesOnly) {
        params.showFavoritesOnly = true;
      }

      const result = await getAuctions(params);
      setAuctions(result.list);
    } catch (error) {
      console.log(error);
    } finally {
      // Esempio di setUser dopo login riuscito
    }
  };
  useEffect(() => {
    getListAuctions(false);
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <button
        onClick={() => navigate("/home")}
        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors">
        <ArrowLeft className="w-5 h-5" />
        <span>Torna alla home</span>
      </button>

      <h2 className="text-3xl font-bold mb-8">Ultime Aste</h2>

      {isLoading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {[...Array(20)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="aspect-square bg-gray-200 rounded-lg mb-2" />
              <div className="h-4 bg-gray-200 rounded mb-2" />
              <div className="h-6 bg-gray-200 rounded w-2/3" />
            </div>
          ))}
        </div>
      ) : auctions.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <p>Nessuna asta disponibile al momento.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {auctions.map((auction) => (
            <AuctionCard key={auction.id} auction={auction} />
          ))}
        </div>
      )}
    </div>
  );
}
