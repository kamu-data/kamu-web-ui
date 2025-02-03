import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    inject,
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
    private cdr = inject(ChangeDetectorRef);

    public ngOnDestroy(): void {
        this.stopTimer();
    }
    public ngOnChanges(changes: SimpleChanges): void {
        if (changes.sqlLoading.currentValue) {
            this.resetTimer();
            this.runTimer();
        } else {
            this.stopTimer();
        }
    }
    @Input({ required: true }) public class: string;
    @Input({ required: true }) public sqlLoading: boolean = false;

    private mm: number = 0;
    private ss: number = 0;
    private ms: number = 0;
    private hh: number = 0;
    private isRunning: boolean = false;
    private timerId: NodeJS.Timer;

    private runTimer() {
        if (!this.isRunning) {
            this.isRunning = true;
            this.timerId = setInterval(() => {
                this.ms++;
                if (this.ms >= 100) {
                    this.ss++;
                    this.ms = 0;
                }
                if (this.ss >= 60) {
                    this.mm++;
                    this.ss = 0;
                }
                if (this.mm >= 60) {
                    this.hh++;
                    this.mm = 0;
                }
                this.cdr.markForCheck();
            }, 10);
        }
    }

    private format(num: number): string {
        return (num + "").length === 1 ? "0" + num : num + "";
    }

    private resetTimer(): void {
        this.mm = 0;
        this.ss = 0;
        this.ms = 0;
        this.hh = 0;
    }

    private stopTimer(): void {
        this.isRunning = false;
        clearInterval(this.timerId);
    }

    public get durationSqlRequest(): string {
        return `${this.format(this.hh)}:${this.format(this.mm)}:${this.format(this.ss)}.${this.format(this.ms)}`;
    }
}
