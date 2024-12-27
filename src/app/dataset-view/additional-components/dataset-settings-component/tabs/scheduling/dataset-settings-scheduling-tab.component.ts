import { ChangeDetectionStrategy, Component, inject, Input } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { BaseComponent } from "../../../../../common/base.component";
import { PollingGroupEnum, ThrottlingGroupEnum } from "../../dataset-settings.model";
import {
    DatasetBasicsFragment,
    DatasetFlowType,
    DatasetKind,
    DatasetPermissionsFragment,
    FlowTriggerInput,
    TimeUnit,
} from "src/app/api/kamu.graphql.interface";
import { DatasetSchedulingService } from "../../services/dataset-scheduling.service";
import {
    BatchingFormType,
    IngestConfigurationFormType,
    PollingGroupType,
} from "./dataset-settings-scheduling-tab.component.types";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { ToastrService } from "ngx-toastr";

@Component({
    selector: "app-dataset-settings-scheduling-tab",
    templateUrl: "./dataset-settings-scheduling-tab.component.html",
    styleUrls: ["./dataset-settings-scheduling-tab.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DatasetSettingsSchedulingTabComponent extends BaseComponent {
    @Input({ required: true }) public datasetBasics: DatasetBasicsFragment;
    @Input({ required: true }) public datasetPermissions: DatasetPermissionsFragment;
    public readonly throttlingGroupEnum: typeof ThrottlingGroupEnum = ThrottlingGroupEnum;
    public readonly timeUnit: typeof TimeUnit = TimeUnit;

    private datasetSchedulingService = inject(DatasetSchedulingService);
    private toastrService = inject(ToastrService);

    public get isRootDataset(): boolean {
        return this.datasetBasics.kind === DatasetKind.Root;
    }

    public saveIngestConfiguration(ingestConfigurationForm: FormGroup<IngestConfigurationFormType>): void {
        this.datasetSchedulingService
            .setDatasetFlowConfigs({
                datasetId: this.datasetBasics.id,
                datasetFlowType: DatasetFlowType.Ingest,
                configInput: {
                    ingest: {
                        fetchUncacheable: ingestConfigurationForm.controls.fetchUncacheable.value,
                    },
                },
            })
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe((success: boolean) => {
                if (success) {
                    this.toastrService.success("Configuration saved");
                }
            });
    }

    public saveBatchingTriggers(batchingTriggerForm: FormGroup<BatchingFormType>): void {
        this.datasetSchedulingService
            .setDatasetTriggers({
                datasetId: this.datasetBasics.id,
                datasetFlowType: DatasetFlowType.ExecuteTransform,
                paused: !batchingTriggerForm.controls.updatesState.value,
                triggerInput: this.setBatchingTriggerInput(batchingTriggerForm),
                datasetInfo: {
                    accountName: this.datasetBasics.owner.accountName,
                    datasetName: this.datasetBasics.name,
                },
            })
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe();
    }

    public savePollingTriggers(pollingForm: FormGroup<PollingGroupType>): void {
        this.datasetSchedulingService
            .setDatasetTriggers({
                datasetId: this.datasetBasics.id,
                datasetFlowType: DatasetFlowType.Ingest,
                paused: !pollingForm.controls.updatesState.value,
                triggerInput: this.setPollingTriggerInput(pollingForm),
                datasetInfo: {
                    accountName: this.datasetBasics.owner.accountName,
                    datasetName: this.datasetBasics.name,
                },
            })
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe();
    }

    private setPollingTriggerInput(pollingForm: FormGroup<PollingGroupType>): FlowTriggerInput {
        if (pollingForm.controls.__typename.value === PollingGroupEnum.TIME_DELTA) {
            return {
                schedule: {
                    timeDelta: {
                        every: pollingForm.controls.every.value as number,
                        unit: pollingForm.controls.unit.value as TimeUnit,
                    },
                },
            };
        } else {
            return {
                schedule: {
                    // sync with server validator
                    cron5ComponentExpression: pollingForm.controls.cronExpression.value as string,
                },
            };
        }
    }

    private setBatchingTriggerInput(batchingTriggerForm: FormGroup<BatchingFormType>): FlowTriggerInput {
        return {
            batching: {
                minRecordsToAwait: batchingTriggerForm.controls.minRecordsToAwait.value as number,
                maxBatchingInterval: {
                    every: batchingTriggerForm.controls.every.value as number,
                    unit: batchingTriggerForm.controls.unit.value as TimeUnit,
                },
            },
        };
    }
}
