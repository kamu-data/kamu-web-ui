import { ChangeDetectionStrategy, Component, Input } from "@angular/core";
import { BasePropertyComponent } from "../base-property/base-property.component";

@Component({
    selector: "app-cards-property",
    templateUrl: "./cards-property.component.html",
    styleUrls: ["./cards-property.component.sass"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CardsPropertyComponent extends BasePropertyComponent {
    @Input() public data: string[];
}
