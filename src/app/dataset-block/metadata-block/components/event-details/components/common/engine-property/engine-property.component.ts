import { ChangeDetectionStrategy, Component, Input } from "@angular/core";
import { DataHelpers } from "src/app/common/data.helpers";
import { EventPropertyLogo } from "../../../supported.events";
import { BasePropertyComponent } from "../base-property/base-property.component";

@Component({
    selector: "app-engine-property",
    templateUrl: "./engine-property.component.html",
    styleUrls: ["./engine-property.component.sass"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EnginePropertyComponent extends BasePropertyComponent {
    @Input() public data: string;

    public get descriptionEngine(): EventPropertyLogo {
        return DataHelpers.descriptionForEngine(this.data);
    }
}
