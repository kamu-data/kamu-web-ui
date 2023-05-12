import { BasePropertyComponent } from "src/app/dataset-block/metadata-block/components/event-details/components/common/base-property/base-property.component";
import { ChangeDetectionStrategy, Component, Input } from "@angular/core";
import { DataHelpers } from "src/app/common/data.helpers";

@Component({
    selector: "app-step-type-property",
    templateUrl: "./step-type-property.component.html",
    styleUrls: ["./step-type-property.component.sass"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StepTypePropertyComponent extends BasePropertyComponent {
    @Input() public data: string;

    public get type(): string {
        return DataHelpers.descriptionSetPollingSourceSteps(this.data);
    }
}
