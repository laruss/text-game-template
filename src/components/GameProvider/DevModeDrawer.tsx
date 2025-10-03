import { useCurrentPassage, useLocalStorage } from "@app/hooks";
import { useOptions } from "@components/GameProvider/OptionsContext";
import { Game } from "@engine/game";
import { Activity, FormEvent, useEffect, useState } from "react";

export const DevModeDrawer = () => {
    const { isDevMode } = useOptions();
    const [isOpen, setIsOpen] = useState(false);
    const [passageToJumpTo, setPassageToJumpTo] = useState<string>("");
    const passage = useCurrentPassage();
    const [saveStateOnReload, setSaveStateOnReload] = useLocalStorage(
        "saveStateOnReload",
        true
    );
    const [gameState, setGameState] = useState("");
    const [showRefreshed, setShowRefreshed] = useState(false);

    const onJumpPassageSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (passageToJumpTo) {
            Game.jumpTo(passageToJumpTo);
            setPassageToJumpTo("");
        }
    };

    const onReloadGameState = () => {
        const state = JSON.stringify(Game._getAllProxiedObjects(), null, 2);
        setGameState(state);
        setShowRefreshed(true);
        setTimeout(() => setShowRefreshed(false), 500);
    };

    useEffect(() => {
        if (isOpen) onReloadGameState();
    }, [isOpen]);

    useEffect(() => {
        if (!saveStateOnReload) {
            console.log("Disabling autosave for this session");
            Game.disableAutoSave();
            Game.clearAutoSave();
        }
    }, [saveStateOnReload]);

    if (!isDevMode) {
        return null;
    }

    return (
        <div className="fixed bottom-0 left-1/2 -translate-x-1/2 z-100000000">
            <div
                className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-t-lg shadow-lg transition-all duration-300"
                style={{
                    transform: isOpen
                        ? "translateY(0)"
                        : "translateY(calc(100% - 1rem))",
                    width: isOpen ? "600px" : "auto",
                }}
            >
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="w-full py-2 px-6 flex justify-center items-center cursor-pointer bg-primary hover:bg-primary/20 rounded-t-lg"
                >
                    <div className="w-12 h-1 bg-gray-400 dark:bg-gray-500 rounded-full" />
                </button>

                <Activity mode={isOpen ? "visible" : "hidden"}>
                    <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                        <h3 className="text-lg font-semibold mb-3">Dev Mode</h3>
                        <div className="space-y-2">
                            <div className="flex items-center flex-wrap gap-4">
                                <div className="flex items-center gap-2">
                                    <input
                                        type="checkbox"
                                        id="save-state-on-reload"
                                        checked={saveStateOnReload}
                                        onChange={(e) =>
                                            setSaveStateOnReload(
                                                e.target.checked
                                            )
                                        }
                                    />
                                    <label htmlFor="save-state-on-reload">
                                        Save state on reload
                                    </label>
                                </div>
                                <div className="flex items-center gap-2">
                                    <label htmlFor="current-passage-id">
                                        Current passage ID
                                    </label>
                                    <input
                                        id="current-passage-id"
                                        type="text"
                                        value={passage?.id || "none"}
                                        readOnly
                                        className="max-w-40 bg-background/20 border border-gray-300 rounded px-2 text-sm text-primary/60 cursor-default"
                                    />
                                </div>
                                <div>
                                    <form onSubmit={onJumpPassageSubmit}>
                                        <label
                                            htmlFor="jump-to-passage-id"
                                            className="mr-2"
                                        >
                                            Jump to passage ID:
                                        </label>
                                        <input
                                            id="jump-to-passage-id"
                                            type="text"
                                            value={passageToJumpTo}
                                            onChange={(e) =>
                                                setPassageToJumpTo(
                                                    e.target.value
                                                )
                                            }
                                            placeholder="Enter passage ID"
                                            className="bg-background/20 border border-gray-300 rounded px-2 text-sm text-primary"
                                        />
                                        <button
                                            type="submit"
                                            disabled={!passageToJumpTo}
                                            className="ml-2 bg-primary text-white px-2 rounded hover:bg-primary/80 transition-colors active:scale-95 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-primary disabled:active:scale-100"
                                        >
                                            Go
                                        </button>
                                    </form>
                                </div>
                                <div className="w-full">
                                    <div>
                                        <label
                                            htmlFor="current-state"
                                            className="text-sm"
                                        >
                                            Current state
                                        </label>
                                        <button
                                            className="ml-1 text-sm cursor-pointer"
                                            onClick={onReloadGameState}
                                        >
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                height={24}
                                                width={24}
                                                className="inline-block"
                                            >
                                                <path
                                                    fill="currentColor"
                                                    d="M4.4 12a.75.75 0 0 0 1.5 0H4.4Zm1.89-3.89.63.4-.63-.4Zm3.05-2.58-.3-.69.3.7Zm3.92-.4.15-.73-.15.73Zm3.47 1.92-.54.52.54-.52Zm.98 3.16a.75.75 0 0 0 1.45-.42l-1.45.42Zm0-.4a.75.75 0 1 0 1.45.38l-1.45-.38Zm2.16-2.35a.75.75 0 1 0-1.45-.38l1.45.38Zm-1.63 3.26a.75.75 0 0 0 .4-1.44l-.4 1.44Zm-2.25-2.17a.75.75 0 1 0-.4 1.44l.4-1.44Zm3.9 3.45a.75.75 0 1 0-1.5 0h1.5ZM18 15.89l-.63-.4.63.4Zm-3.04 2.58.29.69-.3-.7Zm-3.93.4-.15.73.15-.73Zm-3.47-1.92.54-.52-.54.52Zm-.98-3.16a.75.75 0 0 0-1.45.42l1.45-.42Zm0 .4a.75.75 0 1 0-1.45-.38l1.45.38Zm-2.16 2.35a.75.75 0 1 0 1.45.38l-1.45-.38Zm1.63-3.26a.75.75 0 0 0-.4 1.44l.4-1.44Zm2.25 2.18A.75.75 0 0 0 8.7 14l-.4 1.45ZM5.9 12a6.4 6.4 0 0 1 1.02-3.48L5.66 7.7A7.9 7.9 0 0 0 4.4 12h1.5Zm1.02-3.48a6.09 6.09 0 0 1 2.71-2.3l-.6-1.38a7.59 7.59 0 0 0-3.37 2.87l1.26.8Zm2.71-2.3c1.1-.47 2.3-.59 3.48-.35l.3-1.47a7.35 7.35 0 0 0-4.37.44l.59 1.38Zm3.47-.35c1.18.24 2.26.84 3.09 1.7l1.08-1.04a7.48 7.48 0 0 0-3.86-2.13l-.3 1.47Zm3.1 1.7a6.3 6.3 0 0 1 1.51 2.64l1.45-.42a7.8 7.8 0 0 0-1.9-3.26L16.2 7.57Zm2.96 2.62.71-2.73-1.45-.38-.71 2.73 1.45.38Zm-.53-.91L16 8.55l-.4 1.44 2.65.73.4-1.44ZM18.4 12a6.4 6.4 0 0 1-1.03 3.48l1.26.82A7.9 7.9 0 0 0 19.9 12h-1.5Zm-1.03 3.48a6.09 6.09 0 0 1-2.71 2.3l.6 1.38a7.59 7.59 0 0 0 3.37-2.86l-1.26-.82Zm-2.71 2.3c-1.1.47-2.3.6-3.48.35l-.3 1.47c1.47.3 3 .15 4.37-.44l-.59-1.38Zm-3.47.35a5.98 5.98 0 0 1-3.09-1.7l-1.08 1.04a7.47 7.47 0 0 0 3.86 2.13l.3-1.47Zm-3.1-1.7a6.3 6.3 0 0 1-1.51-2.64l-1.45.42a7.8 7.8 0 0 0 1.9 3.26l1.07-1.04ZM5.14 13.8l-.71 2.73 1.45.38.71-2.73-1.45-.38Zm.53.91 2.64.74.4-1.45-2.65-.73-.4 1.44Z"
                                                />
                                            </svg>
                                        </button>
                                        {showRefreshed && (
                                            <span className="ml-2 text-xs text-green-600 dark:text-green-400">
                                                refreshed
                                            </span>
                                        )}
                                    </div>
                                    <textarea
                                        id="current-state"
                                        disabled
                                        className="w-full h-30 bg-background/20 border border-gray-300 rounded px-2 text-sm text-primary/60 cursor-default resize-none"
                                        value={gameState}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </Activity>
            </div>
        </div>
    );
};
