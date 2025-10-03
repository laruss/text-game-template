import { useGameEntity, useRestartGame } from "@app/hooks";
import { useGameIsStarted } from "@app/hooks/useGameIsStarted";
import { useSaveLoadModal } from "@components/SaveLoadModal";
import { environment } from "@game/entities/environment";
import { Activity } from "react";

export const Header = () => {
    const env = useGameEntity(environment);
    const isStarted = useGameIsStarted();
    const openSaveLoadModal = useSaveLoadModal();
    const restart = useRestartGame();

    return (
        <Activity mode={isStarted ? "visible" : "hidden"}>
            <header>
                <div className="w-full h-16 bg-gray-200 flex items-center justify-between px-4 shadow-md">
                    <div className="flex items-center gap-6">
                        <div>
                            <h1>Time:</h1>
                            {env.date.toDateString()}
                        </div>
                        <div>
                            <h1>Temperature:</h1>
                            {env.temperature}°C
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <button
                            className="p-2 hover:bg-gray-300 rounded transition-colors cursor-pointer"
                            onClick={() =>
                                openSaveLoadModal({ isOnlyLoad: false })
                            }
                            title="Save / Load Game"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 48 48"
                                className="w-8 h-8"
                            >
                                <path
                                    fill="#000"
                                    fillRule="evenodd"
                                    d="M35.28 4.88A3 3 0 0 0 33.16 4H7a3 3 0 0 0-3 3v34a3 3 0 0 0 3 3h34a3 3 0 0 0 3-3V14.89a3 3 0 0 0-.87-2.12l-7.85-7.89ZM7 6h6v9.95c0 1.13.92 2.05 2.05 2.05h17.9c1.13 0 2.05-.92 2.05-2.05V11.2a1 1 0 1 0-2 0v4.75c0 .03-.02.05-.05.05h-17.9a.05.05 0 0 1-.05-.05V6h18.16a1 1 0 0 1 .7.3l7.85 7.88a1 1 0 0 1 .29.7V41a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1Zm21 24.02a4 4 0 0 0-4-4 1 1 0 0 1 0-2 6 6 0 1 1-6 6 1 1 0 0 1 2 0 4 4 0 1 0 8 0Z"
                                    clipRule="evenodd"
                                />
                            </svg>
                        </button>
                        <button
                            className="p-2 hover:bg-gray-300 rounded transition-colors cursor-pointer"
                            onClick={restart}
                            title="Reload Game"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 32 32"
                                className="w-8 h-8"
                            >
                                <path d="M15.98 0c-8 0-14.5 6.5-14.5 14.5 0 7.51 5.79 13.8 13.24 14.44l-2.87 1.45c-.36.2-.57.64-.36.98l.1.26c.21.35.67.47 1.02.28l4.8-2.46h.01l.32-.18a.7.7 0 0 0 .27-.98l-.2-.31v-.02l-2.97-4.62a.77.77 0 0 0-1.02-.28l-.23.17c-.35.19-.38.69-.17 1.03l1.75 2.71h-.03A12.52 12.52 0 0 1 3.48 14.5a12.51 12.51 0 1 1 20.03 10 1 1 0 0 0 1.2 1.6c3.69-2.77 5.8-7 5.8-11.6 0-8-6.54-14.5-14.53-14.5z" />
                            </svg>
                        </button>
                    </div>
                    <div className="flex gap-2">
                        <button
                            className="px-3 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                            onClick={() => env.changeTemperature(-5)}
                        >
                            ❄️ -5°C
                        </button>
                        <button
                            className="px-3 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
                            onClick={() => env.changeTemperature(5)}
                        >
                            🔥 +5°C
                        </button>
                        <button
                            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
                            onClick={() => env.spendTime({ days: 1 })}
                        >
                            Spend time
                        </button>
                    </div>
                </div>
            </header>
        </Activity>
    );
};
