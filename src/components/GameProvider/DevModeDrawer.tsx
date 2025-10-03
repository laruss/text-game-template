import { useCurrentPassage, useLocalStorage } from "@app/hooks";
import { Game } from "@engine/game";
import { FormEvent, useEffect, useState } from "react";

export const DevModeDrawer = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [passageToJumpTo, setPassageToJumpTo] = useState<string>("");
    const passage = useCurrentPassage();
    const [saveStateOnReload, setSaveStateOnReload] = useLocalStorage(
        "saveStateOnReload",
        true
    );

    const onJumpPassageSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (passageToJumpTo) {
            Game.jumpTo(passageToJumpTo);
            setPassageToJumpTo("");
        }
    };

    useEffect(() => {
        if (!saveStateOnReload) {
            console.log("Disabling autosave for this session");
            Game.disableAutoSave();
            Game.clearAutoSave();
        }
    }, [saveStateOnReload]);

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
                {/* Tongue/Handle */}
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="w-full py-2 px-6 flex justify-center items-center cursor-pointer bg-primary hover:bg-primary/20 rounded-t-lg"
                >
                    <div className="w-12 h-1 bg-gray-400 dark:bg-gray-500 rounded-full" />
                </button>

                {/* Content */}
                {isOpen && (
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
                                    <label
                                        htmlFor="current-state"
                                        className="text-sm"
                                    >
                                        Current state
                                    </label>
                                    <textarea
                                        id="current-state"
                                        disabled
                                        className="w-full h-30 bg-background/20 border border-gray-300 rounded px-2 text-sm text-primary/60 cursor-default resize-none"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
