import { ChangeDetectionStrategy, Component, Input } from "@angular/core";
import { DataHelpers } from "src/app/common/helpers/data.helpers";
import { EventPropertyLogo } from "../../../supported.events";
import { BasePropertyComponent } from "../base-property/base-property.component";

@Component({
    selector: "app-merge-strategy-property",
    templateUrl: "./merge-strategy-property.component.html",
    styleUrls: ["./merge-strategy-property.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MergeStrategyPropertyComponent extends BasePropertyComponent {
    @Input({ required: true }) public data: string;

    public get descriptionMergeStrategy(): EventPropertyLogo {
        return DataHelpers.descriptionMergeStrategy(this.data);
    }
}
