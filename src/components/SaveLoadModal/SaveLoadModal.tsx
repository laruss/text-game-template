import { Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, ScrollShadow, Tooltip } from "@heroui/react";
import { LuHardDriveDownload, LuHardDriveUpload } from "react-icons/lu";

import { useExportSaves, useImportSaves, useSaveLoadModalState, useSaveSlots } from "./hooks";
import { SaveSlot } from "./SaveSlot";

const slotCount = 9;

export const SaveLoadModal = () => {
    const exportSaves = useExportSaves();
    const importSaves = useImportSaves();

    const { isOpen, onOpenChange, options: { isOnlyLoad } } = useSaveLoadModalState();
    const slots = useSaveSlots();

    return (
        <Modal
            isOpen={isOpen}
            onOpenChange={onOpenChange}
            classNames={{
                wrapper: "overflow-hidden"
            }}
            size="4xl"
        >
            <ModalContent className="max-h-full">
                <ModalHeader className="flex flex-row items-center gap-10">
                    <div>
                        {isOnlyLoad ? "Load Game" : "Save/Load Game"}
                    </div>
                    <div className="flex gap-3">
                        <Tooltip content="Import Saves">
                            <LuHardDriveDownload
                                className="h-6 w-6 cursor-pointer hover:text-primary-500"
                                onClick={importSaves}
                            />
                        </Tooltip>
                        <Tooltip content="Export Saves">
                            <LuHardDriveUpload
                                className="h-6 w-6 cursor-pointer hover:text-primary-500"
                                onClick={exportSaves}
                            />
                        </Tooltip>
                    </div>
                </ModalHeader>
                <ModalBody
                    className="w-full flex items-center overflow-y-auto"
                >
                    <ScrollShadow className="w-full flex justify-center">
                        <div className="flex flex-row flex-wrap gap-4 p-4 max-w-160">
                            {Array.from({ length: slotCount }).map((_, index) => (
                                <SaveSlot
                                    key={index}
                                    index={index}
                                    slot={slots.data.find(slot => slot.name === index.toString())}
                                    isOnlyLoad={isOnlyLoad}
                                />
                            ))}
                        </div>
                    </ScrollShadow>
                </ModalBody>
                <ModalFooter/>
            </ModalContent>
        </Modal>
    );
};
