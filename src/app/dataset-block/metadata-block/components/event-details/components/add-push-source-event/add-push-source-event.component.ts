import { ChangeDetectionStrategy, Component, OnInit } from "@angular/core";
import { AddPushSource } from "src/app/api/kamu.graphql.interface";
import { BaseDynamicEventComponent } from "../base-dynamic-event/base-dynamic-event.component";
import { SECTION_BUILDERS_BY_EVENT_TYPE } from "../../dynamic-events/builders/event-section.builders";

@Component({
    selector: "app-add-push-source-event",
    templateUrl: "../base-dynamic-event/base-dynamic-event.component.html",
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddPushSourceEventComponent extends BaseDynamicEventComponent<AddPushSource> implements OnInit {
    ngOnInit(): void {
        this.eventSections = SECTION_BUILDERS_BY_EVENT_TYPE.AddPushSource.buildEventSections(this.event);
    }
}
