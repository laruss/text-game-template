import { BaseGameObject } from "@engine/baseGameObject";
import { Game } from "@engine/game";
import { useProxy } from "valtio/utils";

/**
 * Monitors changes to a given game object by wrapping it in a proxy.
 *
 * @param {T} gameObject - The game object to be observed. This object must extend the BaseGameObject class.
 * @return {T} - The proxied game object that allows monitoring and reacting to changes.
 */
export function useWatch<T extends BaseGameObject>(gameObject: T): T {
    const proxiedObject = Game.getProxiedObject(gameObject);

    try {
        return useProxy(proxiedObject);
    } catch (error) {
        // if error is a TypeError, it means the object is not registered
        if (error instanceof TypeError) {
            console.error(
                `Object "${gameObject.id}" is not registered in the game. Did you forget to call Game.registerEntity?`
            );
            throw error;
        } else {
            throw error; // rethrow other types of errors
        }
    }
}
