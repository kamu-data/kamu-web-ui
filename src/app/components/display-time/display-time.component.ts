import { BasePropertyComponent } from "src/app/dataset-block/metadata-block/components/event-details/components/common/base-property/base-property.component";
import { ChangeDetectionStrategy, Component, Input } from "@angular/core";
import AppValues from "src/app/common/app.values";
import { format, formatDistanceStrict } from "date-fns";

@Component({
    selector: "app-display-time",
    templateUrl: "./display-time.component.html",
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DisplayTimeComponent extends BasePropertyComponent {
    @Input({ required: true }) public data: string;
    @Input() public class?: string;
    @Input() public dataTestId: string;

    public get relativeTime(): string {
        return this.dateTime(this.data);
    }

    public get formatTitle(): string {
        return format(this.data, AppValues.CRON_EXPRESSION_DATE_FORMAT);
    }

    private dateTime(rfc3339: string): string {
        return formatDistanceStrict(rfc3339, new Date(), {
            addSuffix: true,
        });
    }
}
