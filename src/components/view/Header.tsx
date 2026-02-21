import { useState } from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { useAuthStore } from "@/store/useAuthStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Search, User, LogOut, Settings, Gavel } from "lucide-react";
import { logOutAPICall } from "@/api/services/AuthServiceApi";

export default function Header() {
  const { isAuthenticated, user, logout, refreshToken } = useAuthStore();
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleLogout = async () => {
    try {
      const result = await logOutAPICall({ refreshToken });

      console.log(result);
    } catch (error) {
      console.log(error);
    } finally {
      sessionStorage.removeItem("accessToken");

      navigate("/login");
      // Esempio di setUser dopo login riuscito
    }
  };

  const getInitials = (name?: string) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-slate-500 shadow sticky top-0 z-50">
        <nav className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between gap-4">
            {/* Logo */}
            <Link to="/home" className="flex items-center">
              <img
                src="/LOGO_ICB_BIANCO_ORIZZONTALE.png"
                alt="ICB Auctions"
                className="h-10 w-auto"
              />
            </Link>

            {/* Barra di ricerca */}
            <form onSubmit={handleSearch} className="flex-1 max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Cerca aste..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 w-full bg-white"
                />
              </div>
            </form>

            {/* Menu Profilo */}
            <div className="flex items-center gap-4">
              {isAuthenticated && (
                <Link to="/auctions/create">
                  <Button variant="secondary">Crea Asta</Button>
                </Link>
              )}

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="relative h-10 w-10 rounded-full">
                    <Avatar className="h-10 w-10 cursor-pointer">
                      <AvatarImage src={user?.profileImage} alt={user?.name} />
                      <AvatarFallback className="bg-white">
                        {isAuthenticated ? (
                          getInitials(user?.name)
                        ) : (
                          <User className="h-5 w-5" />
                        )}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>

                <DropdownMenuContent align="end" className="w-56">
                  {isAuthenticated ? (
                    <>
                      {/* Info utente */}
                      <div className="px-2 py-2">
                        <p className="font-medium">{user?.name}</p>
                        <p className="text-sm text-gray-500">{user?.email}</p>
                      </div>
                      <DropdownMenuSeparator />

                      <DropdownMenuItem asChild>
                        <Link to="/profile" className="cursor-pointer">
                          <User className="mr-2 h-4 w-4" />
                          Il mio Profilo
                        </Link>
                      </DropdownMenuItem>

                      <DropdownMenuItem asChild>
                        <Link to="/profile/edit" className="cursor-pointer">
                          <Settings className="mr-2 h-4 w-4" />
                          Modifica Profilo
                        </Link>
                      </DropdownMenuItem>

                      <DropdownMenuItem asChild>
                        <Link to="/my-auctions" className="cursor-pointer">
                          <Gavel className="mr-2 h-4 w-4" />
                          Le mie Aste
                        </Link>
                      </DropdownMenuItem>

                      <DropdownMenuSeparator />

                      <DropdownMenuItem
                        onClick={handleLogout}
                        className="cursor-pointer text-red-600">
                        <LogOut className="mr-2 h-4 w-4" />
                        Logout
                      </DropdownMenuItem>
                    </>
                  ) : (
                    <>
                      <DropdownMenuItem asChild>
                        <Link to="/login" className="cursor-pointer">
                          <User className="mr-2 h-4 w-4" />
                          Accedi
                        </Link>
                      </DropdownMenuItem>

                      <DropdownMenuItem asChild>
                        <Link to="/register" className="cursor-pointer">
                          <Settings className="mr-2 h-4 w-4" />
                          Registrati
                        </Link>
                      </DropdownMenuItem>
                    </>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </nav>
      </header>

      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  );
}
