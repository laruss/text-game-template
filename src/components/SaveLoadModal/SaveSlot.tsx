import { GameSave } from "@app/db";
import { getDateString } from "@components/SaveLoadModal/helpers";
import {
    Button,
    Card,
    CardBody,
    CardFooter,
    CardHeader,
    Tooltip,
} from "@heroui/react";
import { CiSaveDown2 } from "react-icons/ci";
import { IoCloseOutline } from "react-icons/io5";

import { useDeleteSlot, useLoadGame, useSaveGame } from "./hooks";

type SaveSlotProps = {
    index: number;
    slot?: GameSave;
    isOnlyLoad?: boolean;
};

export const SaveSlot = ({ index, slot, isOnlyLoad }: SaveSlotProps) => {
    const saveGameCallback = useSaveGame(index);
    const loadGameCallback = useLoadGame(slot?.id);
    const deleteGameCallback = useDeleteSlot(slot?.id);

    return (
        <div className="relative p-1">
            {slot && (
                <Tooltip content="Delete Save Slot">
                    <Button
                        variant="light"
                        isIconOnly
                        className="absolute z-20 top-1 right-1 rounded-full"
                        onPress={deleteGameCallback}
                    >
                        <IoCloseOutline className="w-8 h-8" />
                    </Button>
                </Tooltip>
            )}
            <Card className="h-48 w-46 overflow-hidden">
                <CardHeader />
                <CardBody className="overflow-hidden">
                    {slot ? (
                        <div className="flex flex-col">
                            <div className="text-lg font-semibold">
                                Slot {Number(slot.name) + 1}
                            </div>
                            <div className="text-sm text-gray-500">
                                Version: {slot.version}
                            </div>
                            <div className="text-sm text-gray-500 pt-2">
                                {getDateString(slot.timestamp)}
                            </div>
                        </div>
                    ) : (
                        <div className="text-center text-secondary-100 flex flex-col items-center justify-center h-full">
                            <CiSaveDown2 className="w-20 h-20" />
                            <span className="text-sm">Empty slot</span>
                        </div>
                    )}
                </CardBody>
                <CardFooter className="flex gap-1 justify-center">
                    {!isOnlyLoad && (
                        <Button className="w-full" onPress={saveGameCallback}>
                            Save
                        </Button>
                    )}
                    {slot && (
                        <Button className="w-full" onPress={loadGameCallback}>
                            Load
                        </Button>
                    )}
                </CardFooter>
            </Card>
        </div>
    );
};
