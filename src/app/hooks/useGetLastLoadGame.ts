import { db, type GameSave, loadGame } from "@app/db";
import { Game } from "@engine/game";
import { addToast } from "@heroui/react";
import { useQuery } from "@tanstack/react-query";
import { useCallback } from "react";

const getLastSave = async (): Promise<GameSave | null> => {
    const save = await db.saves
        .filter((save) => !save.isSystemSave)
        .reverse()
        .sortBy("timestamp");
    return save[0] ?? null;
};

export const useGetLastLoadGame = () => {
    const query = useQuery<GameSave | null>({
        queryKey: ["lastSave"],
        queryFn: getLastSave,
        refetchOnWindowFocus: false,
        refetchOnReconnect: false,
    });

    const loadLastGame = useCallback(async () => {
        if (!query.data?.id) return;

        try {
            const data = await loadGame(query.data.id);
            if (!data) {
                addToast({
                    title: "Game not found",
                    description: "The requested game save does not exist.",
                });
                return;
            }
            Game.setState(data.gameData);
        } catch (e) {
            addToast({
                title: "An error occurred",
                description: "Please, check the console for more details.",
            });
            console.error("Failed to load game:", e);
        }
    }, [query.data?.id]);

    return {
        hasLastSave: !!query.data,
        loadLastGame,
        isLoading: query.isLoading,
        lastSave: query.data,
    };
};
