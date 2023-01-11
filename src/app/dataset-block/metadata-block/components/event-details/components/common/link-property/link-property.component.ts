import { ChangeDetectionStrategy, Component } from "@angular/core";
import { BasePropertyComponent } from "../base-property/base-property.component";

@Component({
    selector: "app-link-property",
    templateUrl: "./link-property.component.html",
    styleUrls: ["./link-property.component.sass"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LinkPropertyComponent extends BasePropertyComponent {}
