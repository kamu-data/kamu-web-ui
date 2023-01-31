import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    OnChanges,
} from "@angular/core";
import { ExecuteQuery } from "src/app/api/kamu.graphql.interface";
import { SECTION_BUILDERS_BY_EVENT_TYPE } from "../../dynamic-events/builders/event-section.builders";
import { BaseDynamicEventComponent } from "../base-dynamic-event/base-dynamic-event.component";

@Component({
    selector: "app-execute-query-event",
    templateUrl: "../base-dynamic-event/base-dynamic-event.component.html",
    styleUrls: ["../base-dynamic-event/base-dynamic-event.component.sass"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExecuteQueryEventComponent
    extends BaseDynamicEventComponent<ExecuteQuery>
    implements OnChanges
{
    constructor(cdr: ChangeDetectorRef) {
        super(cdr, false);
    }

    ngOnChanges(): void {
        this.eventSections =
            SECTION_BUILDERS_BY_EVENT_TYPE.ExecuteQuery.buildEventSections(
                this.event,
            );
    }
}
