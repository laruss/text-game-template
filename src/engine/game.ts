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

/**
 * The `Game` class manages the core logic and state of the game, including
 * registration of passages and entities, navigation between passages,
 * and saving/loading the game state.
 */
export class Game {
    private static state = proxy({
        currentPassageId: null as string | null,
    });

    /**
     * Registers and proxies the provided game objects for further use by adding them to the object registry.
     *
     * @param {...BaseGameObject[]} objects - The array of BaseGameObject instances to be registered.
     * @return {void} This method does not return a value.
     */
    static registerEntity(...objects: Array<BaseGameObject>): void {
        objects.forEach((object) => {
            if (objectRegistry.has(object.id)) {
                throw new Error(`Object "${object.id}" is already registered.`);
            }

            const proxiedObject = proxy(object);
            console.log(`Registering and proxying object: ${object.id}`);
            objectRegistry.set(object.id, proxiedObject);
        });
    }

    /**
     * Registers one or more passages into the passages registry. Each passage must have a unique identifier.
     * Throws an error if a passage with the same id is already registered.
     *
     * @param {...Passage} passages The passages to be registered. Each passage should be an object containing an `id` property.
     * @return {void} Does not return a value.
     */
    static registerPassage(...passages: Array<Passage>): void {
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

    /**
     * Retrieves the current passage from the passage registry based on the current passage ID in the game state.
     * If the current passage ID is null or the passage cannot be found, returns null.
     *
     * @return {Passage | null} The current passage object or null if not available.
     */
    static get currentPassage(): Passage | null {
        if (Game.state.currentPassageId === null) {
            return null;
        }
        return passagesRegistry.get(Game.state.currentPassageId) || null;
    }

    /**
     * Retrieves a passage by its unique identifier.
     *
     * @param {string} passageId - The unique ID of the passage to retrieve.
     * @return {Passage|null} The passage object if found, or null if no passage exists with the given ID.
     */
    static getPassageById(passageId: string): Passage | null {
        return passagesRegistry.get(passageId) || null;
    }

    /**
     * Retrieves all the passages from the passages registry.
     *
     * @return {Array<Passage>} An array containing all the Passage objects.
     */
    static getAllPassages(): Array<Passage> {
        return Array.from(passagesRegistry.values());
    }

    /**
     * Navigates the game to a specified passage.
     *
     * @param {Passage|string} passage - The passage object or identifier of the passage to jump to.
     * @return {void} Does not return any value.
     * @throws {Error} Throws an error if the specified passage is not found.
     */
    static jumpTo(passage: Passage | string): void {
        const passageId = typeof passage === "string" ? passage : passage.id;

        const retrievedPassage = passagesRegistry.get(passageId) || null;

        if (!retrievedPassage) {
            throw new Error(`Passage "${passageId}" not found.`);
        }

        Game.state.currentPassageId = retrievedPassage
            ? retrievedPassage.id
            : null;
        console.log(`Jumping to passage: ${Game.state.currentPassageId}`);
    }

    /**
     * Sets the current passage in the game state.
     *
     * @param {Passage|string} passage - The passage to be set as current. Can be either a Passage object or a string representing the passage ID.
     * @return {void} This method does not return a value.
     */
    static setCurrent(passage: Passage | string): void {
        Game.state.currentPassageId =
            typeof passage === "string" ? passage : passage.id;
    }

    /**
     * Retrieves the proxied object from the object registry based on its ID.
     * If the object is not found in the registry, the original object is returned.
     *
     * @param {T extends BaseGameObject} object - The original object to find in the registry.
     * @return {T extends BaseGameObject} The proxied object from the registry if present, otherwise the original object.
     */
    static _getProxiedObject<T extends BaseGameObject>(object: T): T {
        return (objectRegistry.get(object.id) as T) || object;
    }

    static get selfState() {
        return Game.state;
    }

    /**
     * Saves the current game state, including critical passage information, into storage.
     * (saves game itself, not the objects or passages)
     *
     * @return {void} No return value.
     */
    private static save() {
        const internalState = {
            currentPassageId: Game.state.currentPassageId,
        } as const satisfies GameInternalSaveState;

        Storage.setValue(jsonPath, internalState, true);
    }

    /**
     * Loads the saved game state from storage and sets the current passage ID in the game state.
     * Throws an error if no saved state is found.
     *
     * @return {void} No return value.
     */
    private static load(): void {
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
