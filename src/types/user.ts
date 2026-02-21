import type { AuctionResponse } from "./auction";

export type UserStatus = "ACTIVE" | "INACTIVE";

export interface UserResponse {
    id: string;
    name: string;
    surname: string;
    email: string;
    phone: string;
    description: string;
    profilePictureId: string;
    status: UserStatus;
    createdAt: string;
    updatedAt: string;
    ownedAuctions: AuctionResponse[];
}

export interface UserUpdateRequest {
    name?: string;
    surname?: string;
    email?: string;
    phone?: string;
    description?: string;
    profilePictureId?: string;
}

export interface UserProfileResponse {
    id: string;
    name: string;
    surname: string;
    email: string;
    phone: string;
    description: string;
    profilePictureId: string;
    status: UserStatus;
    createdAt: string;
    updatedAt: string;
}
