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

    return useProxy(proxiedObject);
}
