import { MaybeNull } from "../../../../../common/app.types";
import { ChangeDetectionStrategy, Component, inject, Input, OnInit } from "@angular/core";
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
import { BatchingFormType, PollingFormType, PollingGroupType } from "./dataset-settings-scheduling-tab.component.types";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";

@Component({
    selector: "app-dataset-settings-scheduling-tab",
    templateUrl: "./dataset-settings-scheduling-tab.component.html",
    styleUrls: ["./dataset-settings-scheduling-tab.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DatasetSettingsSchedulingTabComponent extends BaseComponent implements OnInit {
    @Input({ required: true }) public datasetBasics: DatasetBasicsFragment;
    @Input({ required: true }) public datasetPermissions: DatasetPermissionsFragment;
    public readonly pollingGroupEnum: typeof PollingGroupEnum = PollingGroupEnum;
    public readonly throttlingGroupEnum: typeof ThrottlingGroupEnum = ThrottlingGroupEnum;
    public readonly timeUnit: typeof TimeUnit = TimeUnit;
    private scheduleOptions: IngestConditionInput;
    private everyTimeMapperValidators: Record<TimeUnit, ValidatorFn> = everyTimeMapperValidators;

    public pollingForm = new FormGroup<PollingFormType>({
        updatesState: new FormControl<boolean>(false, { nonNullable: true }),
        pollingGroup: new FormGroup<PollingGroupType>({
            __typename: new FormControl(PollingGroupEnum.TIME_DELTA, [Validators.required]),
            every: new FormControl<MaybeNull<number>>({ value: null, disabled: true }, [
                Validators.required,
                Validators.min(1),
            ]),
            unit: new FormControl<MaybeNull<TimeUnit>>({ value: null, disabled: true }, [Validators.required]),
            cronExpression: new FormControl<MaybeNull<string>>({ value: "", disabled: true }, [
                Validators.required,
                cronExpressionValidator(),
            ]),
            fetchUncacheable: new FormControl<boolean>(false, { nonNullable: true }),
        }),
    });

    public batchingForm = new FormGroup<BatchingFormType>({
        every: new FormControl<MaybeNull<number>>({ value: null, disabled: true }, [
            Validators.required,
            Validators.min(1),
        ]),
        unit: new FormControl<MaybeNull<TimeUnit>>({ value: null, disabled: true }, [Validators.required]),
        minRecordsToAwait: new FormControl<MaybeNull<number>>({ value: null, disabled: true }, [
            Validators.required,
            Validators.min(1),
        ]),
    });

    private datasetSchedulingService = inject(DatasetSchedulingService);

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
        this.pollingType.valueChanges.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((value: PollingGroupEnum) => {
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
        });
    }

    private setPollingEveryTimeValidator(): void {
        this.pollingUnitTime.valueChanges.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((data: TimeUnit) => {
            this.pollingEveryTime.setValidators([this.everyTimeMapperValidators[data], Validators.required]);
        });
    }

    private setBatchingEveryTimeValidator(): void {
        this.batchingUnitTime.valueChanges.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((data: TimeUnit) => {
            this.batchingEveryTime.setValidators([this.everyTimeMapperValidators[data], Validators.required]);
        });
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
            this.datasetSchedulingService
                .fetchDatasetFlowConfigs(this.datasetBasics.id, DatasetFlowType.Ingest)
                .pipe(takeUntilDestroyed(this.destroyRef))
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
                });
        } else {
            this.pollingGroup.disable();
            this.batchingForm.enable();
            this.datasetSchedulingService
                .fetchDatasetFlowConfigs(this.datasetBasics.id, DatasetFlowType.ExecuteTransform)
                .pipe(takeUntilDestroyed(this.destroyRef))
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
                });
        }
    }

    public onSubmit(): void {
        if (this.datasetBasics.kind === DatasetKind.Root) {
            this.setScheduleOptions();
            this.datasetSchedulingService
                .setDatasetFlowSchedule({
                    accountId: this.datasetBasics.owner.id,
                    datasetId: this.datasetBasics.id,
                    datasetFlowType: DatasetFlowType.Ingest,
                    paused: !(this.updateState.value as boolean),
                    ingest: this.scheduleOptions,
                    datasetInfo: {
                        accountName: this.datasetBasics.owner.accountName,
                        datasetName: this.datasetBasics.name,
                    },
                })
                .pipe(takeUntilDestroyed(this.destroyRef))
                .subscribe();
        } else {
            this.datasetSchedulingService
                .setDatasetFlowBatching({
                    accountId: this.datasetBasics.owner.id,
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
                .pipe(takeUntilDestroyed(this.destroyRef))
                .subscribe();
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
