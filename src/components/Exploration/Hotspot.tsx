import { useGameActionApi } from "@client/app/api/hooks";
import { Button, Spinner } from "@heroui/react";
import type { IHotspotButton } from "@server/src/lib/schemas/exploration";
import { useEffect, useRef, useState } from "react";
import { getImageUrl } from "@client/app/helpers";

interface ImagePositionInfo {
    scaleFactor: number;
    offsetLeft: number;
    offsetTop: number;
    scaledWidth: number;
    scaledHeight: number;
}

interface HotspotProps {
    hotspot: IHotspotButton;
    containerWidth: number;
    containerHeight: number;
    imagePositionInfo?: ImagePositionInfo;
    sideHotspot?: boolean;
}

export const Hotspot = ({
    hotspot,
    imagePositionInfo,
    sideHotspot = false,
}: HotspotProps) => {
    const { id, coordinates, hover } = hotspot;
    const hotspotRef = useRef<HTMLDivElement>(null);
    const [isHovering, setIsHovering] = useState(false);
    const { mutate: performAction, isPending } = useGameActionApi();

    // Position the hotspot based on percentage coordinates and image position info
    // Only apply positioning if this is NOT a side hotspot
    useEffect(() => {
        if (hotspotRef.current && imagePositionInfo && !sideHotspot) {
            const [x, y] = coordinates;
            const { offsetLeft, offsetTop, scaledWidth, scaledHeight } =
                imagePositionInfo;

            // Calculate position based on percentage of the scaled image
            // x and y are percentages (0-100), so we convert to 0-1 by dividing by 100
            const xPos = offsetLeft + (x / 100) * scaledWidth;
            const yPos = offsetTop + (y / 100) * scaledHeight;

            hotspotRef.current.style.left = `${xPos}px`;
            hotspotRef.current.style.top = `${yPos}px`;

            // Ensure transforms are applied
            hotspotRef.current.style.transform = "translate(-50%, -50%)";
        }
    }, [coordinates, imagePositionInfo, sideHotspot]);

    // Handle hotspot click
    const handleClick = () => {
        performAction(id);
    };

    // Render different types of hotspots
    const renderHotspotContent = () => {
        if (hotspot.type === "textButton") {
            // Use inline styles for color if provided
            const buttonStyle = hotspot.color
                ? { backgroundColor: hotspot.color }
                : undefined;

            return (
                <Button
                    style={buttonStyle}
                    onPress={handleClick}
                    onMouseEnter={() => setIsHovering(true)}
                    onMouseLeave={() => setIsHovering(false)}
                    isLoading={isPending}
                    className={sideHotspot ? "whitespace-nowrap" : ""}
                >
                    {hotspot.caption}
                </Button>
            );
        } else if (hotspot.type === "iconButton") {
            return (
                <button
                    className="p-2 rounded-full bg-slate-800 bg-opacity-70 hover:bg-opacity-90 text-white transition-opacity"
                    onClick={handleClick}
                    onMouseEnter={() => setIsHovering(true)}
                    onMouseLeave={() => setIsHovering(false)}
                    disabled={isPending}
                >
                    {isPending ? (
                        <Spinner size="sm" />
                    ) : (
                        <img
                            src={getImageUrl(hotspot.icon)}
                            alt="Hotspot icon"
                            className="w-6 h-6"
                        />
                    )}
                </button>
            );
        }

        return null;
    };

    const hoverPosition = sideHotspot
        ? "top-full left-1/2"
        : "top-full left-1/2";

    return (
        <div
            ref={hotspotRef}
            className={`${sideHotspot ? "" : "absolute z-10"}`}
            style={sideHotspot ? {} : { transform: "translate(-50%, -50%)" }}
        >
            {renderHotspotContent()}

            {isHovering && hover && (
                <div
                    className={`absolute ${hoverPosition} transform -translate-x-1/2 mt-2 px-3 py-1 bg-gray-900 text-white text-sm rounded-md whitespace-nowrap z-30`}
                >
                    {hover}
                </div>
            )}
        </div>
    );
};
