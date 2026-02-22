import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import "./App.css";
import { Toaster } from "@/components/ui/sonner";
import PublicLayout from "./components/PublicLayout";
import ProtectedRoute from "./components/ProtectedRoute";
import Login from "./pages/Login";
import Register from "./pages/Register";
import AuctionSearch from "./pages/AuctionSearch";
import AuctionDetail from "./pages/AuctionDetail";
import AuctionCreate from "./pages/AuctionCreate";
import UserDetailPage from "./pages/UserDetailPage";
import UserProfilePage from "./pages/UserProfilePage";
import LatestAuctionsPage from "./pages/LatestAuctionsPage";
import Homepage from "./pages/homepage";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          {/* Route pubbliche senza header */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Route pubbliche con header */}
          <Route path="/" element={<PublicLayout />}>
            <Route index element={<Navigate to="/home" replace />} />
            <Route path="home" element={<Homepage />} />
            <Route path="search" element={<AuctionSearch />} />
            <Route path="auctions/:id" element={<AuctionDetail />} />
            <Route path="user/:userId" element={<UserProfilePage />} />
            <Route path="auctions/latest" element={<LatestAuctionsPage />} />

            {/* Route protette - richiedono autenticazione */}
            <Route
              path="auctions/create"
              element={
                <ProtectedRoute>
                  <AuctionCreate />
                </ProtectedRoute>
              }
            />
            <Route
              path="profile"
              element={
                <ProtectedRoute>
                  <UserDetailPage />
                </ProtectedRoute>
              }
            />
          </Route>

          {/* Redirect per route non trovate */}
          <Route path="*" element={<Navigate to="/home" replace />} />
        </Routes>
      </BrowserRouter>
      <Toaster />
    </>
  );
}

export default App;
