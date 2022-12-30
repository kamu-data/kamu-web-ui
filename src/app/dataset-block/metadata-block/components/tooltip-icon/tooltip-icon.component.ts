import AppValues from "src/app/common/app.values";
import {
    ChangeDetectionStrategy,
    Component,
    Input,
    ViewEncapsulation,
} from "@angular/core";

@Component({
    selector: "app-tooltip-icon",
    templateUrl: "./tooltip-icon.component.html",
    styleUrls: ["./tooltip-icon.component.sass"],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TooltipIconComponent {
    @Input() public tooltip: string;
    public openDelay: number = AppValues.SHORT_DELAY_MS;
}
