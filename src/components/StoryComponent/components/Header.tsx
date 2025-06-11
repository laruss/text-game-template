import { HeaderComponent, HeaderLevel } from "@engine/passages/story";
import { twMerge } from "tailwind-merge";

type Props = {
    component: HeaderComponent;
};

const headerMapper: Record<HeaderLevel, string> = {
    1: "text-4xl",
    2: "text-3xl",
    3: "text-2xl",
    4: "text-xl",
    5: "text-lg",
    6: "text-base text-bold",
};

export const Header = ({ component }: Props) => (
    <div
        className={twMerge(
            headerMapper[component.props?.level ?? 1],
            component.props?.className
        )}
    >
        {component.content}
    </div>
);
