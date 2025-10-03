import { useGameEntity } from "@app/hooks";
import { useGameIsStarted } from "@app/hooks/useGameIsStarted";
import { useSaveLoadModal } from "@components/SaveLoadModal";
import { environment } from "@game/entities/environment";
import { FaRegSave } from "react-icons/fa";

export const Header = () => {
    const env = useGameEntity(environment);
    const isStarted = useGameIsStarted();
    const openSaveLoadModal = useSaveLoadModal();

    return (
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
                    {isStarted && (
                        <FaRegSave
                            className="w-10 h-10 cursor-pointer"
                            onClick={() => openSaveLoadModal()}
                        />
                    )}
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
    );
};
