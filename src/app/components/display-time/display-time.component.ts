import { BasePropertyComponent } from "src/app/dataset-block/metadata-block/components/event-details/components/common/base-property/base-property.component";
import { ChangeDetectionStrategy, Component, Input } from "@angular/core";
import AppValues from "src/app/common/app.values";
import { format, formatDistance } from "date-fns";

@Component({
    selector: "app-display-time",
    templateUrl: "./display-time.component.html",
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DisplayTimeComponent extends BasePropertyComponent {
    @Input({ required: true }) public data: string;
    @Input() public class?: string;
    @Input() public dataTestId: string;

    get relativeTime(): string {
        return this.dateTime(this.data);
    }

    get formatTitle(): string {
        return format(this.data, AppValues.DISPLAY_TOOLTIP_DATE_FORMAT);
    }

    private dateTime(rfc3339: string): string {
        return formatDistance(rfc3339, new Date(), {
            addSuffix: true,
        });
    }
}
