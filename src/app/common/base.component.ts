import { UnsubscribeOnDestroyAdapter } from "./unsubscribe.ondestroy.adapter";

export abstract class BaseComponent extends UnsubscribeOnDestroyAdapter {
    public get searchString(): string {
        return window.location.search;
    }
}
