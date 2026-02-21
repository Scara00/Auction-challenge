import { useAuthStore } from "@/store/useAuthStore";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export default function UserDetailPage() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <h1 className="text-3xl font-bold mb-6">Profilo Utente</h1>

      <div className="bg-white shadow rounded-lg p-6 space-y-4">
        <div>
          <label className="text-sm font-medium text-gray-500">Nome</label>
          <p className="text-lg">{user?.name || "N/A"}</p>
        </div>

        <div>
          <label className="text-sm font-medium text-gray-500">Email</label>
          <p className="text-lg">{user?.email || "N/A"}</p>
        </div>

        <div>
          <label className="text-sm font-medium text-gray-500">ID Utente</label>
          <p className="text-lg font-mono">{user?.id || "N/A"}</p>
        </div>

        <div className="pt-4 border-t">
          <h2 className="text-xl font-semibold mb-4">Le tue aste</h2>
          <p className="text-gray-500">Nessuna asta attiva al momento.</p>
        </div>

        <div className="pt-4">
          <Button onClick={handleLogout} variant="outline" className="w-full">
            Logout
          </Button>
        </div>
      </div>
    </div>
  );
}
