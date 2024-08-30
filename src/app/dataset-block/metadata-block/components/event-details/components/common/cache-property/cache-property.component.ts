import { ChangeDetectionStrategy, Component, Input } from "@angular/core";
import { BasePropertyComponent } from "../base-property/base-property.component";

@Component({
    selector: "app-cache-property",
    templateUrl: "./cache-property.component.html",
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CachePropertyComponent extends BasePropertyComponent {
    @Input({ required: true }) public data: string;
}
