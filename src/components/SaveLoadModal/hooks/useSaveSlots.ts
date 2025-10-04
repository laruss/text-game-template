import { GameSave, getAllSaves } from "@app/db";
import { useLiveQuery } from "dexie-react-hooks";

export const useSaveSlots = () => {
    const data = useLiveQuery(() => getAllSaves(), [], []) as
        | GameSave[]
        | undefined;

    return {
        isEmpty: data?.length === 0,
        isLoading: data === undefined,
        isError: false,
        error: null,
        data: data || [],
    };
};
