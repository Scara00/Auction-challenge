import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { useAuthStore } from "@/store/useAuthStore";
import { uploadMedia } from "@/api/services/MediaServiceApi";
import { GetLoggedUser, updateUser } from "@/api/services/UserServiceApi";
import type { UserResponse } from "@/types/user";
import ProfileCard from "@/components/user/ProfileCard";
import ProfileHeader from "@/components/user/ProfileHeader";
import PersonalInfoForm from "@/components/user/PersonalInfoForm";
import UserAuctionsSection from "@/components/user/UserAuctionsSection";
import ChangePasswordForm from "@/components/user/ChangePasswordForm";

export default function UserDetailPage() {
  const { logout } = useAuthStore();
  const navigate = useNavigate();

  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [userData, setUserData] = useState<UserResponse | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    surname: "",
    phone: "",
    description: "",
  });
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      setIsLoading(true);
      const data = await GetLoggedUser();
      setUserData(data);
      setFormData({
        name: data.name || "",
        surname: data.surname || "",
        phone: data.phone || "",
        description: data.description || "",
      });
    } catch (error) {
      console.error("Errore nel recupero dati utente:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Puoi caricare solo file immagine");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert("L'immagine deve essere inferiore a 5MB");
      return;
    }

    const preview = URL.createObjectURL(file);
    setPreviewImage(preview);

    try {
      setIsSaving(true);
      const response = await uploadMedia(file);
      // L'API richiede tutti i campi obbligatori anche per aggiornare solo l'immagine
      const updatedData = await updateUser({
        name: userData?.name || "",
        surname: userData?.surname || "",
        phone: userData?.phone || "",
        description: userData?.description || "",
        profilePictureId: response.id,
      });
      setUserData(updatedData);
    } catch (error) {
      console.error("Errore upload immagine:", error);
      alert("Errore durante il caricamento dell'immagine");
      setPreviewImage(null);
    } finally {
      setIsSaving(false);
    }
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      const updatedData = await updateUser(formData);
      setUserData(updatedData);
      setIsEditing(false);
    } catch (error) {
      console.error("Errore salvataggio:", error);
      alert("Errore durante il salvataggio");
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      name: userData?.name || "",
      surname: userData?.surname || "",
      phone: userData?.phone || "",
      description: userData?.description || "",
    });
    setIsEditing(false);
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <ProfileHeader
        isEditing={isEditing}
        isSaving={isSaving}
        onEdit={() => setIsEditing(true)}
        onSave={handleSave}
        onCancel={handleCancel}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Colonna sinistra - Info profilo */}
        <div className="lg:col-span-1">
          <ProfileCard
            userData={userData}
            previewImage={previewImage}
            isSaving={isSaving}
            onImageChange={handleImageChange}
            onLogout={handleLogout}
          />
        </div>

        {/* Colonna destra - Dettagli e Aste */}
        <div className="lg:col-span-2 space-y-6">
          <PersonalInfoForm
            userData={userData}
            formData={formData}
            isEditing={isEditing}
            onInputChange={handleInputChange}
          />

          <ChangePasswordForm />

          <UserAuctionsSection auctions={userData?.ownedAuctions || []} />
        </div>
      </div>
    </div>
  );
}
