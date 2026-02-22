import apiClient from "..";

export const getAuctions = async (params: any) => {
    const { data } = await apiClient.post("/auction/list", params, {
        headers: {
            Authorization: `Bearer ${sessionStorage.getItem("accessToken")}`,
        },
    }
    );
    return data;
};

export const getAuctionById = async (id: string) => {
    const { data } = await apiClient.get(`/auction/${id}`, {
        headers: {
            Authorization: `Bearer ${sessionStorage.getItem("accessToken")}`,
        },
    });
    return data;
};
export const setAuctionFavourite = async (id: string) => {
    const { data } = await apiClient.put(`/auction/${id}/favorite`, {}, {
        headers: {
            Authorization: `Bearer ${sessionStorage.getItem("accessToken")}`,
        },
    });
    return data;
};

export const getAuctionsCategory = async () => {
    const { data } = await apiClient.get("/auction/category/list");
    return data;
};

export const createAuction = async (params: any) => {
    const { data } = await apiClient.post("/auction", params, {
        headers: {
            Authorization: `Bearer ${sessionStorage.getItem("accessToken")}`,
        },
    });
    return data;
};

export const deleteAuction = async (id: string) => {
    const { data } = await apiClient.delete(`/auction/${id}`, {
        headers: {
            Authorization: `Bearer ${sessionStorage.getItem("accessToken")}`,
        },
    });
    return data;
};

export const createAuctionBid = async (id: string, params: any) => {
    const { data } = await apiClient.post(`/auction/${id}/bid`, params, {
        headers: {
            Authorization: `Bearer ${sessionStorage.getItem("accessToken")}`,
        },
    });
    return data;
};
