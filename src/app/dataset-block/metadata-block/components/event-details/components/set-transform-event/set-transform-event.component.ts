import { SetTransform } from "../../../../../../api/kamu.graphql.interface";
import { BaseDynamicEventComponent } from "../base-dynamic-event/base-dynamic-event.component";

import { ChangeDetectionStrategy, Component, OnInit } from "@angular/core";
import { SECTION_BUILDERS_BY_EVENT_TYPE } from "../../dynamic-events/builders/event-section.builders";

@Component({
    selector: "app-set-transform-event",
    templateUrl: "../base-dynamic-event/base-dynamic-event.component.html",
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SetTransformEventComponent extends BaseDynamicEventComponent<SetTransform> implements OnInit {
    ngOnInit(): void {
        this.eventSections = SECTION_BUILDERS_BY_EVENT_TYPE.SetTransform.buildEventSections(this.event);
    }
}
