import { options } from "@game/options";
import { type EntityTable } from "dexie";
import Dexie from "dexie";

// Constants
export const SYSTEM_SAVE_NAME = "__SYSTEM_INITIAL_STATE__" as const;

// Define interfaces for our database entities
export interface GameSave {
    id?: number;
    name: string;
    gameData: Record<string, unknown>; // Game state data
    timestamp: Date;
    version: string; // Game version when the save was created
    screenshot?: string; // Base64 encoded screenshot
    description?: string;
    isSystemSave?: boolean; // Mark as system save (won't be shown in UI)
}

export interface GameSettings {
    id?: number;
    key: string;
    value: string | number | boolean | object;
    timestamp: Date;
    version: string; // Game version when the setting was created/updated
}

// Database class extending Dexie
export class GameDatabase extends Dexie {
    saves!: EntityTable<GameSave, "id">;
    settings!: EntityTable<GameSettings, "id">;

    constructor(gameId: string) {
        super(`${gameId}-gamedb`);

        this.version(1).stores({
            saves: "++id, name, timestamp", // Auto-incrementing id, indexed name and timestamp
            settings: "++id, &key, timestamp", // Auto-incrementing id, unique key, indexed timestamp
        });

        // Migration to version 2: Add isSystemSave field
        this.version(2).stores({
            saves: "++id, name, timestamp, isSystemSave", // Add isSystemSave to indexed fields
            settings: "++id, &key, timestamp",
        });
    }
}

// Database instance cache to avoid creating multiple instances
const dbCache = new Map<string, GameDatabase>();

/**
 * Get the database instance for a specific game ID
 * @param gameId - The unique identifier for the game
 * @returns GameDatabase instance
 */
export function getGameDatabase(gameId: string): GameDatabase {
    if (!dbCache.has(gameId)) {
        const db = new GameDatabase(gameId);
        dbCache.set(gameId, db);
    }
    return dbCache.get(gameId)!;
}

/**
 * Get the default database instance for the current game
 * @returns GameDatabase instance for the current game
 */
export function getDatabase(): GameDatabase {
    return getGameDatabase(options.gameId);
}

// Export the default database instance
export const db = getDatabase();

// Helper functions for common operations

/**
 * Save game data to the database
 * @param name - Name of the save
 * @param gameData - Game state data to save
 * @param description - Optional description
 * @param screenshot - Optional base64 encoded screenshot
 * @returns Promise<number> - The ID of the created save
 */
export async function saveGame(
    name: string,
    gameData: Record<string, unknown>,
    description?: string,
    screenshot?: string
): Promise<number> {
    const id = await db.saves.add({
        name,
        gameData,
        timestamp: new Date(),
        version: options.gameVersion,
        description,
        screenshot,
    });
    if (id === undefined) {
        throw new Error("Failed to save game");
    }
    return id;
}

/**
 * Load game data from the database
 * @param id - ID of the save to load
 * @returns Promise<GameSave | undefined> - The save data or undefined if not found
 */
export async function loadGame(id: number): Promise<GameSave | undefined> {
    return db.saves.get(id);
}

/**
 * Load a game save by its name
 * @param name - Name of the save to load
 * @returns Promise<GameSave | undefined> - The save data or undefined if not found
 */
export async function loadGameByName(
    name: string
): Promise<GameSave | undefined> {
    return db.saves.where("name").equals(name).first();
}

/**
 * Retrieves all saved games from the database (excluding system saves).
 *
 * @return {Promise<GameSave[]>} A promise that resolves to an array of game save objects.
 */
export async function getAllSaves(): Promise<GameSave[]> {
    return db.saves.filter((save) => !save.isSystemSave).toArray();
}

/**
 * Delete a save
 * @param id - ID of the save to delete
 * @returns Promise<void>
 */
export async function deleteSave(id: number): Promise<void> {
    await db.saves.delete(id);
}

/**
 * Set a game setting
 * @param key - Setting key
 * @param value - Setting value
 * @returns Promise<number> - The ID of the setting
 */
export async function setSetting(
    key: string,
    value: string | number | boolean | object
): Promise<number> {
    // Try to update existing setting first
    const existing = await db.settings.where("key").equals(key).first();
    if (existing) {
        await db.settings.update(existing.id!, {
            value,
            timestamp: new Date(),
            version: options.gameVersion,
        });
        return existing.id!;
    } else {
        // Create new setting
        const id = await db.settings.add({
            key,
            value,
            timestamp: new Date(),
            version: options.gameVersion,
        });
        if (id === undefined) {
            throw new Error("Failed to create setting");
        }
        return id;
    }
}

/**
 * Deletes all game save data from the database.
 *
 * This method clears all records within the "saves" table or collection,
 * resulting in the complete removal of stored game save data.
 *
 * @return {Promise<void>} A promise that resolves when the game save data has been successfully deleted.
 */
export async function deleteAllGameSaves(): Promise<void> {
    await db.saves.clear();
}

/**
 * Get a game setting
 * @param key - Setting key
 * @param defaultValue - Default value if setting doesn't exist
 * @returns Promise<T> - The setting value or default value
 */
export async function getSetting<T>(key: string, defaultValue: T): Promise<T> {
    const setting = await db.settings.where("key").equals(key).first();
    return setting ? (setting.value as T) : defaultValue;
}

/**
 * Get all settings as a key-value object
 * @returns Promise<Record<string, any>> - Object with all settings
 */
export async function getAllSettings(): Promise<
    Record<string, string | number | boolean | object>
> {
    const settings = await db.settings.toArray();
    const result: Record<string, string | number | boolean | object> = {};
    for (const setting of settings) {
        result[setting.key] = setting.value;
    }
    return result;
}

/**
 * Delete a setting
 * @param key - Setting key to delete
 * @returns Promise<void>
 */
export async function deleteSetting(key: string): Promise<void> {
    await db.settings.where("key").equals(key).delete();
}

/**
 * Retrieves the system save from the database.
 *
 * @return {Promise<GameSave | undefined>} A promise that resolves to the system save or undefined if not found.
 */
export async function getSystemSave(): Promise<GameSave | undefined> {
    return db.saves.where("name").equals(SYSTEM_SAVE_NAME).first();
}

/**
 * Creates or updates the system save with the provided game data.
 *
 * @param {Record<string, unknown>} gameData - The game state data to save as the system initial state.
 * @return {Promise<number>} A promise that resolves to the ID of the system save.
 */
export async function createOrUpdateSystemSave(
    gameData: Record<string, unknown>
): Promise<number> {
    const existingSave = await getSystemSave();

    if (existingSave?.id) {
        await db.saves.update(existingSave.id, {
            gameData,
            timestamp: new Date(),
            version: options.gameVersion,
        });
        return existingSave.id;
    } else {
        const id = await db.saves.add({
            name: SYSTEM_SAVE_NAME,
            gameData,
            timestamp: new Date(),
            version: options.gameVersion,
            isSystemSave: true,
        });
        if (id === undefined) {
            throw new Error("Failed to create system save");
        }
        return id;
    }
}
