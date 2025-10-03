import { Game } from "@engine/game";
import { EmptyObject, InitVarsType, PassageType } from "@engine/types";

export class Passage {
    readonly id: string;
    readonly type: PassageType;

    constructor(id: string, type: PassageType) {
        this.id = id;
        this.type = type;
        Game.registerPassage(this);
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    display<T extends InitVarsType = EmptyObject>(_props: T = {} as T) {
        throw new Error(
            `Display method not implemented for passage: ${this.id}`
        );
    }
}
