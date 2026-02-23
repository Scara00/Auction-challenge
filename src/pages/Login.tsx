import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/store/useAuthStore";
import { LoginForm } from "@/components/view/loginForm";
import { loginAPICall } from "@/api/services/AuthServiceApi";
import { GetLoggedUser } from "@/api/services/UserServiceApi";
import AuthSidebar from "@/components/view/AuthSidebar";

export default function Login() {
  const navigate = useNavigate();
  const { setTokens, setUser } = useAuthStore();

  const handleLogin = async ({
    email,
    password,
  }: {
    email: string;
    password: string;
  }) => {
    try {
      const result = await loginAPICall({ username: email, password });
      sessionStorage.setItem("accessToken", result.accessToken);
      setTokens(result.accessToken, result.refreshToken);

      // Carica i dati utente dopo il login
      const userData = await GetLoggedUser();
      setUser(userData);

      // Naviga alla home solo dopo aver caricato i dati
      navigate("/home");
    } catch (error) {
      console.error("Errore durante il login:", error);
    }
  };

  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs">
            <LoginForm onClickLogin={handleLogin} />
          </div>
        </div>
      </div>
      <AuthSidebar />
    </div>
  );
}
