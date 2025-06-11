import { callIfFunction } from "@engine/helpers";
import { Passage } from "@engine/passages/passage";
import { EmptyObject, InitVarsType } from "@engine/types";

import { InteractiveMapOptions, InteractiveMapType } from "./types";

export class InteractiveMap extends Passage {
    private readonly options: InteractiveMapOptions;

    constructor(id: string, options: InteractiveMapOptions) {
        super(id, "interactiveMap");
        this.options = options;
    }

    display<T extends InitVarsType = EmptyObject>(
        props: T = {} as T
    ): InteractiveMapType {
        // todo: should we use props here?
        console.log(props);

        const hotspots = this.options.hotspots
            .map((callback) => callback())
            .filter((hotspot) => hotspot !== undefined);

        const image = callIfFunction(this.options.image);

        const bgImage = callIfFunction(this.options.bgImage);

        return {
            ...this.options,
            image,
            bgImage,
            hotspots,
        };
    }
}
