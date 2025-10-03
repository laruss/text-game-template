import { useGetLastLoadGame } from "@app/hooks/useGetLastLoadGame";
import { useSaveLoadModal } from "@components/SaveLoadModal";
import { Game } from "@engine/game";
import { ButtonHTMLAttributes } from "react";

const MainMenuButton = (props: ButtonHTMLAttributes<HTMLButtonElement>) => {
    return (
        <button
            className="bg-primary-500 text-white px-4 py-2 rounded-md hover:bg-primary-600 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            {...props}
        />
    );
};

export const MainMenu = () => {
    const openSaveLoadModal = useSaveLoadModal();
    const { hasLastSave, loadLastGame } = useGetLastLoadGame();

    return (
        <div className="flex flex-col items-center justify-center h-full gap-8">
            <h1 className="text-4xl font-bold">Main Menu</h1>
            <div className="flex flex-col w-40 gap-4">
                <MainMenuButton onClick={() => Game.jumpTo("testMap")}>
                    New Game
                </MainMenuButton>
                <MainMenuButton disabled={!hasLastSave} onClick={loadLastGame}>
                    Continue
                </MainMenuButton>
                <MainMenuButton
                    onClick={() => openSaveLoadModal({ isOnlyLoad: true })}
                >
                    Load Game
                </MainMenuButton>
            </div>
        </div>
    );
};
