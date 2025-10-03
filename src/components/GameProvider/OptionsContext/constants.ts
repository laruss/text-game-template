import { OptionsContextType } from "./types";

export const DEFAULT_OPTIONS = {
    isDevMode: import.meta.env.DEV,
    setIsDevMode: () => {},
} as const satisfies OptionsContextType;
