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

export const updateUser = async (
    userData: {
        name?: string;
        surname?: string;
        phone?: string;
        description?: string;
        profilePictureId?: string;
    }
) => {
    const { data } = await apiClient.put("/user", userData, {
        headers: {
            Authorization: `Bearer ${sessionStorage.getItem('accessToken')}`
        }
    });
    return data;
};


export const registerUserAPICall = async (
    params: {
        email: string;
        password: string;
        name: string;
        surname: string;
        phone: string;
    }
) => {
    const { data } = await apiClient.post("/user", params)
    return data
};
