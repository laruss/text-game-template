import { Passage } from "@engine/passages/passage";
import { EmptyObject, InitVarsType } from "@engine/types";

import { Component, ComponentCallback, StoryOptions } from "./types";

export class Story extends Passage {
    private readonly components: Array<ComponentCallback | Component>;
    private readonly options: StoryOptions;

    constructor(
        id: string,
        components: Array<ComponentCallback | Component>,
        options: StoryOptions = {},
    ) {
        super(id, "story");
        this.components = components;
        this.options = options;
    }

    /**
     * Renders a set of components based on the input properties.
     * If the component is a function, it invokes the function; otherwise, it uses the component as is.
     * Filters out any undefined components from the final result.
     *
     * @param {T} [props] - The properties used during rendering, defaulting to an empty object.
     * @return {Array<Component>} An array of filtered components, excluding undefined entries.
     */
    display<T extends InitVarsType = EmptyObject>(
        props: T = {} as T
    ): { options?: StoryOptions; components: Array<Component> } {
        // todo: should we use props here?
        console.log(props);
        const components = this.components.map((component) =>
            typeof component === "function" ? component() : component
        );

        return {
            components: components.filter((component) => component !== undefined),
            options: this.options,
        };
    }

    /**
     * Retrieves and returns a component by its unique identifier.
     *
     * @param {string} componentId - The unique identifier of the component to retrieve.
     * @return {Object} The component object corresponding to the provided ID.
     * @throws {Error} If no component with the given ID is found.
     * @return {Component} The component object corresponding to the provided ID.
     */
    displayComponent(componentId: string): Component {
        const component = this.components.find(
            (comp) => typeof comp !== "function" && comp.id === componentId
        );

        if (!component) {
            throw new Error(
                `Component with id "${componentId}" not found in story "${this.id}".`
            );
        }

        return component as Component;
    }
}
