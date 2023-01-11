import { BasePropertyComponent } from "./../base-property/base-property.component";
import { ChangeDetectionStrategy, Component, Input } from "@angular/core";

@Component({
    selector: "app-simple-property",
    templateUrl: "./simple-property.component.html",
    styleUrls: ["./simple-property.component.sass"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SimplePropertyComponent extends BasePropertyComponent {
    @Input() public class?: string;
}
