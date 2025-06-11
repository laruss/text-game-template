import { useGame } from "@client/app/context";
import { getImageUrl } from "@client/app/helpers";
import type { IExploration } from "@server/src/lib/schemas/exploration";
import { useEffect, useRef, useState } from "react";

import { Hotspot } from "./Hotspot";
import { HotspotMap } from "./HotspotMap";

export const Exploration = () => {
    const { game } = useGame();
    const mapContainerRef = useRef<HTMLDivElement>(null);

    // Extract exploration data from game state
    const explorationData = game?.uiSlots.main.type === "exploration"
        ? game.uiSlots.main.data as IExploration["data"]
        : undefined;

    // Update map dimensions when container size changes
    useEffect(() => {
        const currentRef = mapContainerRef.current;
        if (!currentRef) return;

        const updateDimensions = () => {
            const { width, height } = currentRef.getBoundingClientRect();
            setMapDimensions({ width, height });
        };

        updateDimensions();

        const resizeObserver = new ResizeObserver(updateDimensions);
        resizeObserver.observe(currentRef);

        return () => {
            resizeObserver.unobserve(currentRef);
        };
    }, []);

    if (!explorationData) {
        return null;
    }

    const { hotspotMap, background, hotspots, sideHotspots } = explorationData;

    // Handle background which can now be either a string or an object with src and opacity
    let backgroundImageUrl = "";
    let backgroundOpacity = 1;

    if (background) {
        if (typeof background === "string") {
            backgroundImageUrl = getImageUrl(background);
        } else {
            backgroundImageUrl = getImageUrl(background.src);
            backgroundOpacity = background.opacity;
        }
    }

    return (
        <div className="relative w-full h-full flex flex-col">
            {/* Main container with background if provided */}
            <div
                className="flex-grow relative overflow-hidden"
                style={{
                    position: "relative",
                }}
            >
                {/* Background image container */}
                {backgroundImageUrl && (
                    <div
                        className="absolute inset-0 z-0"
                        style={{
                            backgroundImage: `url(${backgroundImageUrl})`,
                            backgroundSize: "cover",
                            backgroundPosition: "center",
                            backgroundRepeat: "no-repeat",
                            opacity: backgroundOpacity,
                        }}
                    />
                )}

                {/* Hotspot map container */}
                <div
                    ref={mapContainerRef}
                    className="w-full h-full flex justify-center items-center relative z-10"
                >
                    <HotspotMap
                        imageUrl={hotspotMap}
                        sideHotspots={sideHotspots}
                    >
                        {hotspots.map((hotspot) => (
                            <Hotspot
                                key={hotspot.id}
                                hotspot={hotspot}
                            />
                        ))}
                    </HotspotMap>
                </div>
            </div>
        </div>
    );
};
