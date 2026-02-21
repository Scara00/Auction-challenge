
import apiClient from "..";

export const loginAPICall = async (
    params: any
) => {
    const { data } = await apiClient.post("/auth/login", params)
    return data
};

export const logOutAPICall = async (
    params: any
) => {
    const { data } = await apiClient.post("/auth/logout", params)
    return data
};

