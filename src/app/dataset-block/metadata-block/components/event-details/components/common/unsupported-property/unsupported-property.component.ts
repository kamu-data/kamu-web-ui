import { ChangeDetectionStrategy, Component, Input } from "@angular/core";
import { BasePropertyComponent } from "../base-property/base-property.component";

@Component({
    selector: "app-unsupported-property",
    templateUrl: "./unsupported-property.component.html",
    styleUrls: ["./unsupported-property.component.sass"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UnsupportedPropertyComponent extends BasePropertyComponent {
    @Input() public data: unknown;
}
