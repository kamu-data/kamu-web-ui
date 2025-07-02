/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { ChangeDetectionStrategy, Component, inject, Input } from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { FormGroup } from "@angular/forms";
import { DatasetBasicsFragment, DatasetFlowType, FlowTriggerInput, TimeUnit } from "src/app/api/kamu.graphql.interface";
import { DatasetSchedulingService } from "../../services/dataset-scheduling.service";
import { BaseComponent } from "src/app/common/components/base.component";
import RoutingResolvers from "src/app/common/resolvers/routing-resolvers";
import { DatasetViewData } from "src/app/dataset-view/dataset-view.interface";
import { BatchingFormType } from "./dataset-settings-transform-options-tab.component.types";
import { BatchingTriggerFormComponent } from "./batching-trigger-form/batching-trigger-form.component";
import { MatDividerModule } from "@angular/material/divider";

@Component({
    selector: "app-dataset-settings-transform-options-tab",
    templateUrl: "./dataset-settings-transform-options-tab.component.html",
    styleUrls: ["./dataset-settings-transform-options-tab.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [
        //-----//
        MatDividerModule,

        //-----//
        BatchingTriggerFormComponent,
    ],
})
export class DatasetSettingsTransformOptionsTabComponent extends BaseComponent {
    @Input(RoutingResolvers.DATASET_SETTINGS_TRANSFORM_KEY) public transformViewData: DatasetViewData;

    private datasetSchedulingService = inject(DatasetSchedulingService);

    public get datasetBasics(): DatasetBasicsFragment {
        return this.transformViewData.datasetBasics;
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
