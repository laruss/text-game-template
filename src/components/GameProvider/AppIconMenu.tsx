import { options } from "@engine/options";
import { useCallback, useState } from "react";

export const AppIconMenu = () => {
    const [isHovered, setIsHovered] = useState(false);
    const [isDevMode, setIsDevMode] = useState(options.current.isDevMode);

    const toggleDevMode = useCallback(() => {
        options.set({ isDevMode: !isDevMode });
        setIsDevMode(!isDevMode);
    }, [isDevMode]);

    return (
        <div className="fixed bottom-3 left-2 z-10000000">
            <button
                className="cursor-pointer hover:opacity-50 active:scale-95 bg-primary p-2 rounded-full"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
            >
                <img src="/icon.svg" alt="Settings" width="24" height="24" />
            </button>
            {isHovered && (
                <div
                    className="absolute left-full bottom-0 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg p-3 whitespace-nowrap"
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                >
                    <label className="flex items-center gap-2 cursor-pointer">
                        <input
                            type="checkbox"
                            className="cursor-pointer"
                            checked={isDevMode}
                            onChange={toggleDevMode}
                        />
                        <span>Is dev mode</span>
                    </label>
                </div>
            )}
        </div>
    );
};
