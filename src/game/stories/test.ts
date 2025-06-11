import {
    newActions, newLine,
    newConversation,
    newHeader,
    newImage,
    newStory,
    newStoryAnchor,
    newText,
    newVideo,
} from "@engine/passages/story";

export const testStory = newStory("testStory", [
    newHeader({
        content: "Test Story",
        type: "header",
        props: { level: 1 },
    }),
    newText(
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
    ),
    newImage("living_room.png"),
    newVideo("bop19.mp4"),
    newActions({
        type: "actions",
        content: [
            {
                label: "Action 1",
                action: () => console.log("Action 1 executed"),
            },
            {
                label: "Action 2",
                action: () => console.log("Action 2 executed"),
                isDisabled: true,
                tooltip: {
                    content: "This action is disabled",
                    position: "top",
                    className: "bg-red-500 text-white",
                },
            },
        ],
    }),
    newStoryAnchor("anotherStory"),
]);

export const anotherStory = newStory("anotherStory", [
    newHeader({
        content: "Another Story",
        type: "header",
        props: { level: 2 },
    }),
    newText("This is another story with different content."),
    newConversation([
        newLine({ content: "Hello, this is a conversation line." }),
        newLine({
            content: "This is another line.",
            who: { name: "Character1" },
        }),
        newLine({
            content: "This is the third line.",
            who: { name: "Character2" },
            side: "right",
        }),
        newLine({
            content: "This is the fourth line.",
            who: { name: "Character1" },
            side: "left",
        }),
        newLine({
            content: "This is the fifth line.",
            who: { name: "NewCharacter", avatar: "https://avatar.iran.liara.run/public/12" },
            side: "right",
        }),
    ]),
]);
