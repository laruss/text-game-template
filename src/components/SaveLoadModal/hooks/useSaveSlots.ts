import { GameSave, getAllSaves } from "@app/db";
import { useQuery } from "@tanstack/react-query";

export const useSaveSlots = () => {
    const query = useQuery<GameSave[]>({
        queryKey: ["saves"],
        queryFn: getAllSaves,
        refetchOnWindowFocus: false,
        refetchOnMount: false,
        refetchOnReconnect: false,
    });

    return {
        ...query,
        isEmpty: query.data?.length === 0,
        isLoading: query.isLoading,
        isError: query.isError,
        error: query.error,
        data: query.data || [],
    };
};
