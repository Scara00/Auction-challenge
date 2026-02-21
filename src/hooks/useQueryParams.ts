import { useSearchParams } from "react-router-dom";



export const useQueryParams = () => {
    const [searchParams, setSearchParams] = useSearchParams();

    const getParam = (key: string): string | null => {
        return searchParams.get(key);
    };

    const getAllParams = (): Record<string, string> => {
        const params: Record<string, string> = {};
        searchParams.forEach((value, key) => {
            params[key] = value;
        });
        return params;
    };

    const setParam = (key: string, value: string) => {
        const newParams = new URLSearchParams(searchParams);
        newParams.set(key, value);
        setSearchParams(newParams);
    };

    const removeParam = (key: string) => {
        const newParams = new URLSearchParams(searchParams);
        newParams.delete(key);
        setSearchParams(newParams);
    };

    return { getParam, getAllParams, setParam, removeParam, searchParams };
};