import { Game } from "@engine/game";
import { useProxy } from "valtio/utils";

export const useGameIsStarted = (): boolean => {
    const reactiveGameState = useProxy(Game.selfState);

    return reactiveGameState.currentPassageId !== null;
};
