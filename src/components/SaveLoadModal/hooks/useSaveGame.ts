import { loadGameByName, saveGame } from "@app/db";
import { useConfirmation } from "@components/ConfiramtionDialog";
import { Game } from "@engine/game";
import { addToast } from "@heroui/react";
import { useQueryClient } from "@tanstack/react-query";
import { useCallback } from "react";

export const useSaveGame = (slotNumber: number) => {
    const queryClient = useQueryClient();

    const saveGameHandler = useCallback(() => {
        const data = Game.getState();
        saveGame(`${slotNumber}`, data).then(() => {
            queryClient.invalidateQueries({ queryKey: ["saves"] });
        }).catch((e) => {
            addToast({
                title: "An error occurred",
                description: "Please, check the console for more details.",
            });
            console.error("Failed to save game:", e);
        });
    }, [queryClient, slotNumber]);

    const confirmSave = useConfirmation({
        title: "Rewrite save",
        message: "Are you sure you want to overwrite this save? This action cannot be undone.",
        confirmText: "Yes",
        cancelText: "No",
        onConfirm: async () => saveGameHandler(),
    });

    return useCallback(async () => {
        const slotSave = await loadGameByName(`${slotNumber}`);
        if (slotSave) {
            confirmSave();
        } else {
            saveGameHandler();
        }
    }, [confirmSave, saveGameHandler, slotNumber]);
};
