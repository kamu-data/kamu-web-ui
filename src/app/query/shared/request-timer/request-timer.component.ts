/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    inject,
    Input,
    OnChanges,
    OnDestroy,
    OnInit,
    SimpleChanges,
} from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { filter, fromEvent } from "rxjs";
import { BaseComponent } from "src/app/common/components/base.component";
import { CancelRequestService } from "src/app/services/cancel-request.service";

@Component({
    selector: "app-request-timer",
    templateUrl: "./request-timer.component.html",
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
})
export class RequestTimerComponent extends BaseComponent implements OnChanges, OnDestroy, OnInit {
    @Input({ required: true }) public class: string;
    @Input({ required: true }) public sqlLoading: boolean = false;
    private mm: number = 0;
    private ss: number = 0;
    private ms: number = 0;
    private hh: number = 0;
    private isRunning: boolean = false;
    private timeout: NodeJS.Timeout;

    private cdr = inject(ChangeDetectorRef);
    private cancelRequestService = inject(CancelRequestService);
    private visibilityDocumentChange$ = fromEvent(document, "visibilitychange");

    public ngOnInit(): void {
        this.visibilityDocumentChange$
            .pipe(
                filter(() => document.visibilityState === "hidden"),
                takeUntilDestroyed(this.destroyRef),
            )
            .subscribe(() => {
                if (this.sqlLoading) {
                    this.stopTimer();
                    this.resetTimer();
                }
            });
    }

    public ngOnChanges(changes: SimpleChanges): void {
        if (changes.sqlLoading.currentValue) {
            this.resetTimer();
            this.runTimer();
        } else {
            this.stopTimer();
        }
    }

    public ngOnDestroy(): void {
        this.stopTimer();
        this.cancelRequestService.cancelRequest();
    }

    private runTimer() {
        if (!this.isRunning) {
            this.isRunning = true;
            this.timeout = setInterval(() => {
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
                this.cdr.detectChanges();
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
        clearInterval(this.timeout);
    }

    public get durationSqlRequest(): string {
        return `${this.format(this.hh)}:${this.format(this.mm)}:${this.format(this.ss)}.${this.format(this.ms)}`;
    }
}
