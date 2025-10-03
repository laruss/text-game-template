import { evalIfFunction } from "@app/utils";
import { ImageHotspot } from "@components/InteractiveMapComponent/ImageHotspot";
import { LabelHotspot } from "@components/InteractiveMapComponent/LabelHotspot";
import {
    SideImageHotspot,
    SideLabelHotspot,
} from "@engine/passages/interactiveMap";
import { Tooltip } from "@heroui/react";

type Props = {
    hotspot: SideLabelHotspot | SideImageHotspot;
};

export const SideHotspot = ({ hotspot }: Props) => {
    const tooltipContent = evalIfFunction(hotspot.tooltip?.content);

    return (
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
    );
};
