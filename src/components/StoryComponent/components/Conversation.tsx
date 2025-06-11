import {
    ConversationBubble,
    ConversationBubbleSide,
    ConversationComponent,
    ConversationVariant,
} from "@engine/passages/story";
import { useEffect, useState } from "react";
import { twMerge } from "tailwind-merge";

const bubbleStyles = {
    chat: (side: ConversationBubbleSide) => ({
        base: `flex items-start gap-2 mb-3 ${side === 'left' ? 'justify-start' : 'justify-end'}`,
        content: `max-w-[80%] px-4 py-2 rounded-2xl ${
            side === 'left'
                ? 'bg-default-100 text-default-900 rounded-tl-sm'
                : 'bg-secondary-600 text-secondary-50 rounded-tr-sm'
        }`,
        avatar:
            `w-10 h-10 rounded-full overflow-hidden flex-shrink-0 ${side === 'left' ? 'order-first' : 'order-last'}`,
    }),
    messenger: (side: ConversationBubbleSide) => ({
        base: `flex items-end gap-2 my-4 ${side === 'left' ? 'justify-start' : 'justify-end'}`,
        content: `max-w-[70%] px-4 py-3 shadow-sm ${
            side === 'left'
                ? 'bg-white text-gray-800 rounded-t-2xl rounded-br-2xl rounded-bl-lg border border-gray-200'
                : 'bg-blue-500 text-white rounded-t-2xl rounded-bl-2xl rounded-br-lg'
        }`,
        avatar: `w-10 h-10 rounded-full overflow-hidden mb-1 ${side === 'left' ? 'order-first' : 'order-last'}`,
    }),
} as const;

type ConversationLineProps = {
    line: ConversationBubble;
    variant?: ConversationVariant;
    onClick?: () => void; // Optional click handler for interaction
};

const ConversationLine = ({ line, onClick, variant = "chat" }: ConversationLineProps) => {
    const classNames = bubbleStyles[variant](line.side || 'left');

    return (
        <div
            className={twMerge(classNames.base, line.props?.classNames?.base)}
            style={{ backgroundColor: line.color }}
            onClick={onClick}
        >
            <div className={twMerge(classNames.avatar, line.props?.classNames?.avatar)}>
                {line.who?.avatar ? (
                    <img
                        src={line.who.avatar}
                        alt={line.who.name || "Avatar"}
                        className="w-full h-full object-cover"
                    />
                ) : (
                    <div className="w-full h-full bg-gray-300 flex items-center justify-center">
                        {line.who?.name?.[0] || "?"}
                    </div>
                )}
            </div>
            <div className={twMerge(classNames.content, line.props?.classNames?.content)}>
                {line.content}
            </div>
        </div>
    );
};

export const Conversation = (
    { component }: { component: ConversationComponent }
) => {
    const [lines, setLines] = useState<Array<ConversationBubble>>([]);

    useEffect(() => {
        if (component.appearance === "byClick") {
            // If the conversation is set to appear by click, we can initialize it with an empty array
            setLines([]);
        } else {
            // If it appears at once, we can set all lines immediately
            setLines(component.content);
        }
    }, [component.appearance, component.content]);

    const onClick = () => {
        if (component.appearance === "byClick") {
            // If the conversation is set to appear by click, append the next line
            setLines((prevLines) => {
                const nextLine = component.content[prevLines.length];
                if (nextLine) {
                    return [...prevLines, nextLine];
                }
                return prevLines; // No more lines to add
            });
        }
        // If the appearance is "atOnce", we do not need to handle clicks
    };

    return (
        <div className={component.props?.className}>
            {lines.map((line, index) => (
                <ConversationLine key={index} onClick={onClick} line={line} />
            ))}
        </div>
    );
};
