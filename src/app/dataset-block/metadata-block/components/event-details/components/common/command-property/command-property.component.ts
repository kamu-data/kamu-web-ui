import { ChangeDetectionStrategy, Component, Input } from "@angular/core";
import { BasePropertyComponent } from "../base-property/base-property.component";

@Component({
    selector: "app-command-property",
    templateUrl: "./command-property.component.html",
    styleUrls: ["./command-property.component.sass"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CommandPropertyComponent extends BasePropertyComponent {
    @Input() public data: string[];

    public get commands(): string {
        return this.data.join(" ");
    }
}
