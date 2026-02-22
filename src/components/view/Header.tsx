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
import { Search, User, LogOut, Settings, Heart, X } from "lucide-react";
import { logOutAPICall } from "@/api/services/AuthServiceApi";

export default function Header() {
  const { isAuthenticated, user, refreshToken } = useAuthStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setMobileSearchOpen(false);
      setSearchQuery("");
    }
  };

  const handleMobileSearchClick = () => {
    setMobileSearchOpen(true);
  };

  const handleLogout = async () => {
    try {
      await logOutAPICall({ refreshToken });
    } catch (error) {
      console.log(error);
    } finally {
      // Pulisce lo store e localStorage
      useAuthStore.getState().logout();
      localStorage.removeItem("auth-storage");
      sessionStorage.removeItem("accessToken");

      navigate("/login");
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
      <header className="bg-black shadow sticky top-0 z-50">
        <nav className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between gap-4">
            {/* Logo */}
            <Link to="/home" className="flex items-center shrink-0">
              <img
                src="/LOGO_ICB_BIANCO_ORIZZONTALE.png"
                alt="ICB Auctions"
                className="h-8 md:h-10 w-auto"
              />
            </Link>

            {/* Barra di ricerca - Desktop */}
            <form
              onSubmit={handleSearch}
              className="hidden md:block flex-1 max-w-md">
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
            <div className="flex items-center gap-2 md:gap-4">
              {/* Icona ricerca - Mobile */}
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden text-white hover:text-gray-300"
                onClick={handleMobileSearchClick}>
                <Search className="h-5 w-5" />
              </Button>

              {isAuthenticated && (
                <>
                  <Link to="/search?favorites=true">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-white hover:text-red-400">
                      <Heart className="h-5 w-5" />
                    </Button>
                  </Link>
                  <Link to="/auctions/create" className="hidden sm:block">
                    <Button variant="secondary">Crea Asta</Button>
                  </Link>
                </>
              )}

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="relative h-10 w-10 rounded-full">
                    <Avatar className="h-10 w-10 cursor-pointer border-2 border-white">
                      {isAuthenticated && user?.profilePictureId ? (
                        <AvatarImage
                          src={`https://api-challenge.icib.dev/media/${user.profilePictureId}`}
                          alt={user?.name}
                        />
                      ) : null}
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

          {/* Barra di ricerca mobile - espandibile */}
          {mobileSearchOpen && (
            <div className="md:hidden mt-4">
              <form onSubmit={handleSearch} className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Cerca aste..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-10 w-full bg-white"
                  autoFocus
                />
                <button
                  type="button"
                  onClick={() => setMobileSearchOpen(false)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  <X className="h-4 w-4" />
                </button>
              </form>
            </div>
          )}
        </nav>
      </header>

      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  );
}
