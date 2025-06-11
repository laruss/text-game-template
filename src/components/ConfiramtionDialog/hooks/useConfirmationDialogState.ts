import { useContext } from "react";

import { ConfirmationDialogContext } from "../context";

export const useConfirmationDialogState = () => {
    const context = useContext(ConfirmationDialogContext);
    if (context === undefined) {
        throw new Error(
            "useConfirmationDialogState must be used within a ConfirmationDialogProvider"
        );
    }
    return context;
};
