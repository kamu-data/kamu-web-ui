import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    Input,
    OnChanges,
    OnDestroy,
    SimpleChanges,
} from "@angular/core";

@Component({
    selector: "app-request-timer",
    templateUrl: "./request-timer.component.html",
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RequestTimerComponent implements OnChanges, OnDestroy {
    @Input() public start: boolean;
    @Input() public class: string;
    private timerId: NodeJS.Timer;
    private startTime: Date;
    private currentTime: Date;
    public result: number;

    constructor(private cdr: ChangeDetectorRef) {}

    public ngOnDestroy(): void {
        this.stopTimer();
    }

    public ngOnChanges(changes: SimpleChanges): void {
        if (changes["start"].currentValue) {
            this.runTimer();
        } else {
            this.stopTimer();
        }
    }

    private runTimer() {
        this.startTime = new Date();
        this.timerId = setInterval(() => {
            this.currentTime = new Date();
            this.result = this.currentTime.valueOf() - this.startTime.valueOf();
            this.cdr.markForCheck();
        }, 10);
    }

    private format(num: number): string {
        return (num + "").length === 1 ? "0" + num : num + "";
    }

    private stopTimer(): void {
        clearInterval(this.timerId);
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
