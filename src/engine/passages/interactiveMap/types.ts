import { ButtonColor, ButtonVariant, OptionalCallable } from "@engine/types";

interface BaseHotspot {
    id?: string;
    action: () => void;
    isDisabled?: boolean | (() => boolean);
    tooltip?: {
        content: string | (() => string);
        position?: "top" | "bottom" | "left" | "right";
    };
}

export interface LabelHotspot extends BaseHotspot {
    type: "label";
    content: string | (() => string);
    props?: {
        classNames?: {
            button?: string; // class for the button
        };
        variant?: ButtonVariant;
        color?: ButtonColor;
    };
}

export interface ImageHotspot extends BaseHotspot {
    type: "image";
    content: {
        idle: string | (() => string); // URL or path to the image
        hover?: string | (() => string); // URL or path to the image on hover
        active?: string | (() => string); // URL or path to the image on click
        disabled?: string | (() => string); // URL or path to the image when disabled
    };
    props?: {
        zoom?: `${number}%`;
        classNames?: {
            container?: string; // class for the container
            idle?: string; // class for idle state
            hover?: string; // class for hover state
            active?: string; // class for active state
            disabled?: string; // class for disabled state
        };
    };
}

interface BaseMapHotspot {
    position: {
        x: number | (() => number); // 0 to 100 for percentage
        y: number | (() => number); // 0 to 100 for percentage
    };
}

export interface MapLabelHotspot extends LabelHotspot, BaseMapHotspot {}

export interface MapImageHotspot extends ImageHotspot, BaseMapHotspot {}

interface SideHotspot {
    position: "left" | "right" | "top" | "bottom";
}

export interface SideLabelHotspot extends LabelHotspot, SideHotspot {}

export interface SideImageHotspot extends ImageHotspot, SideHotspot {}

export interface MapMenu {
    type: "menu";
    items: Array<OptionalCallable<LabelHotspot>>;
    position: {
        x: number | (() => number);
        y: number | (() => number);
    };
    direction?: "horizontal" | "vertical"; // Direction of the menu items, default is vertical
    props?: {
        className?: string;
    },
}

export type AnyHotspot =
    | MapLabelHotspot
    | MapImageHotspot
    | SideLabelHotspot
    | SideImageHotspot
    | MapMenu;
export type HotspotCallback = () => AnyHotspot | undefined;

export type InteractiveMapOptions = {
    caption?: string;
    image: string | (() => string); // URL or path to the map image
    hotspots: Array<HotspotCallback>;
    bgImage?: string | (() => string); // URL or path to the background image
    props?: {
        /** Opacity of the background image */
        bgOpacity?: number;
    };
    classNames?: {
        container?: string;
        topHotspots?: string;
        bottomHotspots?: string;
        leftHotspots?: string;
        rightHotspots?: string;
    };
};

export type InteractiveMapType = Pick<
    InteractiveMapOptions,
    "caption" | "props" | "classNames"
> & {
    image: string;
    bgImage?: string;
    hotspots: Array<AnyHotspot>;
};
