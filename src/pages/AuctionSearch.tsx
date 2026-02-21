import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ArrowLeft, Search, Loader2, Heart } from "lucide-react";
import { Input } from "@/components/ui/input";
import { getAuctions } from "@/api/services/AuctionServiceApi";
import AuctionCard from "@/components/view/AuctionCard";
import type { AuctionResponse } from "@/types/auction";

export default function AuctionSearch() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const queryFromUrl = searchParams.get("q") || "";
  const categoryFromUrl = searchParams.get("category") || "";
  const categoryNameFromUrl = searchParams.get("categoryName") || "";
  const favoritesFromUrl = searchParams.get("favorites") === "true";

  const [searchQuery, setSearchQuery] = useState(queryFromUrl);
  const [auctions, setAuctions] = useState<AuctionResponse[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  // Effettua la ricerca quando cambiano i parametri nell'URL o al mount
  useEffect(() => {
    setSearchQuery(queryFromUrl);
    searchAuctions(queryFromUrl, categoryFromUrl, favoritesFromUrl);
  }, [queryFromUrl, categoryFromUrl, favoritesFromUrl]);

  const searchAuctions = async (
    query: string,
    categoryId?: string,
    favoritesOnly?: boolean,
  ) => {
    try {
      setIsLoading(true);
      setHasSearched(true);
      const params: any = {
        page: 1,
        limit: 20,
      };

      if (query) {
        params.keyword = query;
      }

      if (categoryId) {
        params.categoryId = categoryId;
      }

      if (favoritesOnly) {
        params.showFavoritesOnly = true;
      }

      const result = await getAuctions(params);
      setAuctions(result.list || []);
    } catch (error) {
      console.error("Errore durante la ricerca:", error);
      setAuctions([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Mantieni la categoria e i preferiti se presenti
      const newParams: Record<string, string> = { q: searchQuery.trim() };
      if (categoryFromUrl) {
        newParams.category = categoryFromUrl;
        if (categoryNameFromUrl) {
          newParams.categoryName = categoryNameFromUrl;
        }
      }
      if (favoritesFromUrl) {
        newParams.favorites = "true";
      }
      setSearchParams(newParams);
    }
  };

  const clearCategory = () => {
    const newParams: Record<string, string> = {};
    if (queryFromUrl) {
      newParams.q = queryFromUrl;
    }
    if (favoritesFromUrl) {
      newParams.favorites = "true";
    }
    if (Object.keys(newParams).length === 0) {
      setAuctions([]);
      setHasSearched(false);
    }
    setSearchParams(newParams);
  };

  const clearFavorites = () => {
    const newParams: Record<string, string> = {};
    if (queryFromUrl) {
      newParams.q = queryFromUrl;
    }
    if (categoryFromUrl) {
      newParams.category = categoryFromUrl;
      if (categoryNameFromUrl) {
        newParams.categoryName = categoryNameFromUrl;
      }
    }
    setSearchParams(newParams);
  };

  // Genera il titolo della ricerca
  const getSearchTitle = () => {
    const parts = [];
    if (favoritesFromUrl) {
      parts.push("I miei preferiti");
    }
    if (queryFromUrl) {
      parts.push(`"${queryFromUrl}"`);
    }
    if (categoryNameFromUrl) {
      parts.push(`in ${categoryNameFromUrl}`);
    }
    return parts.join(" ");
  };

  // Titolo pagina
  const getPageTitle = () => {
    if (favoritesFromUrl) {
      return "I miei preferiti";
    }
    return "Cerca aste";
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <button
        onClick={() => navigate("/home")}
        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors">
        <ArrowLeft className="w-5 h-5" />
        <span>Torna alla home</span>
      </button>

      {/* Header pagina preferiti */}
      {favoritesFromUrl && (
        <div className="mb-6">
          <div className="flex items-center gap-3">
            <Heart className="w-8 h-8 text-red-500 fill-red-500" />
            <h1 className="text-3xl font-bold">I miei preferiti</h1>
          </div>
          <p className="mt-2 text-gray-600">
            Le aste che hai salvato tra i preferiti
          </p>
        </div>
      )}

      {/* Barra di ricerca nella pagina */}
      <div className="mb-8">
        <form onSubmit={handleSearch} className="max-w-2xl">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Input
              type="text"
              placeholder="Cerca aste..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 py-6 text-lg"
            />
          </div>
        </form>

        {/* Mostra i filtri attivi */}
        <div className="mt-3 flex items-center gap-2 flex-wrap">
          {getSearchTitle() && !favoritesFromUrl && (
            <p className="text-gray-600">
              Risultati per:{" "}
              <span className="font-semibold">{getSearchTitle()}</span>
            </p>
          )}
          {favoritesFromUrl && (
            <button
              onClick={clearFavorites}
              className="inline-flex items-center gap-1 px-2 py-1 bg-red-100 hover:bg-red-200 rounded text-sm text-red-700 transition-colors">
              <Heart className="w-3 h-3 fill-current" />
              Preferiti
              <span className="ml-1">×</span>
            </button>
          )}
          {categoryNameFromUrl && (
            <button
              onClick={clearCategory}
              className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 hover:bg-gray-200 rounded text-sm text-gray-700 transition-colors">
              {categoryNameFromUrl}
              <span className="ml-1">×</span>
            </button>
          )}
        </div>
      </div>

      {/* Stato di caricamento */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
          <span className="ml-3 text-gray-500">
            {favoritesFromUrl
              ? "Caricamento preferiti..."
              : "Ricerca in corso..."}
          </span>
        </div>
      ) : auctions.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          {favoritesFromUrl ? (
            <>
              <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-lg">
                Non hai ancora aggiunto aste ai preferiti
              </p>
              <p className="text-gray-400 mt-2">
                Esplora le aste e clicca sul cuore per salvarle qui
              </p>
              <button
                onClick={() => setSearchParams({})}
                className="mt-4 text-primary hover:underline">
                Scopri le aste disponibili
              </button>
            </>
          ) : hasSearched ? (
            <p>
              Nessuna asta trovata
              {getSearchTitle() ? ` per ${getSearchTitle()}` : ""}
            </p>
          ) : (
            <p>Inserisci un termine di ricerca per trovare le aste.</p>
          )}
        </div>
      ) : (
        <>
          <p className="mb-4 text-gray-600">
            {auctions.length}{" "}
            {auctions.length === 1 ? "risultato" : "risultati"} trovati
          </p>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {auctions.map((auction) => (
              <AuctionCard auction={auction} key={auction.id} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
