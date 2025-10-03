import { getSystemSave } from "@app/db";
import { SYSTEM_PASSAGE_NAMES } from "@engine/constants";
import { Game } from "@engine/game";
import { useCallback } from "react";

export const useRestartGame = () => {
    return useCallback(async () => {
        try {
            const systemSave = await getSystemSave();

            if (!systemSave) {
                console.error("System save not found. Cannot restart game.");
                return;
            }

            // Clear auto-save from session storage
            Game.clearAutoSave();

            // Restore the initial game state
            Game.setState(systemSave.gameData);

            // Navigate to the start passage
            Game.jumpTo(SYSTEM_PASSAGE_NAMES.START);
        } catch (error) {
            console.error("Failed to restart game:", error);
        }
    }, []);
};
