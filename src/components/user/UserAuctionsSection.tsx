import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import AuctionCard from "@/components/view/AuctionCard";
import type { AuctionResponse } from "@/types/auction";

interface UserAuctionsSectionProps {
  auctions: AuctionResponse[];
}

export default function UserAuctionsSection({
  auctions,
}: UserAuctionsSectionProps) {
  const navigate = useNavigate();

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Le tue aste</h3>
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate("/auctions/create")}>
          Crea nuova asta
        </Button>
      </div>

      {auctions && auctions.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {auctions.map((auction: AuctionResponse) => (
            <AuctionCard key={auction.id} auction={auction} />
          ))}
        </div>
      ) : (
        <div className="text-center py-8 text-gray-500">
          <p>Non hai ancora creato nessuna asta.</p>
          <Button
            variant="link"
            className="mt-2"
            onClick={() => navigate("/auction/create")}>
            Crea la tua prima asta
          </Button>
        </div>
      )}
    </div>
  );
}
