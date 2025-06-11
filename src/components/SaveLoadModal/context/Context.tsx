import { createContext } from "react";

export interface SaveLoadModalContextType {
    isOpen: boolean;
    onOpen: (props?: { isOnlyLoad?: boolean }) => void;
    onOpenChange: (open: boolean) => void;
    options: {
        isOnlyLoad?: boolean; // Only show load options
    };
}

export const SaveLoadModalContext = createContext<
    SaveLoadModalContextType | undefined
>(undefined);
