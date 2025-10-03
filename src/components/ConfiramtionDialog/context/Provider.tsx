import { useDisclosure } from "@heroui/react";
import { ReactNode, useState } from "react";

import {
    ConfirmationDialogContext,
    ConfirmationDialogContextType,
} from "./Context";

interface ConfirmationDialogProviderProps {
    children: ReactNode;
}

export const ConfirmationDialogProvider = ({
    children,
}: ConfirmationDialogProviderProps) => {
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const [options, setOptions] = useState<
        ConfirmationDialogContextType["options"]
    >({});

    return (
        <ConfirmationDialogContext.Provider
            value={{
                isOpen,
                onOpen,
                onOpenChange,
                options,
                setOptions,
            }}
        >
            {children}
        </ConfirmationDialogContext.Provider>
    );
};
