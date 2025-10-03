import { ActionsComponent } from "@engine/passages/story";
import { Button, Tooltip } from "@heroui/react";
import { twMerge } from "tailwind-merge";

export const Actions = ({ component }: { component: ActionsComponent }) => (
    <div
        className={twMerge(
            "flex flex-wrap gap-2 justify-center items-center",
            component.props?.direction === "vertical" ? "flex-col" : "flex-row",
            component.props?.className
        )}
    >
        {component.content.map((action, index) => (
            <Tooltip
                key={index}
                isDisabled={!action.tooltip?.content}
                content={action.tooltip?.content}
                className={action.tooltip?.className}
                placement={action.tooltip?.position}
            >
                <div>
                    <Button
                        color={action.color}
                        variant={action.variant}
                        className={action.className}
                        isDisabled={action.isDisabled}
                        onPress={action.action}
                    >
                        {action.label}
                    </Button>
                </div>
            </Tooltip>
        ))}
    </div>
);
