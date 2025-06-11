import { BaseGameObject } from "@engine/baseGameObject";
import { STORAGE_SYSTEM_PATH } from "@engine/constants";
import { Passage } from "@engine/passages/passage";
import { Storage } from "@engine/storage";
import { GameSaveState, JsonPath } from "@engine/types";
import { proxy } from "valtio";

const objectRegistry = new Map<string, BaseGameObject>();
const passagesRegistry = new Map<string, Passage>();

const jsonPath = `${STORAGE_SYSTEM_PATH}.game` as const satisfies JsonPath;

type GameInternalSaveState = {
    currentPassageId: string | null;
};

export class Game {
    private static state = proxy({
        currentPassageId: null as string | null,
    });

    static registerEntity(...objects: Array<BaseGameObject>) {
        objects.forEach((object) => {
            if (objectRegistry.has(object.id)) {
                throw new Error(`Object "${object.id}" is already registered.`);
            }

            const proxiedObject = proxy(object);
            console.log(`Registering and proxying object: ${object.id}`);
            objectRegistry.set(object.id, proxiedObject);
        });
    }

    static registerPassage(...passages: Array<Passage>) {
        passages.forEach((passage) => {
            if (passagesRegistry.has(passage.id)) {
                throw new Error(
                    `Passage "${passage.id}" is already registered.`
                );
            }

            console.log(`Registering passage: ${passage.id}`);
            passagesRegistry.set(passage.id, passage);
        });
    }

    static get currentPassage(): Passage | null {
        if (Game.state.currentPassageId === null) {
            return null;
        }
        return passagesRegistry.get(Game.state.currentPassageId) || null;
    }

    static getPassageById(passageId: string): Passage | null {
        return passagesRegistry.get(passageId) || null;
    }

    static getAllPassages(): Array<Passage> {
        return Array.from(passagesRegistry.values());
    }

    static jumpTo(passage: Passage | string): void {
        let retrievedPassage: Passage | null = null;
        const passageId = typeof passage === "string" ? passage : passage.id;

        retrievedPassage = passagesRegistry.get(passageId) || null;

        if (!retrievedPassage) {
            throw new Error(`Passage "${passageId}" not found.`);
        }

        Game.state.currentPassageId = retrievedPassage
            ? retrievedPassage.id
            : null;
        console.log(`Jumping to passage: ${Game.state.currentPassageId}`);
    }

    static getProxiedObject<T extends BaseGameObject>(object: T): T {
        return (objectRegistry.get(object.id) as T) || object;
    }

    static get selfState() {
        return Game.state;
    }

    // saves game itself, not the objects or passages
    private static save() {
        const internalState = {
            currentPassageId: Game.state.currentPassageId,
        } as const satisfies GameInternalSaveState;

        Storage.setValue(jsonPath, internalState, true);
    }

    private static load() {
        const savedState = Storage.getValue<GameInternalSaveState>(jsonPath);
        if (!savedState.length) {
            throw new Error("No saved state found.");
        }
        const { currentPassageId } = savedState[0];
        Game.state.currentPassageId = currentPassageId || null;
    }

    static getState(): GameSaveState {
        Game.save();
        for (const [, object] of objectRegistry) {
            object.save();
        }
        return Storage.getState();
    }

    static setState(state: GameSaveState): void {
        Storage.setState(state);
        Game.load();
        for (const [, object] of objectRegistry) {
            object.load();
        }
    }
}
