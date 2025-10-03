import { ButtonColor, ButtonVariant } from "@engine/types";
import { ReactNode } from "react";

export interface BaseComponent {
    /**
     * Represents a unique identifier, optionally assigned as a string.
     * This can be used to distinguish or reference entities uniquely.
     */
    id?: string;
    /**
     * Represents the initial state of a variant. Determines how the variant should
     * be presented at the start.
     *
     * Possible values:
     * - "display": The variant is visible and displayed initially.
     * - "hidden": The variant is not visible or displayed initially.
     * - "disclosure": The variant is initially in a state that can be expanded or revealed.
     */
    initialVariant?: "display" | "hidden" | "disclosure";
}

export interface TextComponent extends BaseComponent {
    type: "text";
    content: ReactNode;
    props?: {
        className?: string; // CSS class for styling the text
    };
}

export type HeaderLevel = 1 | 2 | 3 | 4 | 5 | 6; // Define header levels as a type

export interface HeaderComponent extends BaseComponent {
    type: "header";
    content: string; // The header text
    props?: {
        level?: HeaderLevel; // Header level, default is 1
        className?: string; // CSS class for styling the header
    };
}
export interface ImageComponent extends BaseComponent {
    type: "image";
    content: string;
    props?: {
        alt?: string;
        className?: string;
        disableModal?: boolean; // If true, the image will not open in a modal on click
        onClick?: () => void; // Optional click handler for the image
    };
}
export interface VideoComponent extends BaseComponent {
    type: "video";
    content: string;
    props?: {
        className?: string;
        controls?: boolean; // Whether to show video controls
        autoPlay?: boolean; // Whether the video should autoplay
        loop?: boolean; // Whether the video should loop
        muted?: boolean; // Whether the video should be muted
    };
}

export type ActionType = {
    label: string;
    action: () => void;
    color?: ButtonColor;
    variant?: ButtonVariant;
    isDisabled?: boolean; // Whether the action button is disabled
    tooltip?: {
        content: string; // Tooltip content
        position?: "top" | "bottom" | "left" | "right"; // Position of the tooltip
        className?: string; // CSS class for styling the tooltip
    };
    className?: string;
};

export interface ActionsComponent extends BaseComponent {
    type: "actions";
    content: Array<ActionType>;
    props?: {
        direction?: "horizontal" | "vertical";
        className?: string;
    };
}
export interface AnotherStoryComponent extends BaseComponent {
    type: "anotherStory";
    storyId: string; // ID of the story to be displayed
}

export type ConversationBubbleSide = "left" | "right"; // Define possible sides for conversation bubbles

export type ConversationBubble = {
    who?: {
        name?: string;
        avatar?: string;
    };
    content: ReactNode; // Content of the conversation bubble
    color?: `#${string}`; // Color of the bubble, e.g., "#ff0000"
    side?: ConversationBubbleSide;
    props?: {
        classNames?: {
            base?: string; // Base class for the bubble
            content?: string; // Class for the content inside the bubble
            avatar?: string; // Class for the avatar if present
        };
    };
};

export type ConversationVariant = "chat" | "messenger"; // Define possible conversation display types
export type ConversationAppearance = "atOnce" | "byClick"; // Define how the conversation appears

export interface ConversationComponent extends BaseComponent {
    type: "conversation";
    content: Array<ConversationBubble>;
    appearance?: ConversationAppearance; // default is "atOnce"
    props?: {
        variant?: ConversationVariant; // Type of conversation display
        className?: string; // CSS class for styling the conversation
    };
}

export type Component =
    | TextComponent
    | HeaderComponent
    | ImageComponent
    | VideoComponent
    | ActionsComponent
    | ConversationComponent
    | AnotherStoryComponent;
export type ComponentCallback = () => Component | undefined;

export type StoryOptions = {
    background?: {
        image?: string | (() => string); // URL or path to the background image
    };
    classNames?: {
        base?: string;
        container?: string;
    };
};
