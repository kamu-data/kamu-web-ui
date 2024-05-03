import { ChangeDetectionStrategy, Component, Input } from "@angular/core";

@Component({
    selector: "app-request-timer",
    templateUrl: "./request-timer.component.html",
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RequestTimerComponent {
    @Input() public class: string;
    @Input() public resultTime: number;

    private format(num: number): string {
        return (num + "").length === 1 ? "0" + num : num + "";
    }

    public durationSqlRequest(value: number): string {
        if (value > 0) {
            const ms = value % 1000;
            const ss = Math.floor((value / 1000) % 60);
            const mm = Math.floor((value / (60 * 1000)) % 60);
            const hh = Math.floor((value / (3600 * 1000)) % 3600);
            return `${this.format(hh)}:${this.format(mm)}:${this.format(ss)}.${this.format(ms)}`;
        } else {
            return "00:00:00.000";
        }
    }
}
