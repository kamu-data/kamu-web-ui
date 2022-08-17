import { OnDestroy } from "@angular/core";
import { Subscription } from "rxjs";
import { SubSink } from "subsink";

export class UnsubscribeOnDestroyAdapter implements OnDestroy {
    private subs: SubSink = new SubSink();

    ngOnDestroy(): void {
        this.subs.unsubscribe();
    }

    protected trackSubscription(subscription: Subscription): void {
        this.subs.add(subscription);
    }

    protected trackSubscriptions(...subscriptions: Subscription[]): void {
        this.subs.add(...subscriptions);
    }
}
