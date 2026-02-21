import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ArrowLeft, Search, Loader2 } from "lucide-react";
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

  const [searchQuery, setSearchQuery] = useState(queryFromUrl);
  const [auctions, setAuctions] = useState<AuctionResponse[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  // Effettua la ricerca quando cambiano i parametri nell'URL o al mount
  useEffect(() => {
    setSearchQuery(queryFromUrl);
    searchAuctions(queryFromUrl, categoryFromUrl);
  }, [queryFromUrl, categoryFromUrl]);

  const searchAuctions = async (query: string, categoryId?: string) => {
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
      // Mantieni la categoria se presente
      const newParams: Record<string, string> = { q: searchQuery.trim() };
      if (categoryFromUrl) {
        newParams.category = categoryFromUrl;
        if (categoryNameFromUrl) {
          newParams.categoryName = categoryNameFromUrl;
        }
      }
      setSearchParams(newParams);
    }
  };

  const clearCategory = () => {
    if (queryFromUrl) {
      setSearchParams({ q: queryFromUrl });
    } else {
      setSearchParams({});
      setAuctions([]);
      setHasSearched(false);
    }
  };

  // Genera il titolo della ricerca
  const getSearchTitle = () => {
    if (categoryNameFromUrl && queryFromUrl) {
      return `"${queryFromUrl}" in ${categoryNameFromUrl}`;
    } else if (categoryNameFromUrl) {
      return categoryNameFromUrl;
    } else if (queryFromUrl) {
      return `"${queryFromUrl}"`;
    }
    return "";
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <button
        onClick={() => navigate("/home")}
        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors">
        <ArrowLeft className="w-5 h-5" />
        <span>Torna alla home</span>
      </button>

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
          {getSearchTitle() && (
            <p className="text-gray-600">
              Risultati per:{" "}
              <span className="font-semibold">{getSearchTitle()}</span>
            </p>
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
          <span className="ml-3 text-gray-500">Ricerca in corso...</span>
        </div>
      ) : auctions.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          {hasSearched ? (
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
