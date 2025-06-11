import { Game } from "@engine/game";
import { Passage } from "@engine/passages/passage";
import { useProxy } from "valtio/utils";

export const useCurrentPassage = (): Passage | null => {
    const reactiveGameState = useProxy(Game.selfState);

    if (reactiveGameState.currentPassageId === null) {
        return null;
    }

    return Game.getPassageById(reactiveGameState.currentPassageId);
};
