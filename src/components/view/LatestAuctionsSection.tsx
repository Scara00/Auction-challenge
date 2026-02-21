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
      <section className="py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold mb-6">Ultime Aste</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="aspect-square bg-gray-200 rounded-lg mb-2" />
                <div className="h-4 bg-gray-200 rounded mb-2" />
                <div className="h-6 bg-gray-200 rounded w-2/3" />
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-12">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Ultime Aste</h2>
          <Link to="/auctions/latest">
            <Button variant="outline" className="gap-2">
              Visualizza le ultime aste
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>

        {auctions.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <p>Nessuna asta disponibile al momento.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {auctions.slice(0, 10).map((auction) => (
              <AuctionCard auction={auction} key={auction.id} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
