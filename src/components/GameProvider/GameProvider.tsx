import { ErrorBoundary } from "@components/ErrorBoundary";
import { MainMenu } from "@components/MainMenu";
import { SYSTEM_PASSAGE_NAMES } from "@engine/constants";
import { Game } from "@engine/game";
import { newWidget } from "@engine/passages/widget";
import { Activity, PropsWithChildren, useEffect } from "react";

import { AppIconMenu } from "./AppIconMenu";
import { DevModeDrawer } from "./DevModeDrawer";
import { OptionsProvider } from "./OptionsContext";

newWidget(SYSTEM_PASSAGE_NAMES.START, <MainMenu />);
Game.setCurrent(SYSTEM_PASSAGE_NAMES.START);

export const GameProvider = ({ children }: PropsWithChildren) => {
    useEffect(() => {
        // Initialize game (create/update system save with initial state)
        Game.init().then(() => {
            // Load from session storage if available
            Game.loadFromSessionStorage();
            // Enable auto-save
            Game.enableAutoSave();
        });
    }, []);

    return (
        <ErrorBoundary>
            <OptionsProvider>
                {children}
                <Activity mode={import.meta.env.DEV ? "visible" : "hidden"}>
                    <AppIconMenu />
                    <DevModeDrawer />
                </Activity>
            </OptionsProvider>
        </ErrorBoundary>
    );
};
