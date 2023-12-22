import { ChangeDetectionStrategy, Component } from "@angular/core";
import { BaseComponent } from "src/app/common/base.component";

@Component({
    selector: "app-unsupported-event",
    templateUrl: "./unsupported-event.component.html",
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UnsupportedEventComponent extends BaseComponent {}
