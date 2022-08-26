import { MaybeNull } from "./app.types";

export class AppHelpers {

    public static requireValue<T>(input: MaybeNull<T>){
        if (input === null) throw Error("value is required!");
        return input;
    }
}
