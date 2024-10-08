import { ChangeDetectionStrategy, Component, Input } from "@angular/core";
import { BasePropertyComponent } from "../base-property/base-property.component";

@Component({
    selector: "app-link-property",
    templateUrl: "./link-property.component.html",
    styleUrls: ["./link-property.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LinkPropertyComponent extends BasePropertyComponent {
    @Input({ required: true }) public data: string;
}
