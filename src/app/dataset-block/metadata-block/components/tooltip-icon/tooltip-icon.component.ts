import AppValues from "src/app/common/app.values";
import { ChangeDetectionStrategy, Component, Input } from "@angular/core";

@Component({
    selector: "app-tooltip-icon",
    templateUrl: "./tooltip-icon.component.html",
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TooltipIconComponent {
    @Input() public tooltip: string;
    public readonly OPEN_DELAY: number = AppValues.SHORT_DELAY_MS;
}
