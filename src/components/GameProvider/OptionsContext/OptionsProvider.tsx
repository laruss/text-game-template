import { PropsWithChildren, useState } from "react";

import { DEFAULT_OPTIONS } from "./constants";
import { OptionsContext } from "./OptionsContext";

export const OptionsProvider = ({ children }: PropsWithChildren) => {
    const [isDevMode, setIsDevMode] = useState(DEFAULT_OPTIONS.isDevMode);

    return (
        <OptionsContext.Provider value={{ isDevMode, setIsDevMode }}>
            {children}
        </OptionsContext.Provider>
    );
};
