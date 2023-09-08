import { AddData } from "../../../../../../api/kamu.graphql.interface";
import { ChangeDetectionStrategy, Component, OnChanges, OnInit, SimpleChanges } from "@angular/core";
import { BaseDynamicEventComponent } from "../base-dynamic-event/base-dynamic-event.component";
import { SECTION_BUILDERS_BY_EVENT_TYPE } from "../../dynamic-events/builders/event-section.builders";

@Component({
    selector: "app-add-data-event",
    templateUrl: "../base-dynamic-event/base-dynamic-event.component.html",
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddDataEventComponent extends BaseDynamicEventComponent<AddData> implements OnChanges, OnInit {
    public ngOnChanges(changes: SimpleChanges): void {
        if (!changes.event.firstChange) {
            this.buildSections();
        }
    }

    public ngOnInit(): void {
        this.buildSections();
    }

    private buildSections(): void {
        this.eventSections = SECTION_BUILDERS_BY_EVENT_TYPE.AddData.buildEventSections(this.event);
    }
}
