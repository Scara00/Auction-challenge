import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Trophy, Loader2, Award, PartyPopper } from "lucide-react";
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
      <Card className="border-2 border-yellow-400 bg-gradient-to-br from-yellow-50 via-amber-50 to-orange-50">
        <CardContent className="py-8">
          <div className="flex items-center justify-center">
            <Loader2 className="w-6 h-6 animate-spin text-yellow-600" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="relative border-2 border-yellow-400 bg-gradient-to-br from-yellow-50 via-amber-50 to-orange-50 overflow-hidden">
      {/* Decorazioni di sfondo */}
      <div className="absolute top-0 right-0 opacity-10">
        <Trophy className="w-32 h-32 text-yellow-600 -mt-4 -mr-4" />
      </div>
      <div className="absolute bottom-0 left-0 opacity-10">
        <PartyPopper className="w-20 h-20 text-yellow-600 -mb-2 -ml-2" />
      </div>

      <CardContent className="py-6 relative">
        {/* Header con badge */}
        <div className="flex items-center justify-center gap-2 mb-6">
          <Award className="w-5 h-5 text-yellow-600" />
          <span className="px-3 py-1 bg-yellow-400 text-yellow-900 text-sm font-bold rounded-full uppercase tracking-wide">
            Vincitore
          </span>
          <Award className="w-5 h-5 text-yellow-600" />
        </div>

        {/* Contenuto principale */}
        <div className="flex flex-col items-center text-center">
          {/* Avatar con bordo dorato */}
          <Link to={`/user/${winner?.id}`} className="group">
            <div className="relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-yellow-400 via-amber-400 to-yellow-400 rounded-full blur opacity-75 group-hover:opacity-100 transition-opacity" />
              <Avatar className="relative h-20 w-20 border-4 border-yellow-400 shadow-lg cursor-pointer">
                <AvatarImage
                  src={
                    winner?.profilePictureId
                      ? `https://api-challenge.icib.dev/media/${winner.profilePictureId}`
                      : undefined
                  }
                  alt={winner?.name}
                />
                <AvatarFallback className="bg-gradient-to-br from-yellow-100 to-amber-100 text-yellow-700 text-2xl font-bold">
                  {getInitials(winner?.name, winner?.surname)}
                </AvatarFallback>
              </Avatar>
              {/* Trofeo badge */}
              <div className="absolute -bottom-1 -right-1 bg-yellow-400 rounded-full p-1.5 shadow-md">
                <Trophy className="w-4 h-4 text-yellow-800" />
              </div>
            </div>
          </Link>

          {/* Nome vincitore */}
          <Link
            to={`/user/${winner?.id}`}
            className="mt-4 font-bold text-xl text-gray-800 hover:text-yellow-700 transition-colors">
            {winner?.name} {winner?.surname}
          </Link>

          <p className="text-sm text-gray-500 mt-1">ha vinto questa asta con</p>

          {/* Prezzo vincente */}
          <div className="mt-3 px-6 py-3 bg-white/80 backdrop-blur rounded-xl shadow-inner border border-yellow-200">
            <p className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-600">
              €{formatCurrency(winningBid.bid.amount)}
            </p>
          </div>

          {/* Messaggio celebrativo */}
          <p className="mt-4 text-xs text-yellow-700 flex items-center gap-1">
            <PartyPopper className="w-3 h-3" />
            Congratulazioni al vincitore!
            <PartyPopper className="w-3 h-3" />
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
