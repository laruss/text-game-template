import "./index.css";
import "@game/maps";
import "@game/stories";

import { ConfirmationDialogProvider } from "@components/ConfiramtionDialog";
import { GameProvider } from "@components/GameProvider";
import { SaveLoadModalProvider } from "@components/SaveLoadModal";
import { HeroUIProvider, ToastProvider } from "@heroui/react";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import { App } from "./App";

createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <GameProvider>
            <HeroUIProvider>
                <ToastProvider placement="top-center" toastOffset={60} />
                <ConfirmationDialogProvider>
                    <SaveLoadModalProvider>
                        <App />
                    </SaveLoadModalProvider>
                </ConfirmationDialogProvider>
            </HeroUIProvider>
        </GameProvider>
    </StrictMode>
);
