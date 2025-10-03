import { useCallback, useContext } from "react";

import {
    ConfirmationDialogContext,
    ConfirmationDialogContextType,
} from "../context";

export const useConfirmation = (
    options: ConfirmationDialogContextType["options"] = {
        title: "Are you sure?",
        message: "This action cannot be undone.",
        confirmText: "Confirm",
        cancelText: "Cancel",
        onConfirm: async () => {},
        onCancel: async () => {},
    }
) => {
    const context = useContext(ConfirmationDialogContext);
    if (context === undefined) {
        throw new Error(
            "useConfirmation must be used within a ConfirmationDialogProvider"
        );
    }

    return useCallback(() => {
        context.setOptions(options);
        context.onOpen();
    }, [context, options]);
};
