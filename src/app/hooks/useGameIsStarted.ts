import { SYSTEM_PASSAGE_NAMES } from "@engine/constants";
import { Game } from "@engine/game";
import { useProxy } from "valtio/utils";

export const useGameIsStarted = (): boolean => {
    const reactiveGameState = useProxy(Game.selfState);

    return reactiveGameState.currentPassageId !== SYSTEM_PASSAGE_NAMES.START;
};
