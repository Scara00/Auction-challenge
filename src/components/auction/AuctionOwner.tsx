import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { User, Loader2 } from "lucide-react";
import { getUserById } from "@/api/services/UserServiceApi";

interface OwnerData {
  id: string;
  name: string;
  surname?: string;
  profilePictureId?: string;
}

interface AuctionOwnerProps {
  ownerId: string;
}

export default function AuctionOwner({ ownerId }: AuctionOwnerProps) {
  const [owner, setOwner] = useState<OwnerData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchOwner = async () => {
      try {
        setIsLoading(true);
        const data = await getUserById(ownerId);
        setOwner(data);
      } catch (error) {
        console.error("Errore nel caricamento del venditore:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (ownerId) {
      fetchOwner();
    }
  }, [ownerId]);

  const getInitials = (name?: string, surname?: string) => {
    const initials = [];
    if (name) initials.push(name[0]);
    if (surname) initials.push(surname[0]);
    return initials.join("").toUpperCase() || "U";
  };

  const getFullName = () => {
    if (!owner) return "Utente";
    return [owner.name, owner.surname].filter(Boolean).join(" ");
  };

  return (
    <Card>
      <CardContent className="pt-4">
        <p className="text-sm text-gray-500 mb-3">Venditore</p>
        {isLoading ? (
          <div className="flex items-center gap-3 p-2 -m-2">
            <div className="h-12 w-12 rounded-full bg-gray-100 flex items-center justify-center">
              <Loader2 className="h-5 w-5 animate-spin text-gray-400" />
            </div>
            <div className="flex-1">
              <div className="h-4 w-24 bg-gray-100 rounded animate-pulse" />
            </div>
          </div>
        ) : (
          <Link
            to={`/user/${ownerId}`}
            className="flex items-center gap-3 hover:bg-gray-50 p-2 -m-2 rounded-lg transition-colors">
            <Avatar className="h-12 w-12">
              <AvatarImage
                src={
                  owner?.profilePictureId
                    ? `https://api-challenge.icib.dev/media/${owner.profilePictureId}`
                    : undefined
                }
                alt={getFullName()}
              />
              <AvatarFallback className="bg-gray-100">
                {owner ? (
                  getInitials(owner.name, owner.surname)
                ) : (
                  <User className="h-5 w-5 text-gray-400" />
                )}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-gray-900 truncate">
                {getFullName()}
              </p>
              <p className="text-sm text-primary hover:underline">
                Vedi profilo
              </p>
            </div>
          </Link>
        )}
      </CardContent>
    </Card>
  );
}
