import { UnsubscribeOnDestroyAdapter } from "./unsubscribe.ondestroy.adapter";

export abstract class BaseComponent extends UnsubscribeOnDestroyAdapter {
    constructor() {
        super();
    }

    public get searchString(): string {
        return window.location.search;
    }
}
