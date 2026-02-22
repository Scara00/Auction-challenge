import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Trophy, Loader2 } from "lucide-react";
import { getUserById } from "@/api/services/UserServiceApi";
import type { WinningBidResponse } from "@/types/auction";

interface AuctionWinnerProps {
  winningBid: WinningBidResponse;
}

interface WinnerData {
  id: string;
  name: string;
  surname?: string;
  profilePictureId?: string;
}

export default function AuctionWinner({ winningBid }: AuctionWinnerProps) {
  const [winner, setWinner] = useState<WinnerData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadWinnerData = async () => {
      try {
        setIsLoading(true);
        const userData = await getUserById(winningBid.bid.userId);
        setWinner(userData);
      } catch (error) {
        console.error("Errore nel caricamento del vincitore:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (winningBid?.bid?.userId) {
      loadWinnerData();
    }
  }, [winningBid]);

  const formatCurrency = (amount: number) => {
    return amount.toLocaleString("it-IT", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  const getInitials = (name?: string, surname?: string) => {
    const initials = [];
    if (name) initials.push(name[0]);
    if (surname) initials.push(surname[0]);
    return initials.join("").toUpperCase() || "V";
  };

  if (isLoading) {
    return (
      <Card className="border-2 border-yellow-400 bg-gradient-to-r from-yellow-50 to-amber-50">
        <CardContent className="py-6">
          <div className="flex items-center justify-center">
            <Loader2 className="w-6 h-6 animate-spin text-yellow-600" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-2 border-yellow-400 bg-gradient-to-r from-yellow-50 to-amber-50 overflow-hidden">
      <CardContent className="py-6">
        <div className="flex items-center gap-2 mb-4">
          <Trophy className="w-6 h-6 text-yellow-500" />
          <h3 className="text-lg font-bold text-yellow-700">
            Asta Conclusa - Vincitore
          </h3>
        </div>

        <div className="flex items-center gap-4">
          <Link to={`/user/${winner?.id}`}>
            <Avatar className="h-16 w-16 border-2 border-yellow-400 cursor-pointer hover:opacity-80 transition-opacity">
              <AvatarImage
                src={
                  winner?.profilePictureId
                    ? `https://api-challenge.icib.dev/media/${winner.profilePictureId}`
                    : undefined
                }
                alt={winner?.name}
              />
              <AvatarFallback className="bg-yellow-100 text-yellow-700 text-xl">
                {getInitials(winner?.name, winner?.surname)}
              </AvatarFallback>
            </Avatar>
          </Link>

          <div className="flex-1">
            <Link
              to={`/user/${winner?.id}`}
              className="font-semibold text-lg hover:underline">
              {winner?.name} {winner?.surname}
            </Link>
            <p className="text-sm text-gray-600">Ha vinto l'asta con</p>
            <p className="text-2xl font-bold text-green-600">
              €{formatCurrency(winningBid.bid.amount)}
            </p>
          </div>

          <div className="hidden sm:block">
            <Trophy className="w-12 h-12 text-yellow-400" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
