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

    public schedulingForm = new FormGroup({
        updatesState: new FormControl(false),
        pollingGroup: new FormGroup({
            pollingSource: new FormControl(null, [Validators.required]),
            timeDelta: new FormControl({ value: null, disabled: true }, [Validators.required]),
            timeSegment: new FormControl({ value: "", disabled: true }, [Validators.required]),
            cronExpression: new FormControl({ value: "0 0 * * * *", disabled: true }, [Validators.required]),
        }),
        throttlingGroup: new FormGroup({
            throttlingParameters: new FormControl(null, [Validators.required]),
            awaitFor: new FormControl<number | null>({ value: null, disabled: true }, [Validators.required]),
            awaitUntil: new FormControl<number | null>({ value: null, disabled: true }, [Validators.required]),
        }),
    });

    constructor(private datasetSchedulingService: DatasetSchedulingService) {
        super();
    }

    public get pollingGroup(): FormGroup {
        return this.schedulingForm.get("pollingGroup") as FormGroup;
    }

    public get updateState(): AbstractControl {
        return this.schedulingForm.controls.updatesState;
    }

    public get throttlingGroup(): FormGroup {
        return this.schedulingForm.get("throttlingGroup") as FormGroup;
    }

    public ngOnInit() {
        if (!this.datasetPermissions.permissions.canSchedule) {
            this.schedulingForm.disable();
        }
        this.checkStatusSection();
        const pollingSource = this.schedulingForm.get("pollingGroup.pollingSource") as AbstractControl;
        const timeDelta = this.schedulingForm.get("pollingGroup.timeDelta") as AbstractControl;
        const timeSegment = this.schedulingForm.get("pollingGroup.timeSegment") as AbstractControl;
        const cronExpression = this.schedulingForm.get("pollingGroup.cronExpression") as AbstractControl;
        const throttlingParameters = this.schedulingForm.get("throttlingGroup.throttlingParameters") as AbstractControl;
        const awaitFor = this.schedulingForm.get("throttlingGroup.awaitFor") as AbstractControl;
        const awaitUntil = this.schedulingForm.get("throttlingGroup.awaitUntil") as AbstractControl;

        this.trackSubscriptions(
            pollingSource.valueChanges.subscribe((value: PollingGroupEnum) => {
                if (value === PollingGroupEnum.TIME_DELTA) {
                    timeDelta.enable();
                    timeSegment.enable();

                    this.disableAndClearControl(cronExpression);
                }
                if (value === PollingGroupEnum.CRON_EXPRESSION) {
                    cronExpression.enable();

                    this.disableAndClearControl(timeDelta);
                    this.disableAndClearControl(timeSegment);
                }
            }),

            throttlingParameters.valueChanges.subscribe((value: ThrottlingGroupEnum) => {
                if (value === ThrottlingGroupEnum.AWAIT_FOR) {
                    awaitFor.enable();

                    this.disableAndClearControl(awaitUntil);
                }
                if (value === ThrottlingGroupEnum.AWAIT_UNTIL) {
                    awaitUntil.enable();

                    this.disableAndClearControl(awaitFor);
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
            this.throttlingGroup.disable();
            this.pollingGroup.enable();
        } else {
            this.pollingGroup.disable();
            this.throttlingGroup.enable();
        }
    }

    public onSubmit(): void {
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
    }

    private setScheduleOptions(): void {
        if (this.pollingGroup.controls.pollingSource.value === PollingGroupEnum.TIME_DELTA) {
            this.scheduleOptions = {
                timeDelta: {
                    every: this.pollingGroup.controls.timeDelta.value as number,
                    unit: this.pollingGroup.controls.timeSegment.value as TimeUnit,
                },
            };
        }
        if (this.pollingGroup.controls.pollingSource.value === PollingGroupEnum.CRON_EXPRESSION) {
            this.scheduleOptions = {
                cronExpression: this.pollingGroup.controls.cronExpression.value as string,
            };
        }
    }
}
