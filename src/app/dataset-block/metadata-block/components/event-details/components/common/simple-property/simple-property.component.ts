import { BasePropertyComponent } from "../base-property/base-property.component";
import { ChangeDetectionStrategy, Component, Input } from "@angular/core";

@Component({
    selector: "app-simple-property",
    templateUrl: "./simple-property.component.html",
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SimplePropertyComponent extends BasePropertyComponent {
    @Input({ required: true }) public data: string;
    @Input() public class?: string;
}
