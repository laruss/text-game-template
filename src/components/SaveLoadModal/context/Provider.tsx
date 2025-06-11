import { ReactNode, useState } from "react";

import { SaveLoadModalContext, SaveLoadModalContextType } from "./Context";

interface SaveLoadModalProviderProps {
    children: ReactNode;
}

export const SaveLoadModalProvider = ({
    children,
}: SaveLoadModalProviderProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const [isOnlyLoad, setIsOnlyLoad] = useState(false);

    const onOpen: SaveLoadModalContextType["onOpen"] = (props) => {
        setIsOpen(true);
        setIsOnlyLoad(props?.isOnlyLoad ?? false);
    };

    return (
        <SaveLoadModalContext.Provider
            value={{
                isOpen,
                onOpen,
                onOpenChange: (open: boolean) => setIsOpen(open),
                options: { isOnlyLoad },
            }}
        >
            {children}
        </SaveLoadModalContext.Provider>
    );
};
