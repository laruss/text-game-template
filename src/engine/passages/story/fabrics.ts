import { callIfFunction } from "@engine/helpers";
import { MaybeOptionalCallable, OptionalCallable } from "@engine/types";

import { Story } from "./story";
import {
    ActionsComponent,
    AnotherStoryComponent,
    ComponentCallback,
    ConversationBubble,
    ConversationComponent,
    HeaderComponent,
    ImageComponent,
    StoryOptions,
    TextComponent,
    VideoComponent,
} from "./types";

export const newStory = (
    id: string,
    components: Array<ComponentCallback>,
    options?: StoryOptions
): Story => new Story(id, components, options);

export const newText =
    (
        component: MaybeOptionalCallable<TextComponent> | string
    ): OptionalCallable<TextComponent> =>
    () =>
        typeof component === "string"
            ? { type: "text", content: component }
            : callIfFunction(component);

export const newHeader =
    (
        component: MaybeOptionalCallable<HeaderComponent> | string
    ): OptionalCallable<HeaderComponent> =>
    () =>
        typeof component === "string"
            ? { type: "header", content: component }
            : callIfFunction(component);

export const newImage =
    (
        component: MaybeOptionalCallable<ImageComponent> | string
    ): OptionalCallable<ImageComponent> =>
    () =>
        typeof component === "string"
            ? { type: "image", content: component }
            : callIfFunction(component);

export const newVideo =
    (
        component: MaybeOptionalCallable<VideoComponent> | string
    ): OptionalCallable<VideoComponent> =>
    () =>
        typeof component === "string"
            ? { type: "video", content: component }
            : callIfFunction(component);

export const newActions =
    (
        component: MaybeOptionalCallable<ActionsComponent>
    ): OptionalCallable<ActionsComponent> =>
    () =>
        callIfFunction(component);

export const newLine = (bubble: ConversationBubble): ConversationBubble =>
    bubble;

export const newConversation =
    (
        component:
            | MaybeOptionalCallable<ConversationComponent>
            | ConversationComponent["content"]
    ): OptionalCallable<ConversationComponent> =>
    () =>
        typeof component === "object" && Array.isArray(component)
            ? { type: "conversation", content: component }
            : callIfFunction(component);

export const newStoryAnchor =
    (
        component: MaybeOptionalCallable<AnotherStoryComponent> | string
    ): OptionalCallable<AnotherStoryComponent> =>
    () =>
        typeof component === "string"
            ? { type: "anotherStory", storyId: component }
            : callIfFunction(component);
