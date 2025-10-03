import { VideoComponent } from "@engine/passages/story";
import { twMerge } from "tailwind-merge";

export const Video = ({ component }: { component: VideoComponent }) => (
    <video
        className={twMerge(
            "max-w-200 max-h-200 mx-auto",
            component.props?.className
        )}
        controls={component.props?.controls ?? false}
        autoPlay={component.props?.autoPlay ?? true}
        loop={component.props?.loop ?? true}
        muted={component.props?.muted ?? false}
    >
        <source src={component.content} />
        Your browser does not support the video tag.
    </video>
);
