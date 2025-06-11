import { createContext } from "react";

export interface ConfirmationDialogContextType {
    isOpen: boolean;
    onOpen: () => void;
    onOpenChange: (open: boolean) => void;
    options: {
        title?: string; // Title of the confirmation dialog
        message?: string; // Message to display in the dialog
        confirmText?: string; // Text for the confirmation button
        cancelText?: string; // Text for the cancel button
        onConfirm?: () => Promise<void>; // Callback when confirm is clicked
        onCancel?: () => Promise<void>; // Callback when cancel is clicked
    };
    setOptions: (options: ConfirmationDialogContextType["options"]) => void;
}

export const ConfirmationDialogContext = createContext<
    ConfirmationDialogContextType | undefined
>(undefined);
