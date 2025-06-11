import {
    Children,
    cloneElement,
    isValidElement,
    MouseEvent,
    ReactElement,
    ReactNode,
    RefObject,
} from "react";

import { ImagePositionInfo } from "./types";

type RenderChildrenProps = {
    children: ReactNode;
    positionInfo: ImagePositionInfo;
};

export const renderChildren = ({
    children,
    positionInfo,
}: RenderChildrenProps) =>
    Children.map(children, (child) => {
        if (isValidElement(child)) {
            // Cast to ReactElement to properly pass props
            return cloneElement(
                child as ReactElement<Record<string, unknown>>,
                {
                    imagePositionInfo: positionInfo,
                }
            );
        }
        return child;
    });

export const handleMapClick = (
    event: MouseEvent<HTMLImageElement>,
    imageRef: RefObject<HTMLImageElement | null>
) => {
    // log percentage of click position relative to the image size
    if (!import.meta.env.PROD) {
        const rect = imageRef.current?.getBoundingClientRect();
        if (rect) {
            const xPercent = ((event.clientX - rect.left) / rect.width) * 100;
            const yPercent = ((event.clientY - rect.top) / rect.height) * 100;
            console.log("Click position is copied to clipboard");
            navigator.clipboard.writeText(
                `{ x: ${xPercent.toFixed(2)}, y: ${yPercent.toFixed(2)} }`
            );
        } else {
            console.error("Image reference is null or invalid.");
        }
    }
};
