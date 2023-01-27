import { AddData } from "./../../../../../../api/kamu.graphql.interface";
import {
    ChangeDetectionStrategy,
    Component,
    Input,
    OnInit,
} from "@angular/core";
import { BaseDynamicEventComponent } from "../base-dynamic-event/base-dynamic-event.component";
import { SECTION_BUILDERS_BY_EVENT_TYPE } from "../../dynamic-events/builders/event-section.builders";

@Component({
    selector: "app-add-data-event",
    templateUrl: "../base-dynamic-event/base-dynamic-event.component.html",
    styleUrls: ["../base-dynamic-event/base-dynamic-event.component.sass"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddDataEventComponent
    extends BaseDynamicEventComponent<AddData>
    implements OnInit
{
    @Input() public event: AddData;
    ngOnInit(): void {
        this.eventSections =
            SECTION_BUILDERS_BY_EVENT_TYPE.AddData.buildEventSections(
                this.event,
            );
        this.isShowYamlToggle = false;
    }
}
