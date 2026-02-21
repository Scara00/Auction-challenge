import { useState } from "react";
import { Button } from "@/components/ui/button";

export default function AuctionSearch() {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Searching for:", searchQuery);
    // Implementare logica di ricerca
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Cerca Aste</h1>

      <form onSubmit={handleSearch} className="mb-8">
        <div className="flex gap-4">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cerca per titolo, categoria..."
            className="flex-1 px-4 py-2 border border-gray-300 rounded-md"
          />
          <Button type="submit">Cerca</Button>
        </div>
      </form>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Placeholder per risultati ricerca */}
        <p className="text-gray-500">
          Nessuna asta trovata. Inizia una ricerca!
        </p>
      </div>
    </div>
  );
}
