import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import AuctionCard from "./AuctionCard";
import type { AuctionResponse } from "@/types/auction";

interface LatestAuctionsSectionProps {
  auctions: AuctionResponse[];
  isLoading?: boolean;
}

export default function LatestAuctionsSection({
  auctions,
  isLoading = false,
}: LatestAuctionsSectionProps) {
  if (isLoading) {
    return (
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-6">Ultime Aste</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="aspect-[4/3] bg-gray-200 rounded-lg" />
            </div>
          ))}
        </div>
      </section>
    );
  }

  return (
    <section className="mb-12">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Ultime Aste</h2>
        <Link to="/auctions/latest">
          <Button variant="outline" className="gap-2">
            Vedi tutte
            <ArrowRight className="h-4 w-4" />
          </Button>
        </Link>
      </div>

      {auctions.length === 0 ? (
        <div className="text-center py-12 text-gray-500 bg-gray-50 rounded-lg">
          <p>Nessuna asta disponibile al momento.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {auctions.slice(0, 12).map((auction) => (
            <AuctionCard auction={auction} key={auction.id} />
          ))}
        </div>
      )}
    </section>
  );
}
