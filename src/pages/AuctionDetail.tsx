import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "@/store/useAuthStore";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import type { AuctionResponse } from "@/types/auction";

// Componenti
import ImageGallery from "@/components/auction/ImageGallery";
import AuctionInfo from "@/components/auction/AuctionInfo";
import AuctionTimer from "@/components/auction/AuctionTimer";
import AuctionOwner from "@/components/auction/AuctionOwner";
import AuctionWinner from "@/components/auction/AuctionWinner";
import BidForm from "@/components/auction/BidForm";
import BidHistory from "@/components/auction/BidHistory";
import AuctionCard from "@/components/view/AuctionCard";
import {
  getAuctionById,
  getAuctions,
  setAuctionFavourite,
  createAuctionBid,
  getAuctionsCategory,
  deleteAuction,
} from "@/api/services/AuctionServiceApi";
import type { Category } from "@/types/auction";

export default function AuctionDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuthStore();
  const navigate = useNavigate();

  const [auction, setAuction] = useState<AuctionResponse | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [suggestedAuctions, setSuggestedAuctions] = useState<AuctionResponse[]>(
    [],
  );
  const [isLoading, setIsLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isExpired, setIsExpired] = useState(false);

  // Carica le categorie
  const loadCategories = async () => {
    try {
      const data = await getAuctionsCategory();
      setCategories(data);
    } catch (error) {
      console.error("Errore nel caricamento delle categorie:", error);
    }
  };

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

      // Carica le aste suggerite della stessa categoria
      loadSuggestedAuctions(data.categoryId, id);
    } catch (error) {
      console.error("Errore nel caricamento dell'asta:", error);
    } finally {
      if (showLoading) setIsLoading(false);
    }
  };

  // Carica le aste suggerite della stessa categoria
  const loadSuggestedAuctions = async (
    categoryId: string,
    currentAuctionId: string,
  ) => {
    try {
      const result = await getAuctions({
        categoryId,
        page: 1,
        limit: 6,
      });

      // Filtra per escludere l'asta corrente
      const filtered = (result.list || []).filter(
        (auction: AuctionResponse) => auction.id !== currentAuctionId,
      );

      setSuggestedAuctions(filtered.slice(0, 5));
    } catch (error) {
      console.error("Errore nel caricamento delle aste suggerite:", error);
    }
  };

  // Funzione per ottenere il nome della categoria
  const getCategoryName = (categoryId: string) => {
    // Prima controlla se l'asta ha già l'oggetto category
    if (auction?.category?.name) {
      return auction.category.name;
    }
    // Altrimenti cerca nella lista delle categorie
    const category = categories.find((cat) => cat.id === categoryId);
    return category?.name || "Senza categoria";
  };

  useEffect(() => {
    loadCategories();
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

    await deleteAuction(id);
    navigate("/home");
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
      {/* Torna indietro */}
      <button
        onClick={() => window.history.back()}
        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors">
        <ArrowLeft className="w-5 h-5" />
        <span>Indietro</span>
      </button>

      {/* Layout principale */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Colonna sinistra - Immagini (2/3) */}
        <div className="lg:col-span-2">
          <ImageGallery images={auction.auctionImages} title={auction.title} />
        </div>

        {/* Colonna destra - Info e Azioni (1/3) */}
        <div className="lg:col-span-1 space-y-4">
          {/* Info principali */}
          <AuctionInfo
            title={auction.title}
            description={auction.description}
            categoryName={getCategoryName(auction.categoryId)}
            createdAt={auction.createdAt}
            favoritesCount={auction._count.auctionFavorites}
            isFavorite={isFavorite}
            onToggleFavorite={handleToggleFavorite}
          />
          {/* Vincitore (se asta scaduta e c'è un vincitore) */}
          {isExpired && auction.winningBid && (
            <AuctionWinner winningBid={auction.winningBid} />
          )}
          {/* Timer */}
          <AuctionTimer endDate={auction.endDate} onExpire={handleExpire} />

          {/* Form Offerta */}
          <BidForm
            currentBid={getCurrentBid()}
            startingPrice={auction.startingPrice}
            isOwner={isOwner}
            isExpired={isExpired}
            onPlaceBid={handlePlaceBid}
            onWithdraw={handleWithdraw}
          />

          {/* Venditore */}
          <AuctionOwner ownerId={auction.ownerId} />
        </div>
      </div>

      {/* Storico Offerte */}
      <section className="mt-12">
        <BidHistory
          bids={auction.bids}
          winningBid={auction.winningBid}
          isExpired={isExpired}
        />
      </section>

      {/* Aste Suggerite */}
      {suggestedAuctions.length > 0 && (
        <section className="mt-12">
          <h2 className="text-2xl font-bold mb-6">Aste simili</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
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
