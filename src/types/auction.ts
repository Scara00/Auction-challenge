export interface BidResponse {
  id: string;
  amount: number;
  createdAt: string;
  userId: string;
}

export interface BidDetailResponse {
  id: string;
  amount: number;
  createdAt: string;
  auctionId: string;
  userId: string;
}

export interface BidInAuctionResponse {
  id: string;
  amount: number;
  createdAt: string;
  userId: string;
  user?: {
    id: string;
    name: string;
    profileImage?: string;
  };
}

export interface AuctionImageResponse {
  auctionId: string;
  imageId: string;
}

export interface WinningBidResponse {
  auctionId: string;
  bidId: string;
  bid: BidDetailResponse;
}

export interface AuctionCount {
  auctionFavorites: number;
}

export interface AuctionResponse {
  id: string;
  title: string;
  description: string;
  startingPrice: number;
  startDate: string;
  endDate: string;
  status: "ACTIVE" | "INACTIVE";
  ownerId: string;
  categoryId: string;
  createdAt: string;
  updatedAt: string;
  bids: BidInAuctionResponse[];
  winningBid: WinningBidResponse | null;
  auctionImages: AuctionImageResponse[];
  _count: AuctionCount;
}