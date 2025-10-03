import { loadGame } from "@app/db";
import { useGameIsStarted } from "@app/hooks/useGameIsStarted";
import { useConfirmation } from "@components/ConfiramtionDialog";
import { useSaveLoadModalState } from "@components/SaveLoadModal";
import { Game } from "@engine/game";
import { addToast } from "@heroui/react";
import { useCallback } from "react";

export const useLoadGame = (id?: number) => {
    const isGameStarted = useGameIsStarted();
    const { onOpenChange } = useSaveLoadModalState();

    const loadGameHandler = useCallback(async () => {
        if (!id) return;

        try {
            const data = await loadGame(id);
            if (!data) {
                addToast({
                    title: "Game not found",
                    description: "The requested game save does not exist.",
                });
                return;
            }
            Game.setState(data.gameData);
            onOpenChange(false);
        } catch (e) {
            addToast({
                title: "An error occurred",
                description: "Please, check the console for more details.",
            });
            console.error("Failed to load game:", e);
        }
    }, [id, onOpenChange]);

    const confirmLoad = useConfirmation({
        title: "Load Game",
        message:
            "Are you sure you want to load this game? This will overwrite your current progress.",
        confirmText: "Yes",
        cancelText: "No",
        onConfirm: loadGameHandler,
    });

    return useCallback(async () => {
        if (isGameStarted) {
            confirmLoad();
        } else {
            await loadGameHandler();
        }
    }, [confirmLoad, isGameStarted, loadGameHandler]);
};
