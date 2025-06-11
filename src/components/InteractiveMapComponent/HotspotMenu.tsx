import { ImagePositionInfo } from "@components/InteractiveMapComponent/types";
import { MapMenu } from "@engine/passages/interactiveMap";
import { useEffect, useMemo, useRef } from "react";
import { twMerge } from "tailwind-merge";
import { evalIfFunction } from "@app/utils";
import { Button, Tooltip } from "@heroui/react";

type Props = {
    menu: MapMenu;
    imagePositionInfo?: ImagePositionInfo;
};

export const HotspotMenu = ({ menu, imagePositionInfo }: Props) => {
    const menuRef = useRef<HTMLDivElement>(null);
    const items = useMemo(
        () =>
            menu.items
                .map((itemCallback) => itemCallback())
                .filter((item) => item !== undefined),
        [menu.items]
    );

    // Position the menu based on percentage coordinates and image position info
    useEffect(() => {
        if (menuRef.current && imagePositionInfo && items.length) {
            const { x, y } = menu.position;
            const { offsetLeft, offsetTop, scaledWidth, scaledHeight } =
                imagePositionInfo;

            // Calculate position based on percentage of the scaled image
            const xPos =
                offsetLeft + ((typeof x === "number" ? x : x()) / 100) * scaledWidth;
            const yPos =
                offsetTop + ((typeof y === "number" ? y : y()) / 100) * scaledHeight;

            menuRef.current.style.left = `${xPos}px`;
            menuRef.current.style.top = `${yPos}px`;
            menuRef.current.style.transform = "translate(-50%, -50%)";
        }
    }, [menu.position, imagePositionInfo, items.length]);

    if (items.length === 0) {
        return null; // Don't render the menu if there are no items
    }

    return (
        <div
            ref={menuRef}
            className={twMerge(
                "absolute z-10 flex gap-2 p-2 bg-primary-50/50 rounded-lg shadow-md this-is-test",
                menu.direction === "horizontal" ? "flex-row" : "flex-col",
            )}
        >
            {items.map((item, index) => {
                const tooltipContent = evalIfFunction(item.tooltip?.content);
                const isDisabled = evalIfFunction(item.isDisabled) || false;
                const content = evalIfFunction(item.content);

                return (
                    <Tooltip
                        key={index}
                        content={tooltipContent}
                        placement={item.tooltip?.position || "top"}
                        isDisabled={!tooltipContent}
                    >
                        <div>
                            <Button
                                className={item?.props?.classNames?.button}
                                variant={item?.props?.variant}
                                color={item?.props?.color}
                                isDisabled={isDisabled}
                                onPress={item.action}
                            >
                                {content}
                            </Button>
                        </div>
                    </Tooltip>
                );
            })}
        </div>
    );
};
