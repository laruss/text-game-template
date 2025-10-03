import { Game } from "@engine/game";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { PropsWithChildren, useEffect } from "react";

import { AppIconMenu } from "./AppIconMenu";
import { DevModeDrawer } from "./DevModeDrawer";

const queryClient = new QueryClient();

export const GameProvider = ({ children }: PropsWithChildren) => {
    useEffect(() => {
        Game.loadFromSessionStorage();
        Game.enableAutoSave();
    }, []);

    return (
        <QueryClientProvider client={queryClient}>
            <>
                {children}
                {import.meta.env.DEV && (
                    <>
                        <AppIconMenu />
                        <DevModeDrawer />
                    </>
                )}
            </>
        </QueryClientProvider>
    );
};
