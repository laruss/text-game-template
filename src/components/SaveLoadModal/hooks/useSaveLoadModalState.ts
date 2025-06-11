import { useContext } from "react";

import { SaveLoadModalContext } from "../context";

export const useSaveLoadModalState = () => {
    const context = useContext(SaveLoadModalContext);
    if (context === undefined) {
        throw new Error(
            "useSaveLoadModalState must be used within a SaveLoadModalProvider"
        );
    }
    return context;
};
