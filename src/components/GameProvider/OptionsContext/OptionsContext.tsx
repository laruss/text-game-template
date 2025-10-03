import { createContext } from "react";

import { DEFAULT_OPTIONS } from "./constants";
import { OptionsContextType } from "./types";

export const OptionsContext =
    createContext<OptionsContextType>(DEFAULT_OPTIONS);
