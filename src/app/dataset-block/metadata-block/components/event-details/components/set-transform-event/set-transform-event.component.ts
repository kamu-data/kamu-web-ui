import { BaseEventComponent } from "./../base-event/base-event.component";

import { ChangeDetectionStrategy, Component, OnInit } from "@angular/core";
import { FACTORIES_BY_EVENT_TYPE } from "../../builder.events";

@Component({
    selector: "app-set-transform-event",
    templateUrl: "../base-event/base-event.component.html",
    styleUrls: ["../base-event/base-event.component.sass"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SetTransformEventComponent
    extends BaseEventComponent
    implements OnInit
{
    ngOnInit(): void {
        this.eventSections =
            FACTORIES_BY_EVENT_TYPE.SetTransform.buildEventSections(this.event);
    }
}
