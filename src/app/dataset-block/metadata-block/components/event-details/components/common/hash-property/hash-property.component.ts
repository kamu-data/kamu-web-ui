import { BasePropertyComponent } from "src/app/dataset-block/metadata-block/components/event-details/components/common/base-property/base-property.component";
import { ChangeDetectionStrategy, Component, Input } from "@angular/core";

@Component({
    selector: "app-hash-property",
    templateUrl: "./hash-property.component.html",
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HashPropertyComponent extends BasePropertyComponent {
    @Input({ required: true }) public data: string;
}
