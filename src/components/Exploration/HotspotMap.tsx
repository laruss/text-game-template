import { getImageUrl } from "@client/app/helpers";
import type {
    IHotspotButton,
    ISideHotspotButton,
} from "@server/src/lib/schemas/exploration";
import React, {
    ReactElement,
    ReactNode,
    useEffect,
    useRef,
    useState,
} from "react";

import { Hotspot } from "./Hotspot";
import { useHotspotMapSize } from "./useHotspotMapSize";

interface HotspotMapProps {
    imageUrl: string;
    sideHotspots?: {
        top?: ISideHotspotButton[];
        bottom?: ISideHotspotButton[];
        left?: ISideHotspotButton[];
        right?: ISideHotspotButton[];
    };
    children?: ReactNode;
}

export const HotspotMap = ({
    imageUrl,
    sideHotspots = { top: [], bottom: [], left: [], right: [] },
    children,
}: HotspotMapProps) => {
    const [isLoading, setIsLoading] = useState(true);
    const [naturalDimensions, setNaturalDimensions] = useState({
        width: 0,
        height: 0,
    });

    // Create separate refs for each container instead of using a ref object
    const topContainerRef = useRef<HTMLDivElement>(null);
    const bottomContainerRef = useRef<HTMLDivElement>(null);
    const leftContainerRef = useRef<HTMLDivElement>(null);
    const rightContainerRef = useRef<HTMLDivElement>(null);

    const fullImageUrl = getImageUrl(imageUrl);

    const { containerRef, imageRef, positionInfo } = useHotspotMapSize({
        isLoading,
        naturalWidth: naturalDimensions.width,
        naturalHeight: naturalDimensions.height,
    });

    const handleImageLoad = () => {
        if (imageRef.current) {
            setNaturalDimensions({
                width: imageRef.current.naturalWidth,
                height: imageRef.current.naturalHeight,
            });
            setIsLoading(false);
        }
    };

    const handleImageError = (
        error: React.SyntheticEvent<HTMLImageElement, Event>
    ) => {
        console.error("Failed to load image:", error);
        setIsLoading(false);
    };

    // Modified centering logic to ensure all hotspots are visible
    useEffect(() => {
        // Function to properly position scrollable containers to ensure first items are visible
        const adjustScrollPosition = (
            container: HTMLDivElement | null,
            isHorizontal: boolean
        ) => {
            if (!container || !container.firstElementChild) return;

            const scrollElement = container.firstElementChild as HTMLElement;

            // For horizontal scrolling (top/bottom), specifically position to show first items
            if (isHorizontal) {
                // Reset to beginning to ensure first items are visible
                scrollElement.scrollLeft = 0;
            } else {
                // For vertical scrolling (left/right), center the content
                const scrollHeight = scrollElement.scrollHeight;
                const clientHeight = scrollElement.clientHeight;
                if (scrollHeight > clientHeight) {
                    scrollElement.scrollTop = (scrollHeight - clientHeight) / 2;
                }
            }
        };

        // Apply scroll positioning after content has loaded
        if (!isLoading) {
            setTimeout(() => {
                adjustScrollPosition(topContainerRef.current, true);
                adjustScrollPosition(bottomContainerRef.current, true);
                adjustScrollPosition(leftContainerRef.current, false);
                adjustScrollPosition(rightContainerRef.current, false);
            }, 100);
        }
    }, [isLoading, sideHotspots]);

    // Render standard hotspots with coordinates
    const renderChildren = () => {
        return React.Children.map(children, (child) => {
            // Only add props to Hotspot components
            if (React.isValidElement(child) && child.type === Hotspot) {
                // Cast to ReactElement to properly pass props
                return React.cloneElement(
                    child as ReactElement<Record<string, unknown>>,
                    {
                        imagePositionInfo: positionInfo,
                    }
                );
            }
            return child;
        });
    };

    // Render one side's hotspots with proper containment
    const renderSideHotspots = (side: "top" | "bottom" | "left" | "right") => {
        const hotspots = sideHotspots[side];
        if (!hotspots || hotspots.length === 0) return null;

        // Get the appropriate ref for each side
        const getRef = (side: string) => {
            switch (side) {
                case "top":
                    return topContainerRef;
                case "bottom":
                    return bottomContainerRef;
                case "left":
                    return leftContainerRef;
                case "right":
                    return rightContainerRef;
                default:
                    return null;
            }
        };

        // Define container styles based on side with responsive padding
        const containerStyles = {
            top: {
                className:
                    "absolute top-0 inset-x-0 z-20 flex justify-center px-2 sm:px-4 md:px-6 lg:px-8",
                style: { paddingTop: "0.5rem" },
            },
            bottom: {
                className:
                    "absolute bottom-0 inset-x-0 z-20 flex justify-center px-2 sm:px-4 md:px-6 lg:px-8",
                style: { paddingBottom: "0.5rem" },
            },
            left: {
                className:
                    "absolute left-0 z-20 flex flex-col justify-center py-2 sm:py-3 md:py-5 lg:py-6",
                style: {
                    paddingLeft: "0.5rem",
                    top: "3rem", // Add space from top
                    bottom: "3rem", // Add space from bottom
                },
            },
            right: {
                className:
                    "absolute right-0 z-20 flex flex-col justify-center py-2 sm:py-3 md:py-5 lg:py-6",
                style: {
                    paddingRight: "0.5rem",
                    top: "3rem", // Add space from top
                    bottom: "3rem", // Add space from bottom
                },
            },
        };

        // Define content container styles for centered, scrollable hotspot lists
        // Add responsive padding to the scrollable area
        const contentStyles = {
            top: "flex flex-row overflow-x-auto scrollbar-thin py-1 sm:py-1.5 md:py-2",
            bottom: "flex flex-row overflow-x-auto scrollbar-thin py-1 sm:py-1.5 md:py-2",
            left: "flex flex-col overflow-y-auto scrollbar-thin px-1 sm:px-1.5 md:px-2",
            right: "flex flex-col overflow-y-auto scrollbar-thin px-1 sm:px-1.5 md:px-2",
        };

        const isHorizontal = side === "top" || side === "bottom";

        return (
            <div
                ref={getRef(side)}
                className={containerStyles[side].className}
                style={containerStyles[side].style}
            >
                <div className={contentStyles[side]}>
                    {/* This wrapper centers the content while allowing full scrolling */}
                    <div
                        className={
                            isHorizontal ? "flex flex-row" : "flex flex-col"
                        }
                    >
                        {hotspots.map((hotspot) => {
                            // Create a temporary hotspot with dummy coordinates for rendering
                            const tempHotspot: IHotspotButton = {
                                ...hotspot,
                                coordinates: [0, 0], // These won't be used since we're positioning manually
                            };

                            return (
                                <div key={hotspot.id} className="flex-shrink-0">
                                    <Hotspot
                                        hotspot={tempHotspot}
                                        containerWidth={0}
                                        containerHeight={0}
                                        sideHotspot={true}
                                    />
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div
            ref={containerRef}
            className="relative w-full h-full overflow-hidden"
        >
            {isLoading && (
                <div className="absolute inset-0 flex items-center justify-center z-10">
                    <Spinner />
                </div>
            )}
            <div className="relative w-full h-full overflow-hidden">
                <img
                    ref={imageRef}
                    src={fullImageUrl}
                    className="absolute"
                    style={{
                        opacity: isLoading ? 0 : 1,
                        transition: "opacity 0.3s ease",
                    }}
                    onLoad={handleImageLoad}
                    onError={handleImageError}
                    alt="Exploration map"
                />
                {!isLoading && (
                    <div className="absolute inset-0">
                        {renderChildren()}
                        {renderSideHotspots("top")}
                        {renderSideHotspots("bottom")}
                        {renderSideHotspots("left")}
                        {renderSideHotspots("right")}
                    </div>
                )}
            </div>
        </div>
    );
};

// Simple Spinner component
const Spinner = () => (
    <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
);
