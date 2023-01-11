import { ChangeDetectionStrategy, Component } from "@angular/core";
import { DataHelpers } from "src/app/common/data.helpers";
import { LogoInfo } from "../../../supported.events";
import { BasePropertyComponent } from "../base-property/base-property.component";

@Component({
    selector: "app-engine-property",
    templateUrl: "./engine-property.component.html",
    styleUrls: ["./engine-property.component.sass"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EnginePropertyComponent extends BasePropertyComponent {
    public get descriptionEngine(): LogoInfo {
        return DataHelpers.descriptionForEngine(this.data as string);
    }
}
