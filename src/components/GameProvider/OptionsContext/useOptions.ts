import { useContext } from "react";

import { OptionsContext } from "./OptionsContext";

export const useOptions = () => {
    const context = useContext(OptionsContext);
    if (!context) {
        throw new Error("useOptions must be used within a OptionsProvider");
    }
    return context;
};
