import { ChangeDetectionStrategy, Component, Input } from "@angular/core";
import { BasePropertyComponent } from "../base-property/base-property.component";
import { DataHelpers } from "src/app/common/data.helpers";
@Component({
    selector: "app-order-property",
    templateUrl: "./order-property.component.html",
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrderPropertyComponent extends BasePropertyComponent {
    @Input() public data: string;

    public get order(): string {
        return DataHelpers.descriptionOrder(this.data);
    }
}
