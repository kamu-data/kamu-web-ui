import { ChangeDetectionStrategy, Component, Input } from "@angular/core";
import { BasePropertyComponent } from "../../../dataset-block/metadata-block/components/event-details/components/common/base-property/base-property.component";

@Component({
    selector: "app-yaml-event-viewer",
    templateUrl: "./yaml-event-viewer.component.html",
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class YamlEventViewerComponent extends BasePropertyComponent {
    @Input({ required: true }) public data: string;
}
