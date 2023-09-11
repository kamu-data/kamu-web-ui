import { ChangeDetectionStrategy, Component, Input } from "@angular/core";
import { BasePropertyComponent } from "../base-property/base-property.component";
import { EventTimeSource } from "src/app/api/kamu.graphql.interface";

@Component({
    selector: "app-event-time-property",
    templateUrl: "./event-time-property.component.html",
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EventTimePropertyComponent extends BasePropertyComponent {
    @Input() public data: EventTimeSource;

    public get isFromMetadata(): boolean {
        return this.data.__typename === "EventTimeSourceFromMetadata";
    }

    public get isFromPath(): boolean {
        return this.data.__typename === "EventTimeSourceFromPath";
    }
}
