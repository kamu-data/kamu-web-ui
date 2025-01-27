import { DestroyRef, inject, Injectable } from "@angular/core";

@Injectable()
export class UnsubscribeDestroyRefAdapter {
    protected destroyRef = inject(DestroyRef);
}
