import { useEffect, useState } from "react";
import AuctionCard from "@/components/view/AuctionCard";
import { mockAuctions } from "@/data/mockData";

interface Auction {
  id: string;
  title: string;
  image: string;
  currentBid: number;
  category: string;
  favoritesCount: number;
}

export default function LatestAuctionsPage() {
  const [auctions, setAuctions] = useState<Auction[]>(mockAuctions);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // const fetchAuctions = async () => {
    //   try {
    //     const response = await fetch("/api/auctions/latest");
    //     if (response.ok) {
    //       const data = await response.json();
    //       setAuctions(data);
    //     }
    //   } catch (error) {
    //     console.error("Errore nel caricamento delle aste:", error);
    //   } finally {
    //     setIsLoading(false);
    //   }
    // };
    // fetchAuctions();
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Ultime Aste</h1>

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
            <AuctionCard
              key={auction.id}
              id={auction.id}
              title={auction.title}
              image={auction.image}
              currentBid={auction.currentBid}
              category={auction.category}
              favoritesCount={auction.favoritesCount}
            />
          ))}
        </div>
      )}
    </div>
  );
}
