import { ChangeDetectionStrategy, Component, Input, OnInit } from "@angular/core";
import { AbstractControl, FormControl, FormGroup, Validators } from "@angular/forms";
import { BaseComponent } from "../../../../../common/base.component";
import { PollingGroupEnum, ThrottlingGroupEnum } from "../../dataset-settings.model";
import {
    DatasetBasicsFragment,
    DatasetKind,
    DatasetPermissionsFragment,
    ScheduleInput,
    TimeUnit,
} from "src/app/api/kamu.graphql.interface";
import { DatasetSchedulingService } from "../../services/dataset-scheduling.service";
import { cronExpressionValidator } from "src/app/common/data.helpers";

@Component({
    selector: "app-scheduling",
    templateUrl: "./scheduling.component.html",
    styleUrls: ["./scheduling.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SchedulingComponent extends BaseComponent implements OnInit {
    @Input() public datasetBasics: DatasetBasicsFragment;
    @Input() public datasetPermissions: DatasetPermissionsFragment;
    public readonly pollingGroupEnum: typeof PollingGroupEnum = PollingGroupEnum;
    public readonly throttlingGroupEnum: typeof ThrottlingGroupEnum = ThrottlingGroupEnum;
    public readonly timeUnit: typeof TimeUnit = TimeUnit;
    private scheduleOptions: ScheduleInput;

    public pollingForm = new FormGroup({
        updatesState: new FormControl(false),
        pollingGroup: new FormGroup({
            pollingSource: new FormControl(PollingGroupEnum.TIME_DELTA, [Validators.required]),
            timeDelta: new FormControl({ value: null, disabled: true }, [Validators.required]),
            timeSegment: new FormControl({ value: "", disabled: true }, [Validators.required]),
            cronExpression: new FormControl({ value: "", disabled: true }, [
                Validators.required,
                cronExpressionValidator(),
            ]),
        }),
    });

    public throttlingForm = new FormGroup({
        timeDelta: new FormControl({ value: 1, disabled: true }, [Validators.required]),
        timeSegment: new FormControl({ value: TimeUnit.Minutes, disabled: true }, [Validators.required]),
        numberRecords: new FormControl({ value: null, disabled: true }),
    });

    constructor(private datasetSchedulingService: DatasetSchedulingService) {
        super();
    }

    public get pollingGroup(): FormGroup {
        return this.pollingForm.get("pollingGroup") as FormGroup;
    }

    public get updateState(): AbstractControl {
        return this.pollingForm.controls.updatesState;
    }

    public get pollingSource(): AbstractControl {
        return this.pollingGroup.controls.pollingSource;
    }

    public get batchingTimeDelta(): AbstractControl {
        return this.throttlingForm.controls.timeDelta;
    }

    public get batchingTimeSegment(): AbstractControl {
        return this.throttlingForm.controls.timeSegment;
    }

    public get batchingNumberRecords(): AbstractControl {
        return this.throttlingForm.controls.numberRecords;
    }

    public get pollingTimeDelta(): AbstractControl {
        return this.pollingGroup.controls.timeDelta;
    }

    public get pollingTimeSegment(): AbstractControl {
        return this.pollingGroup.controls.timeSegment;
    }

    public get cronExpression(): AbstractControl {
        return this.pollingGroup.controls.cronExpression;
    }

    public ngOnInit() {
        if (!this.datasetPermissions.permissions.canSchedule) {
            this.pollingForm.disable();
        }
        this.checkStatusSection();
        this.trackSubscriptions(
            this.pollingSource.valueChanges.subscribe((value: PollingGroupEnum) => {
                if (value === PollingGroupEnum.TIME_DELTA) {
                    this.pollingTimeDelta.enable();
                    this.pollingTimeSegment.enable();
                    this.disableAndClearControl(this.cronExpression);
                }
                if (value === PollingGroupEnum.CRON_EXPRESSION) {
                    this.cronExpression.enable();
                    this.disableAndClearControl(this.pollingTimeDelta);
                    this.disableAndClearControl(this.pollingTimeSegment);
                }
            }),
        );
    }

    private disableAndClearControl(control: AbstractControl): void {
        control.disable();
        control.markAsUntouched();
        control.markAsPristine();
    }

    private checkStatusSection(): void {
        if (this.datasetBasics.kind === DatasetKind.Root) {
            this.throttlingForm.disable();
            this.pollingGroup.enable();
            this.cronExpression.disable();
        } else {
            this.pollingGroup.disable();
            this.throttlingForm.enable();
        }
    }

    public onSubmit(): void {
        if (this.datasetBasics.kind === DatasetKind.Root) {
            this.setScheduleOptions();
            this.trackSubscription(
                this.datasetSchedulingService
                    .setConfigSchedule({
                        datasetId: this.datasetBasics.id,
                        paused: this.updateState.value as boolean,
                        schedule: this.scheduleOptions,
                    })
                    .subscribe(),
            );
        } else {
            this.trackSubscription(
                this.datasetSchedulingService
                    .setConfigBatching({
                        datasetId: this.datasetBasics.id,
                        paused: this.updateState.value as boolean,
                        throttlingPeriod: {
                            every: this.batchingTimeDelta.value as number,
                            unit: this.batchingTimeSegment.value as TimeUnit,
                        },

                        minimalDataBatch: this.batchingNumberRecords.value as number,
                    })
                    .subscribe(),
            );
        }
    }

    private setScheduleOptions(): void {
        if (this.pollingGroup.controls.pollingSource.value === PollingGroupEnum.TIME_DELTA) {
            this.scheduleOptions = {
                timeDelta: {
                    every: this.pollingTimeDelta.value as number,
                    unit: this.pollingTimeSegment.value as TimeUnit,
                },
            };
        }
        if (this.pollingGroup.controls.pollingSource.value === PollingGroupEnum.CRON_EXPRESSION) {
            this.scheduleOptions = {
                cronExpression: this.cronExpression.value as string,
            };
        }
    }
}
