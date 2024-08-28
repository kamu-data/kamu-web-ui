import { ChangeDetectionStrategy, Component, Input } from "@angular/core";
import { BasePropertyComponent } from "../base-property/base-property.component";

@Component({
    selector: "app-unsupported-property",
    templateUrl: "./unsupported-property.component.html",
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UnsupportedPropertyComponent extends BasePropertyComponent {
    @Input({ required: true }) public data: unknown;
}
