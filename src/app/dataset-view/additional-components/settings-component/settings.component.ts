import { ChangeDetectionStrategy, Component } from "@angular/core";
import { BaseComponent } from "src/app/common/base.component";

@Component({
    selector: "app-settings-tab",
    templateUrl: "./settings.component.html",
    styleUrls: ["./settings.component.sass"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SettingsTabComponent extends BaseComponent {}
