/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, Input } from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from "@angular/forms";
import { DatasetBasicsFragment, DatasetFlowType, DatasetKind, TimeUnit } from "src/app/api/kamu.graphql.interface";
import { DatasetFlowTriggerService } from "../../services/dataset-flow-trigger.service";
import { BaseComponent } from "src/app/common/components/base.component";
import RoutingResolvers from "src/app/common/resolvers/routing-resolvers";
import { MatDividerModule } from "@angular/material/divider";
import { TransformTriggerFormComponent } from "./transform-trigger-form/transform-trigger-form.component";
import { NgIf } from "@angular/common";
import { TransformSettingsFormType, TransformSettingsFormValue } from "./dataset-settings-transform-options-tab.types";
import { MaybeNull } from "src/app/interface/app.types";
import { TransformTriggerFormValue } from "./transform-trigger-form/transform-trigger-form.types";
import { DatasetSettingsTransformOptionsTabData } from "./dataset-settings-transform-options-tab.data";
import { BatchingRuleType, FlowTriggerStopPolicyType } from "../../dataset-settings.model";
import { FlowStopPolicyFormComponent } from "../shared/flow-stop-policy-form/flow-stop-policy-form.component";
import { FlowTooltipsTexts } from "src/app/common/tooltips/flow-tooltips.text";
import { TooltipIconComponent } from "src/app/common/components/tooltip-icon/tooltip-icon.component";
import { MatSlideToggleModule } from "@angular/material/slide-toggle";
import { FlowStopPolicyFormValue } from "../shared/flow-stop-policy-form/flow-stop-policy-form.types";

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
        MatSlideToggleModule,
        MatDividerModule,

        //-----//
        TransformTriggerFormComponent,
        FlowStopPolicyFormComponent,
        TooltipIconComponent,
    ],
})
export class DatasetSettingsTransformOptionsTabComponent extends BaseComponent implements AfterViewInit {
    @Input(RoutingResolvers.DATASET_SETTINGS_TRANSFORM_KEY)
    public transformTabData: DatasetSettingsTransformOptionsTabData;

    private readonly cdr = inject(ChangeDetectorRef);
    private readonly datasetFlowTriggerService = inject(DatasetFlowTriggerService);

    public readonly UPDATES_TOOLTIP = FlowTooltipsTexts.UPDATE_SELECTOR_TOOLTIP;

    public get datasetBasics(): DatasetBasicsFragment {
        return this.transformTabData.datasetBasics;
    }

    public get isDerivedDataset(): boolean {
        return this.datasetBasics.kind === DatasetKind.Derivative;
    }

    public readonly form: FormGroup<TransformSettingsFormType> = new FormGroup<TransformSettingsFormType>({
        updatesEnabled: new FormControl<boolean>({ value: false, disabled: false }, { nonNullable: true }),
        transformTrigger: TransformTriggerFormComponent.buildForm(),
        stopPolicy: FlowStopPolicyFormComponent.buildForm(),
    });

    public ngAfterViewInit() {
        this.form.patchValue(
            {
                updatesEnabled: this.transformTabData.paused === false,
                transformTrigger: this.buildInitialTransformTriggerFormValue(),
                stopPolicy: this.buildInitialStopPolicyFormValue(),
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
                    forNewData: {
                        batchingRuleType: BatchingRuleType.IMMEDIATE,
                    },
                    forBreakingChange: reactive.forBreakingChange,
                };

            default:
                throw new Error(`Unknown reactive trigger type: ${reactive.forNewData.__typename}`);
        }
    }

    private buildInitialStopPolicyFormValue(): MaybeNull<FlowStopPolicyFormValue> {
        const stopPolicy = this.transformTabData.stopPolicy;
        if (!stopPolicy) {
            return null;
        }

        switch (stopPolicy.__typename) {
            case "FlowTriggerStopPolicyNever":
                return {
                    stopPolicyType: FlowTriggerStopPolicyType.NEVER,
                    maxFailures: FlowStopPolicyFormComponent.DEFAULT_MAX_FAILURES,
                };

            case "FlowTriggerStopPolicyAfterConsecutiveFailures":
                return {
                    stopPolicyType: FlowTriggerStopPolicyType.AFTER_CONSECUTIVE_FAILURES,
                    maxFailures: stopPolicy.maxFailures,
                };

            /* istanbul ignore next */
            default: {
                throw new Error(`Unknown stop policy type: ${stopPolicy.__typename}`);
            }
        }
    }

    public saveUpdates(): void {
        const formValue = this.form.getRawValue() as TransformSettingsFormValue;
        const updatesEnabled = formValue.updatesEnabled;

        if (updatesEnabled) {
            const transformTriggerFormValue = formValue.transformTrigger;

            this.datasetFlowTriggerService
                .setDatasetFlowTrigger({
                    datasetId: this.datasetBasics.id,
                    datasetFlowType: DatasetFlowType.ExecuteTransform,
                    triggerRuleInput:
                        TransformTriggerFormComponent.buildTransformTriggerRuleInput(transformTriggerFormValue),
                    triggerStopPolicyInput: FlowStopPolicyFormComponent.buildStopPolicyInput(formValue.stopPolicy),
                    datasetInfo: {
                        accountName: this.datasetBasics.owner.accountName,
                        datasetName: this.datasetBasics.name,
                    },
                })
                .pipe(takeUntilDestroyed(this.destroyRef))
                .subscribe();
        } else {
            this.datasetFlowTriggerService
                .pauseDatasetFlowTrigger({
                    datasetId: this.datasetBasics.id,
                    datasetFlowType: DatasetFlowType.ExecuteTransform,
                })
                .pipe(takeUntilDestroyed(this.destroyRef))
                .subscribe();
        }
    }
}
