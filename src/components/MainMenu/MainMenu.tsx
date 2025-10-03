import { useConfirmation } from "@components/ConfiramtionDialog";
import { useSaveLoadModal } from "@components/SaveLoadModal";
import { Game } from "@engine/game";

export const MainMenu = () => {
    const openSaveLoadModal = useSaveLoadModal();
    const openDialog = useConfirmation({ title: "THIS IS TEST" });

    return (
        <div>
            Main Menu
            <div className="flex flex-col">
                <button onClick={() => Game.jumpTo("testMap")}>New Game</button>
                <button>Continue</button>
                <button onClick={() => openSaveLoadModal({ isOnlyLoad: true })}>
                    Load Game
                </button>
                <button onClick={openDialog}>Test</button>
            </div>
        </div>
    );
};
