import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Trophy } from "lucide-react";
import type { BidInAuctionResponse, WinningBidResponse } from "@/types/auction";

interface BidHistoryProps {
  bids: BidInAuctionResponse[];
  winningBid: WinningBidResponse | null;
  isExpired: boolean;
}

export default function BidHistory({
  bids,
  winningBid,
  isExpired,
}: BidHistoryProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("it-IT", {
      day: "2-digit",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatCurrency = (amount: number) => {
    if (amount === undefined || amount === null) return "0,00";
    return amount.toLocaleString("it-IT", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  // Ordina le offerte per importo decrescente (filtra quelle senza amount)
  const sortedBids = [...bids]
    .filter((bid) => bid.amount !== undefined)
    .sort((a, b) => b.amount - a.amount);
  const topBid = sortedBids[0];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Storico offerte ({bids.length})</CardTitle>
      </CardHeader>
      <CardContent>
        {/* Vincitore se asta scaduta */}
        {isExpired && winningBid && (
          <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Trophy className="h-5 w-5 text-yellow-500" />
              <span className="font-semibold text-green-700">Vincitore</span>
            </div>
            <div className="flex items-center gap-3">
              <Avatar>
                <AvatarFallback>🏆</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-semibold">Offerta vincente</p>
                <p className="text-green-600 font-bold">
                  €{formatCurrency(winningBid.bid.amount)}
                </p>
              </div>
            </div>
          </div>
        )}

        {bids.length === 0 ? (
          <p className="text-gray-500 text-center py-8">
            Nessuna offerta ancora. Sii il primo!
          </p>
        ) : (
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {sortedBids.map((bid, index) => (
              <div
                key={bid.id}
                className={`flex items-center justify-between p-3 rounded-lg ${
                  index === 0 ? "bg-green-50" : "bg-gray-50"
                }`}>
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarImage src={bid.user?.profileImage} />
                    <AvatarFallback>
                      {bid.user?.name ? getInitials(bid.user.name) : "U"}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold flex items-center gap-2">
                      {bid.user?.name ||
                        `Utente ${bid.userId?.slice(0, 8) || "Anonimo"}`}
                      {index === 0 && (
                        <Badge variant="secondary" className="text-xs">
                          Migliore
                        </Badge>
                      )}
                    </p>
                    <p className="text-sm text-gray-500">
                      {formatDate(bid.createdAt)}
                    </p>
                  </div>
                </div>
                <span
                  className={`font-bold text-lg ${
                    index === 0 ? "text-green-600" : ""
                  }`}>
                  €{formatCurrency(bid.amount)}
                </span>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
