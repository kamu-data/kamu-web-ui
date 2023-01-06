import { ChangeDetectionStrategy, Component } from "@angular/core";
import { BasePropertyComponent } from "../base-property/base-property.component";

@Component({
    selector: "app-separator-property",
    templateUrl: "./separator-property.component.html",
    styleUrls: ["./separator-property.component.sass"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SeparatorPropertyComponent extends BasePropertyComponent {
    public defaultSeparator = ",";
}
