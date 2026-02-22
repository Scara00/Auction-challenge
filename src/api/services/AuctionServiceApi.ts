import apiClient from "..";

export const getAuctions = async (params: any) => {
    const { data } = await apiClient.post("/auction/list", params);
    return data;
};

export const getAuctionById = async (id: string) => {
    const { data } = await apiClient.get(`/auction/${id}`);
    return data;
};
export const setAuctionFavourite = async (id: string) => {
    const { data } = await apiClient.put(`/auction/${id}/favorite`, {});
    return data;
};

export const getAuctionsCategory = async () => {
    const { data } = await apiClient.get("/auction/category/list");
    return data;
};

export const createAuction = async (params: any) => {
    const { data } = await apiClient.post("/auction", params);
    return data;
};

export const deleteAuction = async (id: string) => {
    const { data } = await apiClient.delete(`/auction/${id}`);
    return data;
};

export const createAuctionBid = async (id: string, params: any) => {
    const { data } = await apiClient.post(`/auction/${id}/bid`, params);
    return data;
};
