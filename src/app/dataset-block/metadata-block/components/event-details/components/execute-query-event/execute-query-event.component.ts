import { ChangeDetectionStrategy, Component, OnInit } from "@angular/core";
import { ExecuteQuery } from "src/app/api/kamu.graphql.interface";
import { SECTION_BUILDERS_BY_EVENT_TYPE } from "../../dynamic-events/builders/event-section.builders";
import { BaseDynamicEventComponent } from "../base-dynamic-event/base-dynamic-event.component";

@Component({
    selector: "app-execute-query-event",
    templateUrl: "../base-dynamic-event/base-dynamic-event.component.html",
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExecuteQueryEventComponent extends BaseDynamicEventComponent<ExecuteQuery> implements OnInit {
    ngOnInit(): void {
        this.eventSections = SECTION_BUILDERS_BY_EVENT_TYPE.ExecuteQuery.buildEventSections(this.event);
    }
}
