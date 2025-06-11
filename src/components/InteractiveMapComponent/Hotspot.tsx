import { evalIfFunction } from "@app/utils";
import {
    MapImageHotspot,
    MapLabelHotspot,
} from "@engine/passages/interactiveMap";
import { Tooltip } from "@heroui/react";
import { useEffect, useRef } from "react";

import { ImageHotspot } from "./ImageHotspot";
import { LabelHotspot } from "./LabelHotspot";
import { ImagePositionInfo } from "./types";

type HotspotProps = {
    hotspot: MapImageHotspot | MapLabelHotspot;
    imagePositionInfo?: ImagePositionInfo;
};

export const Hotspot = ({ hotspot, imagePositionInfo }: HotspotProps) => {
    const hotspotRef = useRef<HTMLDivElement>(null);
    const tooltipContent = evalIfFunction(hotspot.tooltip?.content);

    // Position the hotspot based on percentage coordinates and image position info
    useEffect(() => {
        if (hotspotRef.current && imagePositionInfo) {
            const { x, y } = hotspot.position;
            const { offsetLeft, offsetTop, scaledWidth, scaledHeight } =
                imagePositionInfo;

            // Calculate position based on percentage of the scaled image
            // x and y are percentages (0-100), so we convert to 0-1 by dividing by 100
            const xPos =
                offsetLeft +
                ((typeof x === "number" ? x : x()) / 100) * scaledWidth;
            const yPos =
                offsetTop +
                ((typeof y === "number" ? y : y()) / 100) * scaledHeight;

            hotspotRef.current.style.left = `${xPos}px`;
            hotspotRef.current.style.top = `${yPos}px`;

            // Ensure transforms are applied
            hotspotRef.current.style.transform = "translate(-50%, -50%)";
        }
    }, [hotspot.position, imagePositionInfo]);

    return (
        <div ref={hotspotRef} className="absolute z-10">
            <Tooltip
                content={tooltipContent}
                placement={hotspot.tooltip?.position || "top"}
                isDisabled={!tooltipContent}
            >
                <div>
                    {hotspot.type === "image" ? (
                        <ImageHotspot hotspot={hotspot} />
                    ) : hotspot.type === "label" ? (
                        <LabelHotspot hotspot={hotspot} />
                    ) : (
                        <div>Unknown Hotspot Type</div>
                    )}
                </div>
            </Tooltip>
        </div>
    );
};
