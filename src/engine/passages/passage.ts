import { EmptyObject, InitVarsType, PassageType } from "@engine/types";

export class Passage {
    readonly id: string;
    readonly type: PassageType;

    constructor(id: string, type: PassageType) {
        this.id = id;
        this.type = type;
    }

    // this method should be overridden by subclasses
    display<T extends InitVarsType = EmptyObject>(props: T = {} as T) {
        console.log(`Displaying passage: ${this.id} with props:`, props);
        throw new Error(
            `Display method not implemented for passage: ${this.id}`
        );
    }
}
