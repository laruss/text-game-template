import { useCurrentPassage } from "@app/hooks";
import { InteractiveMapComponent } from "@components/InteractiveMapComponent";
import { StoryComponent } from "@components/StoryComponent";
import { InteractiveMap } from "@engine/passages/interactiveMap";
import { Story } from "@engine/passages/story";
import { Widget } from "@engine/passages/widget";
import { AnimatePresence, motion } from "framer-motion";

export const PassageController = () => {
    const currentPassage = useCurrentPassage();

    const renderComponent = () => {
        switch (currentPassage?.type) {
            case "story":
                return <StoryComponent story={currentPassage as Story} />;
            case "interactiveMap":
                return (
                    <InteractiveMapComponent
                        interactiveMap={currentPassage as InteractiveMap}
                    />
                );
            case "widget":
                return (currentPassage as Widget).display();
            default:
                return <div>Unknown Passage Type {currentPassage?.type}</div>;
        }
    };

    if (!currentPassage) {
        return (
            <div className="flex items-center justify-center w-full h-full">
                <h1 className="text-2xl font-bold">NO PASSAGE SELECTED</h1>
            </div>
        );
    }

    return (
        <AnimatePresence>
            <motion.div
                key={currentPassage.type}
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
