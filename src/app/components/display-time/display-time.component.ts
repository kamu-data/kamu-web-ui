import { ChangeDetectionStrategy, Component, Input } from "@angular/core";
import moment from "moment";
import AppValues from "src/app/common/app.values";

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
        return this.convertToRelativeTime(this.value);
    }

    private dateTime(rfc3339: string): string {
        const dt = moment(rfc3339);
        return dt.format(AppValues.DISPLAY_DATE_FORMAT);
    }

    public convertToRelativeTime(
        rfc3339: string,
        threshold?: moment.argThresholdOpts,
    ): string {
        const dt = moment(rfc3339);
        const delta = moment.duration(dt.diff(moment()));
        if (threshold?.d) {
            if (Math.abs(delta.asDays()) >= threshold.d) {
                return this.dateTime(rfc3339);
            }
        }
        if (threshold?.w) {
            if (Math.abs(delta.asWeeks()) >= threshold.w) {
                return this.dateTime(rfc3339);
            }
        }
        return delta.humanize(true);
    }
}
