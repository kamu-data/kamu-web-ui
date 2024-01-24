import { ChangeDetectionStrategy, Component, OnInit } from "@angular/core";
import { ExecuteTransform } from "src/app/api/kamu.graphql.interface";
import { SECTION_BUILDERS_BY_EVENT_TYPE } from "../../dynamic-events/builders/event-section.builders";
import { BaseDynamicEventComponent } from "../base-dynamic-event/base-dynamic-event.component";

@Component({
    selector: "app-execute-transform-event",
    templateUrl: "../base-dynamic-event/base-dynamic-event.component.html",
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExecuteTransformEventComponent extends BaseDynamicEventComponent<ExecuteTransform> implements OnInit {
    ngOnInit(): void {
        this.eventSections = SECTION_BUILDERS_BY_EVENT_TYPE.ExecuteTransform.buildEventSections(this.event);
    }
}
