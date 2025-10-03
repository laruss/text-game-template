import { ErrorBoundary } from "@components/ErrorBoundary";
import { Game } from "@engine/game";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Activity, PropsWithChildren, useEffect } from "react";

import { AppIconMenu } from "./AppIconMenu";
import { DevModeDrawer } from "./DevModeDrawer";
import { OptionsProvider } from "./OptionsContext";

const queryClient = new QueryClient();

export const GameProvider = ({ children }: PropsWithChildren) => {
    useEffect(() => {
        Game.loadFromSessionStorage();
        Game.enableAutoSave();
    }, []);

    return (
        <QueryClientProvider client={queryClient}>
            <ErrorBoundary>
                <OptionsProvider>
                    {children}
                    <Activity mode={import.meta.env.DEV ? "visible" : "hidden"}>
                        <AppIconMenu />
                        <DevModeDrawer />
                    </Activity>
                </OptionsProvider>
            </ErrorBoundary>
        </QueryClientProvider>
    );
};
