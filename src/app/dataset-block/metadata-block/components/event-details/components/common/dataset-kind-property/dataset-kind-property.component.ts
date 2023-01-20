import { ChangeDetectionStrategy, Component, Input } from "@angular/core";
import { BasePropertyComponent } from "../base-property/base-property.component";

@Component({
    selector: "app-dataset-kind-property",
    templateUrl: "./dataset-kind-property.component.html",
    styleUrls: ["./dataset-kind-property.component.sass"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DatasetKindPropertyComponent extends BasePropertyComponent {
    @Input() public data: string;

    public get kindDataset(): string {
        return this.data.slice(0, 1) + this.data.slice(1).toLowerCase();
    }
}
