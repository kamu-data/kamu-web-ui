import { MaybeNull } from "../../../../../common/app.types";
import { ChangeDetectionStrategy, Component, Input, OnInit } from "@angular/core";
import { AbstractControl, FormControl, FormGroup, Validators } from "@angular/forms";
import { BaseComponent } from "../../../../../common/base.component";
import { PollingGroupEnum, ThrottlingGroupEnum } from "../../dataset-settings.model";
import {
    DatasetBasicsFragment,
    DatasetFlowType,
    DatasetKind,
    DatasetPermissionsFragment,
    ScheduleInput,
    TimeUnit,
} from "src/app/api/kamu.graphql.interface";
import { DatasetSchedulingService } from "../../services/dataset-scheduling.service";
import { cronExpressionValidator } from "src/app/common/data.helpers";
import { cronExpressionNextTime, logError } from "src/app/common/app.helpers";

@Component({
    selector: "app-dataset-settings-scheduling-tab",
    templateUrl: "./dataset-settings-scheduling-tab.component.html",
    styleUrls: ["./dataset-settings-scheduling-tab.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DatasetSettingsSchedulingTabComponent extends BaseComponent implements OnInit {
    @Input() public datasetBasics: DatasetBasicsFragment;
    @Input() public datasetPermissions: DatasetPermissionsFragment;
    public readonly pollingGroupEnum: typeof PollingGroupEnum = PollingGroupEnum;
    public readonly throttlingGroupEnum: typeof ThrottlingGroupEnum = ThrottlingGroupEnum;
    public readonly timeUnit: typeof TimeUnit = TimeUnit;
    private scheduleOptions: ScheduleInput;

    public pollingForm = new FormGroup({
        updatesState: new FormControl(false),
        pollingGroup: new FormGroup({
            __typename: new FormControl(PollingGroupEnum.TIME_DELTA, [Validators.required]),
            every: new FormControl({ value: null, disabled: true }, [Validators.required]),
            unit: new FormControl({ value: "", disabled: true }, [Validators.required]),
            cronExpression: new FormControl({ value: "", disabled: true }, [
                Validators.required,
                cronExpressionValidator(),
            ]),
        }),
    });

    public throttlingForm = new FormGroup({
        every: new FormControl({ value: 1, disabled: true }, [Validators.required]),
        unit: new FormControl({ value: TimeUnit.Minutes, disabled: true }, [Validators.required]),
        minimalDataBatch: new FormControl<MaybeNull<number>>({ value: null, disabled: true }),
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

    public get pollingType(): AbstractControl {
        return this.pollingGroup.controls.__typename;
    }

    public get batchingEveryTime(): AbstractControl {
        return this.throttlingForm.controls.every;
    }

    public get batchingUnitTime(): AbstractControl {
        return this.throttlingForm.controls.unit;
    }

    public get batchingMinimalDataBatch(): AbstractControl {
        return this.throttlingForm.controls.minimalDataBatch;
    }

    public get pollingEveryTime(): AbstractControl {
        return this.pollingGroup.controls.every;
    }

    public get pollingUnitTime(): AbstractControl {
        return this.pollingGroup.controls.unit;
    }

    public get cronExpression(): AbstractControl {
        return this.pollingGroup.controls.cronExpression;
    }

    public get nextTime(): string {
        return cronExpressionNextTime(this.cronExpression.value as string);
    }

    public ngOnInit() {
        if (!this.datasetPermissions.permissions.canSchedule) {
            this.pollingForm.disable();
        }
        this.checkStatusSection();
        this.pollingTypeChanges();
    }

    private pollingTypeChanges(): void {
        this.trackSubscriptions(
            this.pollingType.valueChanges.subscribe((value: PollingGroupEnum) => {
                switch (value) {
                    case PollingGroupEnum.TIME_DELTA: {
                        this.pollingEveryTime.enable();
                        this.pollingUnitTime.enable();
                        this.disableAndClearControl(this.cronExpression);
                        break;
                    }
                    case PollingGroupEnum.CRON_EXPRESSION: {
                        this.cronExpression.enable();
                        this.disableAndClearControl(this.pollingEveryTime);
                        this.disableAndClearControl(this.pollingUnitTime);
                        break;
                    }
                    default: {
                        logError("Unknown PollingGroupEnum key");
                    }
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
            this.trackSubscription(
                this.datasetSchedulingService
                    .fetchDatasetFlowConfigs(this.datasetBasics.id, DatasetFlowType.Ingest)
                    .subscribe((data) => {
                        const flowConfiguration = data.datasets.byId?.flows.configs.byType;
                        if (flowConfiguration?.schedule) {
                            this.pollingForm.patchValue({ updatesState: flowConfiguration.paused });
                            this.pollingGroup.patchValue({
                                ...flowConfiguration.schedule,
                            });
                        }
                    }),
            );
        } else {
            this.pollingGroup.disable();
            this.throttlingForm.enable();
            this.trackSubscription(
                this.datasetSchedulingService
                    .fetchDatasetFlowConfigs(this.datasetBasics.id, DatasetFlowType.ExecuteQuery)
                    .subscribe((data) => {
                        const flowConfiguration = data.datasets.byId?.flows.configs.byType;
                        if (flowConfiguration?.batching) {
                            const batchingConfig = flowConfiguration.batching;
                            this.pollingForm.patchValue({ updatesState: flowConfiguration.paused });
                            this.throttlingForm.patchValue({
                                ...batchingConfig.throttlingPeriod,
                                minimalDataBatch: batchingConfig.minimalDataBatch,
                            });
                        }
                    }),
            );
        }
    }

    public onSubmit(): void {
        if (this.datasetBasics.kind === DatasetKind.Root) {
            this.setScheduleOptions();
            this.trackSubscription(
                this.datasetSchedulingService
                    .setDatasetFlowSchedule({
                        datasetId: this.datasetBasics.id,
                        datasetFlowType: DatasetFlowType.Ingest,
                        paused: this.updateState.value as boolean,
                        schedule: this.scheduleOptions,
                    })
                    .subscribe(),
            );
        } else {
            this.trackSubscription(
                this.datasetSchedulingService
                    .setDatasetFlowBatching({
                        datasetId: this.datasetBasics.id,
                        datasetFlowType: DatasetFlowType.ExecuteQuery,
                        paused: this.updateState.value as boolean,
                        throttlingPeriod: {
                            every: this.batchingEveryTime.value as number,
                            unit: this.batchingUnitTime.value as TimeUnit,
                        },

                        minimalDataBatch: this.batchingMinimalDataBatch.value as number,
                    })
                    .subscribe(),
            );
        }
    }

    private setScheduleOptions(): void {
        if (this.pollingGroup.controls.__typename.value === PollingGroupEnum.TIME_DELTA) {
            this.scheduleOptions = {
                timeDelta: {
                    every: this.pollingEveryTime.value as number,
                    unit: this.pollingUnitTime.value as TimeUnit,
                },
            };
        }
        if (this.pollingGroup.controls.__typename.value === PollingGroupEnum.CRON_EXPRESSION) {
            this.scheduleOptions = {
                cronExpression: this.cronExpression.value as string,
            };
        }
    }
}
