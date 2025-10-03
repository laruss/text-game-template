export type Options = {
    isDevMode: boolean;
};

export const defaultOptions = {
    isDevMode: false,
};

export const options = {
    current: { ...defaultOptions } as Options,
    set: (newOptions: Partial<Options>) => {
        options.current = { ...options.current, ...newOptions };
    },
};
