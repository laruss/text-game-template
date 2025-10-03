import { Game } from "@engine/game";
import { Passage } from "@engine/passages/passage";
import { EmptyObject, InitVarsType } from "@engine/types";

import { Component, StoryContent, StoryOptions } from "./types";

export class Story extends Passage {
    private readonly content: StoryContent;
    private readonly options: StoryOptions;

    constructor(id: string, content: StoryContent, options: StoryOptions = {}) {
        super(id, "story");
        this.content = content;
        this.options = options;
        Game.registerPassage(this);
    }

    /**
     * Renders a set of components based on the input properties.
     * If the component is a function, it invokes the function; otherwise, it uses the component as is.
     * Filters out any undefined components from the final result.
     *
     * @param {T extends InitVarsType} [props] - The properties used during rendering, defaulting to an empty object.
     * @return {Array<Component>} An array of filtered components, excluding undefined entries.
     */
    display<T extends InitVarsType = EmptyObject>(
        props: T = {} as T
    ): { options?: StoryOptions; components: Array<Component> } {
        return {
            options: this.options,
            components: this.content(props),
        };
    }
}
