import { evalIfFunction } from "@app/utils";
import { LabelHotspot as LabelHotspotType, MapLabelHotspot } from "@engine/passages/interactiveMap";
import { Button } from "@heroui/react";

type LabelHotspotProps = {
    hotspot: MapLabelHotspot | LabelHotspotType;
};

export const LabelHotspot = ({ hotspot }: LabelHotspotProps) => {
    const content = evalIfFunction(hotspot.content);
    const isDisabled = evalIfFunction(hotspot.isDisabled);

    return (
        <div>
            <Button
                onPress={() => hotspot.action()}
                isDisabled={isDisabled}
                className={hotspot.props?.classNames?.button}
                variant={hotspot.props?.variant}
                color={hotspot.props?.color}
            >
                {content}
            </Button>
        </div>
    );
};
