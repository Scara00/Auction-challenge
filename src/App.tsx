import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import "./App.css";
import ProtectedLayout from "./components/ProtectedLayout";
import ProtectedRoute from "./components/ProtectedRoute";
import Login from "./pages/Login";
import Register from "./pages/Register";
import AuctionSearch from "./pages/AuctionSearch";
import AuctionDetail from "./pages/AuctionDetail";
import AuctionCreate from "./pages/AuctionCreate";
import UserDetailPage from "./pages/UserDetailPage";
import LatestAuctionsPage from "./pages/LatestAuctionsPage";
import Homepage from "./pages/homepage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Route pubbliche senza header */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Route protette con header */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <ProtectedLayout />
            </ProtectedRoute>
          }>
          <Route path="home" element={<Homepage />} />
          <Route path="search" element={<AuctionSearch />} />
          <Route path="auctions/:id" element={<AuctionDetail />} />
          <Route path="auctions/create" element={<AuctionCreate />} />
          <Route path="profile" element={<UserDetailPage />} />
          <Route path="auctions/latest" element={<LatestAuctionsPage />} />
        </Route>

        {/* Aggiungi queste route */}
        {/* <Route path="/" element={<HomePage />} /> */}

        {/* Redirect per route non trovate */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
