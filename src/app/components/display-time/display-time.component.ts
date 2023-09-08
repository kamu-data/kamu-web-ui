import { BasePropertyComponent } from "src/app/dataset-block/metadata-block/components/event-details/components/common/base-property/base-property.component";
import { ChangeDetectionStrategy, Component, Input } from "@angular/core";
import moment from "moment";
import AppValues from "src/app/common/app.values";

@Component({
    selector: "app-display-time",
    templateUrl: "./display-time.component.html",
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DisplayTimeComponent extends BasePropertyComponent {
    @Input() public data: string;
    @Input() public class?: string;
    @Input() public threshold?: moment.argThresholdOpts;
    @Input() public dataTestId: string;

    get relativeTime(): string {
        return this.convertToRelativeTime(this.data, this.threshold);
    }

    get formatTitle(): string {
        return moment(this.data).format(AppValues.DISPLAY_TOOLTIP_DATE_FORMAT);
    }

    private dateTime(rfc3339: string): string {
        const dt = moment(rfc3339);
        return dt.format(AppValues.DISPLAY_DATE_FORMAT);
    }

    private convertToRelativeTime(rfc3339: string, threshold?: moment.argThresholdOpts): string {
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
