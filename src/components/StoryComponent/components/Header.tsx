import { HeaderComponent, HeaderLevel } from "@engine/passages/story";
import { twMerge } from "tailwind-merge";

type Props = Readonly<{
    component: HeaderComponent;
}>;

const headerMapper = {
    1: "text-4xl",
    2: "text-3xl",
    3: "text-2xl",
    4: "text-xl",
    5: "text-lg",
    6: "text-base text-bold",
} as const satisfies Record<HeaderLevel, string>;

export const Header = ({ component: { props, content } }: Props) => (
    <div className={twMerge(headerMapper[props?.level ?? 1], props?.className)}>
        {content}
    </div>
);
