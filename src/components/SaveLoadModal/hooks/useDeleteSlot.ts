import { deleteSave } from "@app/db";
import { useConfirmation } from "@components/ConfiramtionDialog";
import { addToast } from "@heroui/react";

export const useDeleteSlot = (id?: number) => {
    return useConfirmation({
        title: "Delete Save",
        message:
            "Are you sure you want to delete this save? This action cannot be undone.",
        confirmText: "Yes",
        cancelText: "No",
        onConfirm: async () => {
            if (!id) return;

            try {
                await deleteSave(id);
            } catch (e) {
                addToast({
                    title: "An error occurred",
                    description: "Please, check the console for more details.",
                });
                console.error("Failed to delete save:", e);
            }
        },
    });
};
