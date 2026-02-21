import { useRef } from "react";
import { Button } from "@/components/ui/button";
import { Camera, Mail, Phone, Calendar, Loader2 } from "lucide-react";
import type { UserResponse } from "@/types/user";

interface ProfileCardProps {
  userData: UserResponse | null;
  previewImage: string | null;
  isSaving: boolean;
  onImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onLogout: () => void;
}

export default function ProfileCard({
  userData,
  previewImage,
  isSaving,
  onImageChange,
  onLogout,
}: ProfileCardProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const getProfileImageUrl = () => {
    if (userData?.profilePictureId)
      return `https://api-challenge.icib.dev/media/${userData.profilePictureId}`;
    return null;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("it-IT", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  return (
    <div className="bg-white shadow rounded-lg p-6 space-y-4">
      {/* Immagine Profilo */}
      <div className="flex flex-col items-center">
        <div
          className="relative group cursor-pointer"
          onClick={handleImageClick}>
          <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center border-4 border-white shadow-lg">
            {getProfileImageUrl() ? (
              <img
                src={getProfileImageUrl()!}
                alt="Profilo"
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-4xl font-semibold text-gray-400">
                {userData?.name?.charAt(0)?.toUpperCase() || "U"}
              </span>
            )}
          </div>
          <div className="absolute inset-0 rounded-full bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <Camera className="w-8 h-8 text-white" />
          </div>
          {isSaving && (
            <div className="absolute inset-0 rounded-full bg-black bg-opacity-50 flex items-center justify-center">
              <Loader2 className="w-8 h-8 text-white animate-spin" />
            </div>
          )}
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={onImageChange}
          className="hidden"
        />
        <p className="text-sm text-gray-500 mt-2">Clicca per cambiare foto</p>
      </div>

      {/* Nome completo */}
      <div className="text-center">
        <h2 className="text-xl font-semibold">
          {userData?.name} {userData?.surname}
        </h2>
        <span
          className={`inline-block mt-1 px-2 py-0.5 rounded-full text-xs font-medium ${
            userData?.status === "ACTIVE"
              ? "bg-green-100 text-green-800"
              : "bg-gray-100 text-gray-800"
          }`}>
          {userData?.status === "ACTIVE" ? "Attivo" : "Inattivo"}
        </span>
      </div>

      {/* Info contatto */}
      <div className="space-y-3 pt-4 border-t">
        <div className="flex items-center gap-3 text-gray-600">
          <Mail className="w-4 h-4" />
          <span className="text-sm truncate">{userData?.email || "N/A"}</span>
        </div>
        <div className="flex items-center gap-3 text-gray-600">
          <Phone className="w-4 h-4" />
          <span className="text-sm">{userData?.phone || "N/A"}</span>
        </div>
        <div className="flex items-center gap-3 text-gray-600">
          <Calendar className="w-4 h-4" />
          <span className="text-sm">
            Iscritto il{" "}
            {userData?.createdAt ? formatDate(userData.createdAt) : "N/A"}
          </span>
        </div>
      </div>

      {/* Logout */}
      <div className="pt-4">
        <Button onClick={onLogout} variant="outline" className="w-full">
          Logout
        </Button>
      </div>
    </div>
  );
}
