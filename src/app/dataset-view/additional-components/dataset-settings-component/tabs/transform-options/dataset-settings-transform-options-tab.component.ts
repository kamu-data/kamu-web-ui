import { ChangeDetectionStrategy, Component, inject, Input } from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { FormGroup } from "@angular/forms";
import { DatasetBasicsFragment, DatasetFlowType, FlowTriggerInput, TimeUnit } from "src/app/api/kamu.graphql.interface";
import { BatchingFormType } from "../scheduling/dataset-settings-scheduling-tab.component.types";
import { DatasetSchedulingService } from "../../services/dataset-scheduling.service";
import { BaseComponent } from "src/app/common/components/base.component";

@Component({
    selector: "app-dataset-settings-transform-options-tab",
    templateUrl: "./dataset-settings-transform-options-tab.component.html",
    styleUrls: ["./dataset-settings-transform-options-tab.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DatasetSettingsTransformOptionsTabComponent extends BaseComponent {
    @Input({ required: true }) public datasetBasics: DatasetBasicsFragment;

    private datasetSchedulingService = inject(DatasetSchedulingService);

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
