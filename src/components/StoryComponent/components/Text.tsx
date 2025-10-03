import { TextComponent } from "@engine/passages/story";
import { twMerge } from "tailwind-merge";

export const Text = ({ component }: { component: TextComponent }) => (
    <div
        className={twMerge(
            "text-base text-justify whitespace-pre-wrap",
            component.props?.className
        )}
    >
        {component.content}
    </div>
);
