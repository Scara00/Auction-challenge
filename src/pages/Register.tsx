import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { RegisterForm } from "@/components/view/registerForm";
import { registerUserAPICall } from "@/api/services/UserServiceApi";
import { uploadMediaPublic } from "@/api/services/MediaServiceApi";
import AuthSidebar from "@/components/view/AuthSidebar";

export default function Register() {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleRegister = async ({
    email,
    password,
    name,
    surname,
    phone,
    profileImage,
  }: {
    email: string;
    password: string;
    name: string;
    surname: string;
    phone: string;
    profileImage?: File;
  }) => {
    try {
      setError(null);
      setIsLoading(true);

      let profilePictureId: string | undefined;

      // Se c'è un'immagine, la carica prima
      if (profileImage) {
        const uploadResult = await uploadMediaPublic(profileImage);
        profilePictureId = uploadResult.id;
      }

      await registerUserAPICall({
        email,
        password,
        name,
        surname,
        phone,
        profilePictureId,
      });
      // Dopo la registrazione, reindirizza al login
      navigate("/login");
    } catch (error: any) {
      console.error("Errore durante la registrazione:", error);
      setError(
        error?.response?.data?.message ||
          "Errore durante la registrazione. Riprova.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-4 md:p-10">
        <div className="flex flex-1 items-center justify-center py-4 md:py-0">
          <div className="w-full max-w-md">
            {error && (
              <div className="mb-4 text-sm text-red-500 text-center bg-red-50 p-3 rounded">
                {error}
              </div>
            )}
            <RegisterForm
              onClickRegister={handleRegister}
              isLoading={isLoading}
            />
          </div>
        </div>
      </div>
      <AuthSidebar />
    </div>
  );
}
