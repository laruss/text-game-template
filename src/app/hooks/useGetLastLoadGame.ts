import { db, type GameSave, loadGame } from "@app/db";
import { Game } from "@engine/game";
import { addToast } from "@heroui/react";
import { useLiveQuery } from "dexie-react-hooks";
import { useCallback } from "react";

const getLastSave = async (): Promise<GameSave | null> => {
    const save = await db.saves
        .filter((save) => !save.isSystemSave)
        .reverse()
        .sortBy("timestamp");
    return save[0] ?? null;
};

export const useGetLastLoadGame = () => {
    const lastSave = useLiveQuery(getLastSave, [], null);

    const loadLastGame = useCallback(async () => {
        if (!lastSave?.id) return;

        try {
            const data = await loadGame(lastSave.id);
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
    }, [lastSave?.id]);

    return {
        hasLastSave: !!lastSave,
        loadLastGame,
        isLoading: lastSave === undefined,
        lastSave: lastSave ?? null,
    };
};
