import "./index.css";
import "@game/maps";
import "@game/stories";

import { ConfirmationDialogProvider } from "@components/ConfiramtionDialog";
import { SaveLoadModalProvider } from "@components/SaveLoadModal";
import { Game } from "@engine/game";
import { HeroUIProvider, ToastProvider } from "@heroui/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import { App } from "./App";

const queryClient = new QueryClient();

Game.setCurrent("testMap2");

createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <QueryClientProvider client={queryClient}>
            <HeroUIProvider>
                <ToastProvider placement="top-center" toastOffset={60} />
                <ConfirmationDialogProvider>
                    <SaveLoadModalProvider>
                        <App />
                    </SaveLoadModalProvider>
                </ConfirmationDialogProvider>
            </HeroUIProvider>
        </QueryClientProvider>
    </StrictMode>
);
