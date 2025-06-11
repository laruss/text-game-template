/**
 * Evaluates the given value if it is a function, otherwise returns the value as is.
 *
 * This utility function checks if the provided value is a function. If it is,
 * the function gets executed and its return value is used. If it is not a function,
 * the value itself is returned without modification.
 *
 * @template T
 * @param {T | (() => T)} value - The input value, which can be either a value of type T
 *                                or a function returning a value of type T.
 * @returns {T} - Returns the evaluated value if the input was a function, or the
 *                original value if it was not a function.
 */
export const evalIfFunction = <T>(value: T | (() => T)): T =>
    typeof value === "function" ? (value as () => T)() : value;
