import { SetTransform } from "./../../../../../../api/kamu.graphql.interface";
import { BaseDynamicEventComponent } from "../base-dynamic-event/base-dynamic-event.component";

import { ChangeDetectionStrategy, Component, OnInit } from "@angular/core";
import { FACTORIES_BY_EVENT_TYPE } from "../../factories.builders";

@Component({
    selector: "app-set-transform-event",
    templateUrl: "../base-dynamic-event/base-dynamic-event.component.html",
    styleUrls: ["../base-dynamic-event/base-dynamic-event.component.sass"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SetTransformEventComponent
    extends BaseDynamicEventComponent<SetTransform>
    implements OnInit
{
    ngOnInit(): void {
        this.eventSections =
            FACTORIES_BY_EVENT_TYPE.SetTransform.buildEventSections(this.event);
    }
}
