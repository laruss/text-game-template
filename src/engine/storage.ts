import { STORAGE_SYSTEM_PATH } from "@engine/constants";
import { GameSaveState, JsonPath } from "@engine/types";
import jp from "jsonpath";

const storage = {};

export class Storage {
    /**
     * Retrieves and returns an array of values from the storage based on the given JSONPath query.
     *
     * @packageDocumentation https://www.npmjs.com/package/jsonpath
     * @param {JsonPath} jsonPath - The JSONPath query that specifies the data to retrieve from the storage.
     * @return {Array<T>} An array of values that match the provided JSONPath query.
     */
    static getValue<T>(jsonPath: JsonPath): Array<T> {
        return jp.query(storage, jsonPath) as Array<T>;
    }

    /**
     * Sets a value in the storage at the specified JSONPath.
     *
     * @param {JsonPath} jsonPath - The JSONPath where the value should be set.
     * @param {any} value - The value to set at the specified JSONPath.
     * @param {boolean} [_isSystem=false] - Optional flag to indicate if the path is a system path.
     */
    static setValue<T>(
        jsonPath: JsonPath,
        value: T,
        _isSystem: boolean = false
    ): void {
        if (jsonPath.includes(STORAGE_SYSTEM_PATH) && !_isSystem) {
            throw new Error(`Cannot set value at system path: ${jsonPath}`);
        }

        // Check if the path exists
        const existingValues = jp.query(storage, jsonPath);

        if (existingValues.length > 0) {
            // Path exists, update it
            jp.apply(storage, jsonPath, () => value);
        } else {
            // Path doesn't exist, create it
            this.createPath(storage, jsonPath, value);
        }
    }

    /**
     * Retrieves the entire state of the storage.
     *
     * @return {GameSaveState} The current state of the storage as an object.
     */
    static getState(): GameSaveState {
        return storage;
    };

    /**
     * Sets the entire state of the storage to a new value.
     *
     * @param {GameSaveState} state - The new state to set for the storage.
     */
    static setState(state: GameSaveState): void {
        if (typeof state !== 'object' || state === null) {
            throw new Error('Invalid state provided. Expected an object.');
        }
        // Clear the current storage
        for (const key in storage) {
            delete storage[key as keyof typeof storage];
        }
        // Set the new state
        Object.assign(storage, state);
    }

    /**
     * Creates or updates a nested path within an object based on the provided JSONPath,
     * and assigns a given value to the specified path.
     *
     * @param {Record<string, unknown>} obj - The target object where the path will be created or updated.
     * @param {JsonPath} jsonPath - The JSONPath string that specifies the location within the object.
     * @param {T} value - The value to set at the specified JSONPath location.
     * @return {void} This method does not return a value.
     */
    private static createPath<T>(
        obj: Record<string, unknown>,
        jsonPath: JsonPath,
        value: T
    ): void {
        // Parse the JSONPath to get the path components
        const pathComponents = jp.parse(jsonPath);

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        let current = obj as any;

        // Iterate through path components, skipping the root ($)
        for (let i = 1; i < pathComponents.length; i++) {
            const component = pathComponents[i];
            const isLast = i === pathComponents.length - 1;

            if (component.expression.type === "identifier") {
                // Property access like .hello or .user
                const key = component.expression.value;

                if (isLast) {
                    current[key] = value;
                } else {
                    // Create object if it doesn't exist
                    if (
                        !(key in current) ||
                        typeof current[key] !== "object" ||
                        current[key] === null
                    ) {
                        current[key] = {};
                    }
                    current = current[key];
                }
            } else if (component.expression.type === "numeric_literal") {
                // Array index like [0] or [1]
                const index = parseInt(component.expression.value);

                if (isLast) {
                    // Ensure current is an array
                    if (!Array.isArray(current)) {
                        current = []; // Create an array if it doesn't exist
                    }
                    current[index] = value;
                } else {
                    // Create array if it doesn't exist or extend it if needed
                    if (!Array.isArray(current)) {
                        current = [];
                    }
                    if (!current[index]) {
                        current[index] = {}; // Create an object if it doesn't exist
                    }
                    current = current[index];
                }
            }
        }
    }
}
