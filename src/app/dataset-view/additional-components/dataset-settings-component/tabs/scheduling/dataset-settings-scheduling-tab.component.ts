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
    FlowTriggerInput,
    GetDatasetFlowConfigsQuery,
    GetDatasetFlowTriggersQuery,
    IngestConditionInput,
    TimeUnit,
} from "src/app/api/kamu.graphql.interface";
import { DatasetSchedulingService } from "../../services/dataset-scheduling.service";
import { cronExpressionValidator, everyTimeMapperValidators } from "src/app/common/data.helpers";
import { cronExpressionNextTime, logError } from "src/app/common/app.helpers";
import {
    BatchingFormType,
    IngestConfigurationFormType,
    PollingGroupType,
} from "./dataset-settings-scheduling-tab.component.types";
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
    private everyTimeMapperValidators: Record<TimeUnit, ValidatorFn> = everyTimeMapperValidators;

    public ingestConfigurationForm = new FormGroup<IngestConfigurationFormType>({
        fetchUncacheable: new FormControl<boolean>(false, { nonNullable: true }),
    });

    public pollingForm = new FormGroup<PollingGroupType>({
        updatesState: new FormControl<boolean>(false, { nonNullable: true }),
        __typename: new FormControl(PollingGroupEnum.TIME_DELTA, [Validators.required]),
        every: new FormControl<MaybeNull<number>>({ value: null, disabled: false }, [
            Validators.required,
            Validators.min(1),
        ]),
        unit: new FormControl<MaybeNull<TimeUnit>>({ value: null, disabled: false }, [Validators.required]),
        cronExpression: new FormControl<MaybeNull<string>>({ value: "", disabled: true }, [
            Validators.required,
            cronExpressionValidator(),
        ]),
    });

    public batchingForm = new FormGroup<BatchingFormType>({
        updatesState: new FormControl<boolean>(false, { nonNullable: true }),
        every: new FormControl<MaybeNull<number>>({ value: null, disabled: false }, [
            Validators.required,
            Validators.min(1),
        ]),
        unit: new FormControl<MaybeNull<TimeUnit>>({ value: null, disabled: false }, [Validators.required]),
        minRecordsToAwait: new FormControl<MaybeNull<number>>({ value: null, disabled: false }, [
            Validators.required,
            Validators.min(1),
        ]),
    });

    private datasetSchedulingService = inject(DatasetSchedulingService);

    public get pollingType(): AbstractControl {
        return this.pollingForm.controls.__typename;
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

    public get batchingUpdateState(): AbstractControl {
        return this.batchingForm.controls.updatesState;
    }

    public get pollingEveryTime(): AbstractControl {
        return this.pollingForm.controls.every;
    }

    public get pollingUnitTime(): AbstractControl {
        return this.pollingForm.controls.unit;
    }

    public get cronExpression(): AbstractControl {
        return this.pollingForm.controls.cronExpression;
    }

    public get nextTime(): string {
        return cronExpressionNextTime(this.cronExpression.value as string);
    }

    public get isRootDataset(): boolean {
        return this.datasetBasics.kind === DatasetKind.Root;
    }

    public get fetchUncacheable(): FormControl<boolean> {
        return this.ingestConfigurationForm.controls.fetchUncacheable;
    }

    public get pollingUpdateState(): AbstractControl {
        return this.pollingForm.controls.updatesState;
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

    public saveIngestConfiguration(): void {
        this.datasetSchedulingService
            .setDatasetFlowConfigs({
                datasetId: this.datasetBasics.id,
                datasetFlowType: DatasetFlowType.Ingest,
                configInput: {
                    ingest: {
                        fetchUncacheable: this.fetchUncacheable.value,
                    },
                },
            })
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe();
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
            if (data) {
                this.pollingEveryTime.setValidators([this.everyTimeMapperValidators[data], Validators.required]);
            }
        });
    }

    private setBatchingEveryTimeValidator(): void {
        this.batchingUnitTime.valueChanges.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((data: TimeUnit) => {
            if (data) {
                this.batchingEveryTime.setValidators([this.everyTimeMapperValidators[data], Validators.required]);
            }
        });
    }

    private disableAndClearControl(control: AbstractControl): void {
        control.disable();
        control.markAsUntouched();
        control.markAsPristine();
    }

    private checkStatusSection(): void {
        if (this.datasetBasics.kind === DatasetKind.Root) {
            //   this.cronExpression.disable();
            //Init configs
            this.datasetSchedulingService
                .fetchDatasetFlowConfigs(this.datasetBasics.id, DatasetFlowType.Ingest)
                .pipe(takeUntilDestroyed(this.destroyRef))
                .subscribe((data: GetDatasetFlowConfigsQuery) => {
                    const flowConfiguration = data.datasets.byId?.flows.configs.byType?.ingest;
                    this.ingestConfigurationForm.patchValue({ fetchUncacheable: flowConfiguration?.fetchUncacheable });
                });
            //Init triggers
            this.datasetSchedulingService
                .fetchDatasetFlowTriggers(this.datasetBasics.id, DatasetFlowType.Ingest)
                .pipe(takeUntilDestroyed(this.destroyRef))
                .subscribe((data: GetDatasetFlowTriggersQuery) => {
                    const flowTriggers = data.datasets.byId?.flows.triggers.byType;
                    const schedule = flowTriggers?.schedule;
                    if (schedule && schedule.__typename === PollingGroupEnum.TIME_DELTA) {
                        this.pollingForm.patchValue({
                            updatesState: !flowTriggers.paused,
                            __typename: schedule?.__typename as PollingGroupEnum,
                            every: schedule.every,
                            unit: schedule.unit,
                        });
                    }
                    if (schedule && schedule.__typename === PollingGroupEnum.CRON_5_COMPONENT_EXPRESSION) {
                        this.pollingForm.patchValue({
                            updatesState: !flowTriggers.paused,
                            __typename: schedule.__typename as PollingGroupEnum,
                            cronExpression: schedule.cron5ComponentExpression,
                        });
                    }
                });
        } else {
            this.datasetSchedulingService
                .fetchDatasetFlowTriggers(this.datasetBasics.id, DatasetFlowType.ExecuteTransform)
                .pipe(takeUntilDestroyed(this.destroyRef))
                .subscribe((data: GetDatasetFlowTriggersQuery) => {
                    const flowTriggers = data.datasets.byId?.flows.triggers.byType;
                    const batching = flowTriggers?.batching;
                    if (batching) {
                        this.batchingForm.patchValue({
                            ...batching.maxBatchingInterval,
                            minRecordsToAwait: batching.minRecordsToAwait,
                            updatesState: !flowTriggers.paused,
                        });
                    }
                });
        }
    }

    public saveBatchingTriggers(): void {
        this.datasetSchedulingService
            .setDatasetTriggers({
                datasetId: this.datasetBasics.id,
                datasetFlowType: DatasetFlowType.ExecuteTransform,
                paused: !(this.batchingUpdateState.value as boolean),
                triggerInput: this.setBatchingTriggerInput(),
                datasetInfo: {
                    accountName: this.datasetBasics.owner.accountName,
                    datasetName: this.datasetBasics.name,
                },
            })
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe();
    }

    public savePollingTriggers(): void {
        this.datasetSchedulingService
            .setDatasetTriggers({
                datasetId: this.datasetBasics.id,
                datasetFlowType: DatasetFlowType.Ingest,
                paused: !(this.pollingUpdateState.value as boolean),
                triggerInput: this.setPollingTriggerInput(),
                datasetInfo: {
                    accountName: this.datasetBasics.owner.accountName,
                    datasetName: this.datasetBasics.name,
                },
            })
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe();
    }

    private setPollingTriggerInput(): FlowTriggerInput {
        if (this.pollingForm.controls.__typename.value === PollingGroupEnum.TIME_DELTA) {
            return {
                schedule: {
                    timeDelta: {
                        every: this.pollingEveryTime.value as number,
                        unit: this.pollingUnitTime.value as TimeUnit,
                    },
                },
            };
        } else {
            return {
                schedule: {
                    // sync with server validator
                    cron5ComponentExpression: this.cronExpression.value as string,
                },
            };
        }
    }

    private setBatchingTriggerInput(): FlowTriggerInput {
        return {
            batching: {
                minRecordsToAwait: this.batchingMinRecordsToAwait.value as number,
                maxBatchingInterval: {
                    every: this.batchingEveryTime.value as number,
                    unit: this.batchingUnitTime.value as TimeUnit,
                },
            },
        };
    }
}
