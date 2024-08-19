import { MaybeNull } from "../../../../../common/app.types";
import { ChangeDetectionStrategy, Component, Input, OnInit } from "@angular/core";
import { AbstractControl, FormControl, FormGroup, ValidatorFn, Validators } from "@angular/forms";
import { BaseComponent } from "../../../../../common/base.component";
import { PollingGroupEnum, ThrottlingGroupEnum } from "../../dataset-settings.model";
import {
    DatasetBasicsFragment,
    DatasetFlowType,
    DatasetKind,
    DatasetPermissionsFragment,
    IngestConditionInput,
    TimeUnit,
} from "src/app/api/kamu.graphql.interface";
import { DatasetSchedulingService } from "../../services/dataset-scheduling.service";
import { cronExpressionValidator, everyTimeMapperValidators } from "src/app/common/data.helpers";
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
    private scheduleOptions: IngestConditionInput;
    private everyTimeMapperValidators: Record<TimeUnit, ValidatorFn> = everyTimeMapperValidators;

    public pollingForm = new FormGroup({
        updatesState: new FormControl(false),
        pollingGroup: new FormGroup({
            __typename: new FormControl(PollingGroupEnum.TIME_DELTA, [Validators.required]),
            every: new FormControl<number | undefined>({ value: undefined, disabled: true }, [
                Validators.required,
                Validators.min(1),
            ]),
            unit: new FormControl<TimeUnit | undefined>({ value: undefined, disabled: true }, [Validators.required]),
            cronExpression: new FormControl<MaybeNull<string>>({ value: "", disabled: true }, [
                Validators.required,
                cronExpressionValidator(),
            ]),
            fetchUncacheable: new FormControl(false),
        }),
    });

    public batchingForm = new FormGroup({
        every: new FormControl<number | undefined>({ value: undefined, disabled: true }, [
            Validators.required,
            Validators.min(1),
        ]),
        unit: new FormControl<TimeUnit | undefined>({ value: undefined, disabled: true }, [Validators.required]),
        minRecordsToAwait: new FormControl<MaybeNull<number>>({ value: null, disabled: true }, [
            Validators.required,
            Validators.min(1),
        ]),
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

    public get pollingFetchUncacheable(): AbstractControl {
        return this.pollingGroup.controls.fetchUncacheable;
    }

    public get batchingEveryTime(): AbstractControl {
        return this.batchingForm.controls.every;
    }

    public get batchingUnitTime(): AbstractControl {
        return this.batchingForm.controls.unit;
    }

    public get batchingMinRecordsToAwait(): AbstractControl {
        return this.batchingForm.controls.minRecordsToAwait;
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
        } else {
            this.checkStatusSection();
            this.pollingTypeChanges();
            this.setPollingEveryTimeValidator();
            this.setBatchingEveryTimeValidator();
        }
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
                    case PollingGroupEnum.CRON_5_COMPONENT_EXPRESSION: {
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

    private setPollingEveryTimeValidator(): void {
        this.trackSubscription(
            this.pollingUnitTime.valueChanges.subscribe((data: TimeUnit) => {
                this.pollingEveryTime.setValidators([this.everyTimeMapperValidators[data], Validators.required]);
            }),
        );
    }

    private setBatchingEveryTimeValidator(): void {
        this.trackSubscription(
            this.batchingUnitTime.valueChanges.subscribe((data: TimeUnit) => {
                this.batchingEveryTime.setValidators([this.everyTimeMapperValidators[data], Validators.required]);
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
            this.batchingForm.disable();
            this.pollingGroup.enable();
            this.cronExpression.disable();
            this.trackSubscription(
                this.datasetSchedulingService
                    .fetchDatasetFlowConfigs(this.datasetBasics.id, DatasetFlowType.Ingest)
                    .subscribe((data) => {
                        const flowConfiguration = data.datasets.byId?.flows.configs.byType?.ingest;
                        const paused = data.datasets.byId?.flows.configs.byType?.paused;
                        if (flowConfiguration?.schedule) {
                            this.pollingForm.patchValue({ updatesState: !paused });
                            this.pollingGroup.patchValue({
                                ...flowConfiguration.schedule,
                            });
                            if (flowConfiguration.schedule.__typename === "Cron5ComponentExpression") {
                                this.pollingGroup.patchValue({
                                    // splice for sync with cron parser
                                    cronExpression: flowConfiguration.schedule.cron5ComponentExpression,
                                });
                            }
                        }
                    }),
            );
        } else {
            this.pollingGroup.disable();
            this.batchingForm.enable();
            this.trackSubscription(
                this.datasetSchedulingService
                    .fetchDatasetFlowConfigs(this.datasetBasics.id, DatasetFlowType.ExecuteTransform)
                    .subscribe((data) => {
                        const flowConfiguration = data.datasets.byId?.flows.configs.byType;
                        const paused = data.datasets.byId?.flows.configs.byType?.paused;
                        if (flowConfiguration?.transform) {
                            const batchingConfig = flowConfiguration.transform;
                            this.pollingForm.patchValue({ updatesState: !paused });
                            this.batchingForm.patchValue({
                                ...batchingConfig.maxBatchingInterval,
                                minRecordsToAwait: batchingConfig.minRecordsToAwait,
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
                        paused: !(this.updateState.value as boolean),
                        ingest: this.scheduleOptions,
                        datasetInfo: {
                            accountName: this.datasetBasics.owner.accountName,
                            datasetName: this.datasetBasics.name,
                        },
                    })
                    .subscribe(),
            );
        } else {
            this.trackSubscription(
                this.datasetSchedulingService
                    .setDatasetFlowBatching({
                        datasetId: this.datasetBasics.id,
                        datasetFlowType: DatasetFlowType.ExecuteTransform,
                        paused: !(this.updateState.value as boolean),
                        transform: {
                            minRecordsToAwait: this.batchingMinRecordsToAwait.value as number,
                            maxBatchingInterval: {
                                every: this.batchingEveryTime.value as number,
                                unit: this.batchingUnitTime.value as TimeUnit,
                            },
                        },
                        datasetInfo: {
                            accountName: this.datasetBasics.owner.accountName,
                            datasetName: this.datasetBasics.name,
                        },
                    })
                    .subscribe(),
            );
        }
    }

    private setScheduleOptions(): void {
        if (this.pollingGroup.controls.__typename.value === PollingGroupEnum.TIME_DELTA) {
            this.scheduleOptions = {
                schedule: {
                    timeDelta: {
                        every: this.pollingEveryTime.value as number,
                        unit: this.pollingUnitTime.value as TimeUnit,
                    },
                },
                fetchUncacheable: this.pollingFetchUncacheable.value as boolean,
            };
        }
        if (this.pollingGroup.controls.__typename.value === PollingGroupEnum.CRON_5_COMPONENT_EXPRESSION) {
            this.scheduleOptions = {
                schedule: {
                    // sync with server validator
                    cron5ComponentExpression: this.cronExpression.value as string,
                },
                fetchUncacheable: this.pollingFetchUncacheable.value as boolean,
            };
        }
    }
}
