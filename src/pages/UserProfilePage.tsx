import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Loader2, User, Calendar, Mail, Phone } from "lucide-react";
import { getInitials, formatDate } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getUserById } from "@/api/services/UserServiceApi";
import { getAuctions } from "@/api/services/AuctionServiceApi";
import AuctionCard from "@/components/view/AuctionCard";
import type { UserResponse } from "@/types/user";
import type { AuctionResponse } from "@/types/auction";

export default function UserProfilePage() {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();

  const [user, setUser] = useState<UserResponse | null>(null);
  const [auctions, setAuctions] = useState<AuctionResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (userId) {
      loadUserData();
    }
  }, [userId]);

  const loadUserData = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Carica i dati dell'utente
      const userData = await getUserById(userId!);
      setUser(userData);

      // Carica le aste dell'utente
      const auctionsData = await getAuctions({
        ownerId: userId,
        page: 1,
        limit: 20,
      });
      setAuctions(auctionsData.list || []);
    } catch (err) {
      console.error("Errore nel caricamento del profilo:", err);
      setError("Impossibile caricare il profilo utente");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
        </div>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors">
          <ArrowLeft className="w-5 h-5" />
          <span>Indietro</span>
        </button>
        <div className="text-center py-12">
          <User className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 text-lg">
            {error || "Utente non trovato"}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors">
        <ArrowLeft className="w-5 h-5" />
        <span>Indietro</span>
      </button>

      {/* Header Profilo */}
      <Card className="overflow-hidden mb-8">
        {/* Info Profilo */}
        <div className="px-6 pb-6">
          <div className="flex flex-col sm:flex-row items-center sm:items-end gap-4 mt-4">
            <Avatar className="h-24 w-24 border-4 border-white shadow-lg flex-shrink-0">
              <AvatarImage
                src={
                  user.profilePictureId
                    ? `https://api-challenge.icib.dev/media/${user.profilePictureId}`
                    : undefined
                }
                alt={user.name}
              />
              <AvatarFallback className="bg-gray-100 text-2xl">
                {getInitials("U", user.name, user.surname)}
              </AvatarFallback>
            </Avatar>

            <div className="flex-1 text-center sm:text-left sm:pb-1 min-w-0">
              <h1 className="text-2xl font-bold truncate">
                {user.name} {user.surname}
              </h1>
              {user.description && (
                <p className="text-gray-600 mt-1 line-clamp-2">
                  {user.description}
                </p>
              )}
            </div>
          </div>

          {/* Info di contatto */}
          <div className="flex flex-wrap justify-center sm:justify-start gap-x-6 gap-y-2 mt-6 pt-4 border-t text-sm text-gray-600">
            {user.email && (
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 flex-shrink-0" />
                <span className="truncate">{user.email}</span>
              </div>
            )}
            {user.phone && (
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 flex-shrink-0" />
                <span>{user.phone}</span>
              </div>
            )}
            {user.createdAt && (
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 flex-shrink-0" />
                <span>Iscritto dal {formatDate(user.createdAt)}</span>
              </div>
            )}
          </div>
        </div>
      </Card>

      {/* Aste dell'utente */}
      <section>
        <h2 className="text-xl font-bold mb-4">
          Aste di {user.name}{" "}
          <span className="text-gray-400 font-normal">({auctions.length})</span>
        </h2>

        {auctions.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center text-gray-500">
              <p>Questo utente non ha ancora creato aste</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {auctions.map((auction) => (
              <AuctionCard key={auction.id} auction={auction} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
