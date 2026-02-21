import apiClient from "..";

export const uploadMedia = async (file: File): Promise<{ id: string }> => {
    const formData = new FormData();
    formData.append("file", file);

    const { data } = await apiClient.post("/media/upload", formData, {
        headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${sessionStorage.getItem("accessToken")}`,
        },
    });

    return data;
};

export const getMedia = async (fileId: string): Promise<{ id: string }> => {
    const { data } = await apiClient.get(`/media/${fileId}`, {
        headers: {
            "Content-Type": "image/*",
            Authorization: `Bearer ${sessionStorage.getItem("accessToken")}`,
        },
    });

    return data;
};