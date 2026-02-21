import apiClient from "..";

export const GetLoggedUser = async (
    params?: any
) => {
    const { data } = await apiClient.get("/user/me", {
        params,
        headers: {
            Authorization: `Bearer ${sessionStorage.getItem('accessToken')}`
        }
    })
    return data
};