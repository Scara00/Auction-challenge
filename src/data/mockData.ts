export interface Auction {
    id: string;
    title: string;
    image: string;
    currentBid: number;
    category: string;
    favoritesCount: number;
    createdAt: string;
}

export interface Category {
    id: string;
    name: string;
    icon: string;
    auctionsCount: number;
}

// Mock data per le aste
export const mockAuctions: Auction[] = [
    {
        id: "1",
        title: "iPhone 15 Pro Max 256GB - Nuovo Sigillato",
        image: "https://picsum.photos/seed/iphone/400/400",
        currentBid: 899.99,
        category: "Elettronica",
        favoritesCount: 45,
        createdAt: "2026-02-19T10:00:00Z",
    },
    {
        id: "2",
        title: "Rolex Submariner Date - Edizione Limitata",
        image: "https://picsum.photos/seed/rolex/400/400",
        currentBid: 12500.0,
        category: "Orologi",
        favoritesCount: 128,
        createdAt: "2026-02-19T09:30:00Z",
    },
    {
        id: "3",
        title: "Quadro Olio su Tela - Paesaggio Toscano",
        image: "https://picsum.photos/seed/painting/400/400",
        currentBid: 450.0,
        category: "Arte",
        favoritesCount: 23,
        createdAt: "2026-02-19T09:00:00Z",
    },
    {
        id: "4",
        title: "MacBook Pro 14\" M3 Pro - Come Nuovo",
        image: "https://picsum.photos/seed/macbook/400/400",
        currentBid: 1850.0,
        category: "Elettronica",
        favoritesCount: 67,
        createdAt: "2026-02-19T08:45:00Z",
    },
    {
        id: "5",
        title: "Collezione Vinili Jazz Anni '60 - 50 Dischi",
        image: "https://picsum.photos/seed/vinyl/400/400",
        currentBid: 320.0,
        category: "Musica",
        favoritesCount: 34,
        createdAt: "2026-02-19T08:30:00Z",
    },
    {
        id: "6",
        title: "Borsa Louis Vuitton Neverfull MM",
        image: "https://picsum.photos/seed/lv/400/400",
        currentBid: 980.0,
        category: "Moda",
        favoritesCount: 89,
        createdAt: "2026-02-19T08:00:00Z",
    },
    {
        id: "7",
        title: "PlayStation 5 + 10 Giochi - Bundle Completo",
        image: "https://picsum.photos/seed/ps5/400/400",
        currentBid: 550.0,
        category: "Videogiochi",
        favoritesCount: 112,
        createdAt: "2026-02-19T07:30:00Z",
    },
    {
        id: "8",
        title: "Bicicletta Bianchi Specialissima - Carbonio",
        image: "https://picsum.photos/seed/bike/400/400",
        currentBid: 3200.0,
        category: "Sport",
        favoritesCount: 28,
        createdAt: "2026-02-19T07:00:00Z",
    },
    {
        id: "9",
        title: "Anello Diamante 1.5 Carati - Certificato GIA",
        image: "https://picsum.photos/seed/diamond/400/400",
        currentBid: 8500.0,
        category: "Gioielli",
        favoritesCount: 56,
        createdAt: "2026-02-19T06:30:00Z",
    },
    {
        id: "10",
        title: "Divano in Pelle Italiana - Design Moderno",
        image: "https://picsum.photos/seed/sofa/400/400",
        currentBid: 1200.0,
        category: "Casa",
        favoritesCount: 41,
        createdAt: "2026-02-19T06:00:00Z",
    },
];

// Mock data per le categorie
export const mockCategories: Category[] = [
    { id: "1", name: "Elettronica", icon: "💻", auctionsCount: 156 },
    { id: "2", name: "Orologi", icon: "⌚", auctionsCount: 89 },
    { id: "3", name: "Arte", icon: "🎨", auctionsCount: 67 },
    { id: "4", name: "Moda", icon: "👗", auctionsCount: 234 },
    { id: "5", name: "Musica", icon: "🎵", auctionsCount: 45 },
    { id: "6", name: "Videogiochi", icon: "🎮", auctionsCount: 178 },
    { id: "7", name: "Sport", icon: "⚽", auctionsCount: 92 },
    { id: "8", name: "Gioielli", icon: "💎", auctionsCount: 134 },
    { id: "9", name: "Casa", icon: "🏠", auctionsCount: 76 },
    { id: "10", name: "Libri", icon: "📚", auctionsCount: 58 },
    { id: "11", name: "Auto e Moto", icon: "🚗", auctionsCount: 43 },
    { id: "12", name: "Collezionismo", icon: "🏆", auctionsCount: 112 },
];

// Mock data per i preferiti dell'utente
export const mockFavorites: Auction[] = [
    {
        id: "2",
        title: "Rolex Submariner Date - Edizione Limitata",
        image: "https://picsum.photos/seed/rolex/400/400",
        currentBid: 12500.0,
        category: "Orologi",
        favoritesCount: 128,
        createdAt: "2026-02-19T09:30:00Z",
    },
    {
        id: "7",
        title: "PlayStation 5 + 10 Giochi - Bundle Completo",
        image: "https://picsum.photos/seed/ps5/400/400",
        currentBid: 550.0,
        category: "Videogiochi",
        favoritesCount: 112,
        createdAt: "2026-02-19T07:30:00Z",
    },
    {
        id: "6",
        title: "Borsa Louis Vuitton Neverfull MM",
        image: "https://picsum.photos/seed/lv/400/400",
        currentBid: 980.0,
        category: "Moda",
        favoritesCount: 89,
        createdAt: "2026-02-19T08:00:00Z",
    },
    {
        id: "4",
        title: "MacBook Pro 14\" M3 Pro - Come Nuovo",
        image: "https://picsum.photos/seed/macbook/400/400",
        currentBid: 1850.0,
        category: "Elettronica",
        favoritesCount: 67,
        createdAt: "2026-02-19T08:45:00Z",
    },
    {
        id: "9",
        title: "Anello Diamante 1.5 Carati - Certificato GIA",
        image: "https://picsum.photos/seed/diamond/400/400",
        currentBid: 8500.0,
        category: "Gioielli",
        favoritesCount: 56,
        createdAt: "2026-02-19T06:30:00Z",
    },
];