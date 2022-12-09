import { ChangeDetectionStrategy, Component, Input } from "@angular/core";
import { DataHelpers } from "src/app/common/data.helpers";

@Component({
    selector: "app-display-time",
    templateUrl: "./display-time.component.html",
    styleUrls: ["./display-time.component.sass"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DisplayTimeComponent {
    @Input() public value: string;
    @Input() public class?: string;
    @Input() public dataTestId: string;

    get relativeTime(): string {
        return DataHelpers.relativeTime(this.value);
    }
}
