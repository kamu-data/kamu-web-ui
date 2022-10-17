import { MaybeNull } from "./app.types";

export function requireValue<T>(input: MaybeNull<T>) {
    if (input === null) throw Error("value is required!");
    return input;
}

export function logError<T>(input: T) {
    console.error(input);
}

export function promiseWithCatch<T>(promise: Promise<T>): void {
    promise.catch((e) => logError(e));
}
