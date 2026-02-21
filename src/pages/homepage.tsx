import { useEffect, useState } from "react";
import { useAuthStore } from "@/store/useAuthStore";
import LatestAuctionsSection from "@/components/view/LatestAuctionsSection";
import CategoriesSection from "@/components/view/CategoriesSection";
import FavoritesSection from "@/components/view/FavoritesSection";
import { type Category } from "@/data/mockData";
import {
  getAuctions,
  getAuctionsCategory,
} from "@/api/services/AuctionServiceApi";
import type { AuctionResponse } from "@/types/auction";

export default function HomePage() {
  const { isAuthenticated, user } = useAuthStore();
  const [latestAuctions, setLatestAuctions] = useState<AuctionResponse[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [favorites, setFavorites] = useState<AuctionResponse[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    const listAuction = await getListAuctions(false);
    setLatestAuctions(listAuction);
    const favoritesAuction = await getListAuctions(true);
    setFavorites(favoritesAuction);
    fetchCategories();
  };

  const fetchCategories = async () => {
    try {
      const data = await getAuctionsCategory();
      setCategories(data.list);
    } catch (error) {
      console.error("Errore nel caricamento delle categorie:", error);
    } finally {
      console.log("Caricamento categorie completato");
    }
  };

  const getListAuctions = async (favoritesOnly = false) => {
    try {
      const params = {
        //ownerId: user?.id,
        page: 1,
        limit: 10,
        showFavoritesOnly: favoritesOnly,
      };
      const result = await getAuctions(params);
      return result.list;
    } catch (error) {
      console.log(error);
    } finally {
      // Esempio di setUser dopo login riuscito
    }
  };

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-slate-800 to-slate-600 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Benvenuto su ICB Auctions
          </h1>
          <p className="text-xl text-gray-200 max-w-2xl mx-auto">
            Scopri le migliori aste online. Compra e vendi in modo semplice e
            sicuro.
          </p>
        </div>
      </section>

      {/* Sezione 1: Ultime Aste */}
      <LatestAuctionsSection auctions={latestAuctions} isLoading={isLoading} />

      {/* Sezione 2: Categorie */}
      <CategoriesSection categories={categories} isLoading={isLoading} />

      {/* Sezione 3: Preferiti (solo se autenticato) */}
      {isAuthenticated && (
        <FavoritesSection favorites={favorites} isLoading={isLoading} />
      )}
    </div>
  );
}
