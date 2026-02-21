import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { RegisterForm } from "@/components/view/registerForm";

import { Gavel } from "lucide-react";
import { registerUserAPICall } from "@/api/services/UserServiceApi";

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
  }: {
    email: string;
    password: string;
    name: string;
    surname: string;
    phone: string;
  }) => {
    try {
      setError(null);
      setIsLoading(true);
      await registerUserAPICall({ email, password, name, surname, phone });
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
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex flex-1 items-center justify-center">
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
      <div className="bg-black flex flex-col gap-4 items-center justify-center">
        <Gavel className="h-12 w-12" color="white" />
        <img
          src="/LOGO_ICB_BIANCO_ORIZZONTALE.png"
          alt="ICB Auctions"
          className="h-30 w-auto mb-6"
        />
      </div>
    </div>
  );
}
