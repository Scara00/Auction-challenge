import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useAuthStore } from "@/store/useAuthStore";
import { Button } from "@/components/ui/button";
import type { AuctionResponse } from "@/types/auction";

// Componenti
import ImageGallery from "@/components/auction/ImageGallery";
import AuctionInfo from "@/components/auction/AuctionInfo";
import AuctionTimer from "@/components/auction/AuctionTimer";
import BidForm from "@/components/auction/BidForm";
import BidHistory from "@/components/auction/BidHistory";
import AuctionCard from "@/components/view/AuctionCard";
import {
  getAuctionById,
  setAuctionFavourite,
  createAuctionBid,
} from "@/api/services/AuctionServiceApi";

export default function AuctionDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuthStore();

  const [auction, setAuction] = useState<AuctionResponse | null>(null);
  const [suggestedAuctions, setSuggestedAuctions] = useState<AuctionResponse[]>(
    [],
  );
  const [isLoading, setIsLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isExpired, setIsExpired] = useState(false);

  // Carica i dati dell'asta
  const loadAuctionData = async (showLoading = true) => {
    if (!id) return;

    try {
      if (showLoading) setIsLoading(true);
      const data = await getAuctionById(id);
      setAuction(data);

      // Verifica se scaduta
      const expired =
        new Date(data.endDate) < new Date() || data.status === "INACTIVE";
      setIsExpired(expired);
    } catch (error) {
      console.error("Errore nel caricamento dell'asta:", error);
    } finally {
      if (showLoading) setIsLoading(false);
    }
  };

  useEffect(() => {
    loadAuctionData(true);
  }, [id]);

  const handleToggleFavorite = async () => {
    await setAuctionFavourite(auction?.id);

    setIsFavorite(!isFavorite);
  };

  const handlePlaceBid = async (amount: number) => {
    if (!id) return;

    await createAuctionBid(id, { amount });

    // Ricarica i dati dell'asta senza mostrare lo skeleton
    await loadAuctionData(false);
  };

  const handleWithdraw = async () => {
    if (!id) return;

    // TODO: Chiamare API withdrawAuction
    // await withdrawAuction(id);

    // Aggiorna lo stato dell'asta
    if (auction) {
      setAuction({
        ...auction,
        status: "INACTIVE",
      });
    }
  };

  const handleExpire = () => {
    setIsExpired(true);
  };

  // Calcola il prezzo corrente
  const getCurrentBid = () => {
    if (!auction) return 0;
    if (auction.bids.length === 0) return 0;
    return Math.max(...auction.bids.map((bid) => bid.amount));
  };

  const isOwner = user?.id === auction?.ownerId;

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse space-y-8">
          <div className="h-8 bg-gray-200 rounded w-1/3" />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="aspect-video bg-gray-200 rounded-lg" />
            <div className="space-y-4">
              <div className="h-6 bg-gray-200 rounded w-1/4" />
              <div className="h-4 bg-gray-200 rounded" />
              <div className="h-4 bg-gray-200 rounded w-3/4" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!auction) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-2xl font-bold">Asta non trovata</h1>
        <Link to="/home ">
          <Button className="mt-4">Torna alla home</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Sezione 1: Dettagli Asta */}
      <section className="mb-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Galleria Immagini */}
          <ImageGallery images={auction.auctionImages} title={auction.title} />

          {/* Info Asta */}
          <div className="space-y-6">
            <AuctionInfo
              title={auction.title}
              description={auction.description}
              categoryId={auction.categoryId}
              createdAt={auction.createdAt}
              favoritesCount={auction._count.auctionFavorites}
              isFavorite={isFavorite}
              onToggleFavorite={handleToggleFavorite}
            />

            <AuctionTimer endDate={auction.endDate} onExpire={handleExpire} />
          </div>
        </div>
      </section>

      {/* Sezione 2: Offerte */}
      <section className="mb-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form Offerta */}
          <div className="lg:col-span-1">
            <BidForm
              currentBid={getCurrentBid()}
              startingPrice={auction.startingPrice}
              isOwner={isOwner}
              isExpired={isExpired}
              onPlaceBid={handlePlaceBid}
              onWithdraw={handleWithdraw}
            />
          </div>

          {/* Storico Offerte */}
          <div className="lg:col-span-2">
            <BidHistory
              bids={auction.bids}
              winningBid={auction.winningBid}
              isExpired={isExpired}
            />
          </div>
        </div>
      </section>

      {/* Sezione 3: Aste Suggerite */}
      {suggestedAuctions.length > 0 && (
        <section>
          <h2 className="text-2xl font-bold mb-6">Aste simili</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {suggestedAuctions.map((suggestedAuction) => (
              <AuctionCard
                key={suggestedAuction.id}
                auction={suggestedAuction}
              />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
