import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/store/useAuthStore";
import { LoginForm } from "@/components/view/loginForm";
import { loginAPICall } from "@/api/services/AuthServiceApi";
import { Gavel } from "lucide-react";
import { GetLoggedUser } from "@/api/services/UserServiceApi";

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
      console.log(result);
    } catch (error) {
      console.log(error);
    } finally {
      navigate("/home");
      const userData = await GetLoggedUser();

      setUser(userData);

      // Esempio di setUser dopo login riuscito
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
      <div className=" bg-black flex flex-col gap-4 items-center justify-center">
        <Gavel className="h-12 w-12 " color="white" />
        <img
          src="/LOGO_ICB_BIANCO_ORIZZONTALE.png"
          alt="ICB Auctions"
          className="h-30 w-auto mb-6"
        />

        {/* <img
          src="/placeholder.svg"
          alt="Image"
          className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
        /> */}
      </div>
    </div>
  );
}
