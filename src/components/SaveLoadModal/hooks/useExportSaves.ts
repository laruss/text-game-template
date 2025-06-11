import { getAllSaves } from "@app/db";
import { SAFE_FILE_EXTENSION } from "@components/SaveLoadModal/constants";
import { encodeSf } from "@components/SaveLoadModal/helpers";
import { options } from "@game/options";
import { addToast } from "@heroui/react";
import { useCallback } from "react";

export const useExportSaves = () => {
    return useCallback(async () => {
        try {
            const allSaves = await getAllSaves();
            if (allSaves.length === 0) {
                addToast({
                    title: "No saves found",
                    description: "There are no game saves available to export.",
                });
                return;
            }
            const data = encodeSf(allSaves);
            const blob = new Blob([data], { type: "application/octet-stream" });
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `${options.gameName}-${options.gameVersion}${SAFE_FILE_EXTENSION}`;
            a.click();
            a.remove();
            URL.revokeObjectURL(url);
            addToast({
                title: "Saves exported",
                description: "Your game saves have been successfully exported.",
            });
        } catch (e) {
            addToast({
                title: "An error occurred",
                description: "Please, check the console for more details.",
            });
            console.error("Failed to export saves:", e);
        }
    }, []);
};
