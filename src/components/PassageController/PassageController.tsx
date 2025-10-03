import { useCurrentPassage } from "@app/hooks";
import { InteractiveMapComponent } from "@components/InteractiveMapComponent";
import { MainMenu } from "@components/MainMenu";
import { StoryComponent } from "@components/StoryComponent";
import { InteractiveMap } from "@engine/passages/interactiveMap";
import { Story } from "@engine/passages/story";
import { AnimatePresence, motion } from "framer-motion";

export const PassageController = () => {
    const currentPassage = useCurrentPassage();

    const getKey = () => {
        if (!currentPassage) return "main-menu";
        return `${currentPassage.type}`;
    };

    const renderComponent = () => {
        if (!currentPassage) {
            return <MainMenu />;
        }

        switch (currentPassage.type) {
            case "story":
                return <StoryComponent story={currentPassage as Story} />;
            case "interactiveMap":
                return (
                    <InteractiveMapComponent
                        interactiveMap={currentPassage as InteractiveMap}
                    />
                );
            default:
                return <div>Unknown Passage Type {currentPassage.type}</div>;
        }
    };

    return (
        <AnimatePresence>
            <motion.div
                key={getKey()}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                style={{ width: "100%", height: "100%" }}
            >
                {renderComponent()}
            </motion.div>
        </AnimatePresence>
    );
};
