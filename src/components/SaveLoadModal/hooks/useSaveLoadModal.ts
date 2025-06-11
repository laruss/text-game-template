import { useContext } from "react";

import { SaveLoadModalContext } from "../context";

export const useSaveLoadModal = () => {
    const context = useContext(SaveLoadModalContext);
    if (context === undefined) {
        throw new Error(
            "useSaveLoadModal must be used within a SaveLoadModalProvider"
        );
    }
    return context.onOpen;
};
