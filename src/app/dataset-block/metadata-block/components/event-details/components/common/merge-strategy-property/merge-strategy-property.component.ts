import { ChangeDetectionStrategy, Component } from "@angular/core";
import { DataHelpers } from "src/app/common/data.helpers";
import { LogoInfo } from "../../../supported.events";
import { BasePropertyComponent } from "../base-property/base-property.component";

@Component({
    selector: "app-merge-strategy-property",
    templateUrl: "./merge-strategy-property.component.html",
    styleUrls: ["./merge-strategy-property.component.sass"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MergeStrategyPropertyComponent extends BasePropertyComponent {
    public get descriptionMergeStrategy(): LogoInfo {
        return DataHelpers.descriptionMergeStrategy(this.data as string);
    }
}
