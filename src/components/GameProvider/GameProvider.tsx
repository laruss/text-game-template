import { ErrorBoundary } from "@components/ErrorBoundary";
import { MainMenu } from "@components/MainMenu";
import { SYSTEM_PASSAGE_NAMES } from "@engine/constants";
import { Game } from "@engine/game";
import { newWidget } from "@engine/passages/widget";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Activity, PropsWithChildren, useEffect } from "react";

import { AppIconMenu } from "./AppIconMenu";
import { DevModeDrawer } from "./DevModeDrawer";
import { OptionsProvider } from "./OptionsContext";

newWidget(SYSTEM_PASSAGE_NAMES.START, <MainMenu />);
Game.setCurrent(SYSTEM_PASSAGE_NAMES.START);

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
