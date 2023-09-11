import { ChangeDetectionStrategy, Component, Input } from "@angular/core";
import { BasePropertyComponent } from "../base-property/base-property.component";

@Component({
    selector: "app-separator-property",
    templateUrl: "./separator-property.component.html",
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SeparatorPropertyComponent extends BasePropertyComponent {
    @Input() public data: string;
    public defaultSeparator = ",";
}
