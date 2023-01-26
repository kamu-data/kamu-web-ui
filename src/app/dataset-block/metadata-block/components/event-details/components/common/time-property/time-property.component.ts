import { ChangeDetectionStrategy, Component, Input } from "@angular/core";
import { BasePropertyComponent } from "../base-property/base-property.component";

@Component({
    selector: "app-time-property",
    templateUrl: "./time-property.component.html",
    styleUrls: ["./time-property.component.sass"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TimePropertyComponent extends BasePropertyComponent {
    @Input() public data: string;
}
