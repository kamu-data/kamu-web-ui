/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, Input } from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { FormGroup, FormsModule, ReactiveFormsModule } from "@angular/forms";
import {
    DatasetBasicsFragment,
    DatasetFlowType,
    DatasetKind,
    FlowTriggerStopPolicyInput,
    TimeUnit,
} from "src/app/api/kamu.graphql.interface";
import { DatasetFlowTriggerService } from "../../services/dataset-flow-trigger.service";
import { BaseComponent } from "src/app/common/components/base.component";
import RoutingResolvers from "src/app/common/resolvers/routing-resolvers";
import { MatDividerModule } from "@angular/material/divider";
import { TransformTriggerFormComponent } from "./transform-trigger-form/transform-trigger-form.component";
import { NgIf } from "@angular/common";
import {
    TransformSettingsFormType,
    TransformSettingsFormValue,
} from "./dataset-settings-transform-options-tab.component.types";
import { MaybeNull } from "src/app/interface/app.types";
import { TransformTriggerFormValue } from "./transform-trigger-form/transform-trigger-form.types";
import { DatasetSettingsTransformOptionsTabData } from "./dataset-settings-transform-options-tab.data";
import { BatchingRuleType } from "../../dataset-settings.model";

@Component({
    selector: "app-dataset-settings-transform-options-tab",
    templateUrl: "./dataset-settings-transform-options-tab.component.html",
    styleUrls: ["./dataset-settings-transform-options-tab.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [
        //-----//
        NgIf,
        FormsModule,
        ReactiveFormsModule,

        //-----//
        MatDividerModule,

        //-----//
        TransformTriggerFormComponent,
    ],
})
export class DatasetSettingsTransformOptionsTabComponent extends BaseComponent implements AfterViewInit {
    @Input(RoutingResolvers.DATASET_SETTINGS_TRANSFORM_KEY)
    public transformTabData: DatasetSettingsTransformOptionsTabData;

    private readonly cdr = inject(ChangeDetectorRef);
    private readonly datasetFlowTriggerService = inject(DatasetFlowTriggerService);

    public get datasetBasics(): DatasetBasicsFragment {
        return this.transformTabData.datasetBasics;
    }

    public get isDerivedDataset(): boolean {
        return this.datasetBasics.kind === DatasetKind.Derivative;
    }
    public readonly form: FormGroup<TransformSettingsFormType> = new FormGroup<TransformSettingsFormType>({
        transformTrigger: TransformTriggerFormComponent.buildForm(),
    });

    public ngAfterViewInit() {
        this.form.patchValue(
            {
                transformTrigger: this.buildInitialTransformTriggerFormValue(),
            } as TransformSettingsFormValue,
            { emitEvent: true },
        );
        this.cdr.detectChanges();
    }

    private buildInitialTransformTriggerFormValue(): MaybeNull<TransformTriggerFormValue> {
        const reactive = this.transformTabData.reactive;

        if (!reactive) {
            return null;
        }

        const updatesEnabled = !this.transformTabData.paused;
        switch (reactive.forNewData.__typename) {
            case "FlowTriggerBatchingRuleBuffering": {
                // Since we are disabling Days and Weeks in batching rule UI, check for special values
                let maxBatchingInterval = reactive.forNewData.maxBatchingInterval;
                if (maxBatchingInterval.unit === TimeUnit.Days) {
                    // 1 day is the maximum allowed for buffering rule = 24 hours
                    if (maxBatchingInterval.every > 1) {
                        throw new Error("Max batching interval for buffering rule cannot be more than 1 day");
                    }
                    maxBatchingInterval = {
                        every: 24,
                        unit: TimeUnit.Hours,
                    };
                } else if (maxBatchingInterval.unit === TimeUnit.Weeks) {
                    // Weeks are definitely unexpected
                    throw new Error("Weeks are unexpected in max batching interval for buffering rule");
                }

                return {
                    updatesEnabled,
                    forNewData: {
                        batchingRuleType: BatchingRuleType.BUFFERING,
                        buffering: {
                            minRecordsToAwait: reactive.forNewData.minRecordsToAwait,
                            maxBatchingInterval: {
                                every: maxBatchingInterval.every,
                                unit: maxBatchingInterval.unit,
                            },
                        },
                    },
                    forBreakingChange: reactive.forBreakingChange,
                };
            }

            case "FlowTriggerBatchingRuleImmediate":
                return {
                    updatesEnabled,
                    forNewData: {
                        batchingRuleType: BatchingRuleType.IMMEDIATE,
                    },
                    forBreakingChange: reactive.forBreakingChange,
                };

            default:
                throw new Error(`Unknown reactive trigger type: ${reactive.forNewData.__typename}`);
        }
    }

    public saveUpdates(): void {
        const formValue = this.form.getRawValue() as TransformSettingsFormValue;
        const transformTriggerFormValue = formValue.transformTrigger;

        this.datasetFlowTriggerService
            .setDatasetFlowTriggers({
                datasetId: this.datasetBasics.id,
                datasetFlowType: DatasetFlowType.ExecuteTransform,
                paused: !transformTriggerFormValue.updatesEnabled,
                triggerRuleInput:
                    TransformTriggerFormComponent.buildTransformTriggerRuleInput(transformTriggerFormValue),
                triggerStopPolicyInput: { never: { dummy: true } } as FlowTriggerStopPolicyInput, // TODO: UI support
                datasetInfo: {
                    accountName: this.datasetBasics.owner.accountName,
                    datasetName: this.datasetBasics.name,
                },
            })
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe();
    }
}
