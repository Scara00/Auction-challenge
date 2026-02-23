import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuthStore } from "@/store/useAuthStore";
import { Button } from "@/components/ui/button";
import { Search, Plus } from "lucide-react";
import LatestAuctionsSection from "@/components/view/LatestAuctionsSection";
import FavoritesSection from "@/components/view/FavoritesSection";
import CategoriesSidebar from "@/components/view/CategoriesSidebar";

import {
  getAuctions,
  getAuctionsCategory,
} from "@/api/services/AuctionServiceApi";
import type { AuctionResponse, Category } from "@/types/auction";

export default function HomePage() {
  const { isAuthenticated, user } = useAuthStore();
  const [latestAuctions, setLatestAuctions] = useState<AuctionResponse[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [favorites, setFavorites] = useState<AuctionResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getData();
  }, [isAuthenticated]);

  const getData = async () => {
    setIsLoading(true);
    try {
      const listAuction = await getListAuctions(false);
      setLatestAuctions(listAuction || []);

      // Carica i preferiti solo se autenticato
      if (isAuthenticated) {
        const favoritesAuction = await getListAuctions(true);
        setFavorites(favoritesAuction || []);
      }

      await fetchCategories();
    } finally {
      setIsLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const data = await getAuctionsCategory();
      setCategories(data.list || []);
    } catch (error) {
      console.error("Errore nel caricamento delle categorie:", error);
    }
  };

  const getListAuctions = async (favoritesOnly = false) => {
    try {
      const params: any = {
        page: 1,
        limit: 10,
      };

      // Passa showFavoritesOnly solo se richiesto (utente loggato)
      if (favoritesOnly) {
        params.showFavoritesOnly = true;
      }

      const result = await getAuctions(params);
      return result.list;
    } catch (error) {
      console.log(error);
      return [];
    }
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section - Compatto */}
      <section className="bg-slate-900 text-white py-10">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold mb-2">
                Benvenuto su ICB Auctions
              </h1>
              <p className="text-gray-400">
                Scopri le migliori aste online. Compra e vendi in modo semplice
                e sicuro.
              </p>
            </div>

            <div className="flex gap-3">
              <Link to="/search">
                <Button
                  variant="outline"
                  className="gap-2 bg-white text-slate-900 hover:bg-gray-100 border-white">
                  <Search className="w-4 h-4" />
                  Esplora
                </Button>
              </Link>
              {isAuthenticated ? (
                <Link to="/auctions/create">
                  <Button
                    variant="outline"
                    className="gap-2 bg-white text-slate-900 hover:bg-gray-100 border-white">
                    <Plus className="w-4 h-4" />
                    Crea asta
                  </Button>
                </Link>
              ) : (
                <>
                  <Link to="/login">
                    <Button
                      variant="outline"
                      className="bg-white text-slate-900 hover:bg-gray-100 border-white">
                      Accedi
                    </Button>
                  </Link>
                  <Link to="/register">
                    <Button
                      variant="outline"
                      className="bg-white text-slate-900 hover:bg-gray-100 border-white">
                      Registrati
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Layout principale con sidebar categorie */}
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Contenuto principale */}
          <div className="flex-1 min-w-0">
            {/* Ultime Aste */}
            <LatestAuctionsSection
              auctions={latestAuctions}
              isLoading={isLoading}
            />

            {/* Preferiti (solo se autenticato) */}
            {isAuthenticated && (
              <FavoritesSection favorites={favorites} isLoading={isLoading} />
            )}
          </div>

          {/* Sidebar Categorie */}
          <CategoriesSidebar categories={categories} isLoading={isLoading} />
        </div>
      </div>
    </div>
  );
}
