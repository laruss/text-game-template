import { deleteAllGameSaves, GameSave, saveGame } from "@app/db";
import { SAFE_FILE_EXTENSION } from "@components/SaveLoadModal/constants";
import { decodeSf } from "@components/SaveLoadModal/helpers";
import { addToast } from "@heroui/react";
import { useCallback } from "react";

export const useImportSaves = () => {
    return useCallback(async () => {
        try {
            // Create a file input element
            const input = document.createElement("input");
            input.type = "file";
            input.accept = SAFE_FILE_EXTENSION;
            input.multiple = false;

            // Return a promise that resolves when file is selected
            const file = await new Promise<File | null>((resolve) => {
                input.onchange = (event) => {
                    const target = event.target as HTMLInputElement;
                    const selectedFile = target.files?.[0] || null;
                    resolve(selectedFile);
                };

                input.oncancel = () => {
                    resolve(null);
                };

                // Trigger file explorer
                input.click();
            });

            // If no file selected, exit silently
            if (!file) {
                return;
            }

            // Validate file extension
            if (!file.name.endsWith(SAFE_FILE_EXTENSION)) {
                addToast({
                    title: "Invalid file type",
                    description: `Please select a file with ${SAFE_FILE_EXTENSION} extension.`,
                });
                return;
            }

            // Read file as ArrayBuffer
            const arrayBuffer = await file.arrayBuffer();

            // Decode the saves data
            const saves = decodeSf<GameSave[]>(arrayBuffer);

            // Validate that decoded data is an array
            if (!Array.isArray(saves)) {
                throw new Error("Invalid save file format");
            }

            // Delete all existing saves
            await deleteAllGameSaves();

            // Import each save
            for (const save of saves) {
                await saveGame(
                    save.name,
                    save.gameData,
                    save.description,
                    save.screenshot
                );
            }

            // Notify user of successful import
            addToast({
                title: "Saves imported",
                description: `Successfully imported ${saves.length} save${saves.length !== 1 ? "s" : ""}.`,
            });
        } catch (error) {
            // Log error for debugging
            console.error("Failed to import saves:", error);

            // Notify user of error
            addToast({
                title: "Import failed",
                description:
                    "Failed to import saves. Please check the console for more details.",
            });
        }
    }, []);
};
