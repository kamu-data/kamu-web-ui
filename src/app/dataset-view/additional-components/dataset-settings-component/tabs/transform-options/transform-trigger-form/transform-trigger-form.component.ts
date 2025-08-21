/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { ChangeDetectionStrategy, Component, Input, OnInit } from "@angular/core";
import { FlowTriggerBreakingChangeRule, FlowTriggerInput } from "src/app/api/kamu.graphql.interface";
import { BaseComponent } from "src/app/common/components/base.component";
import { FormGroup, FormControl, AbstractControl, FormsModule, ReactiveFormsModule, Validators } from "@angular/forms";
import { MaybeNull } from "src/app/interface/app.types";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { TooltipIconComponent } from "../../../../../../common/components/tooltip-icon/tooltip-icon.component";
import { MatSlideToggleModule } from "@angular/material/slide-toggle";
import {
    BatchingRuleFormType,
    TransformTriggerFormType,
    TransformTriggerFormValue,
} from "./transform-trigger-form.types";
import { BatchingRuleType } from "../../../dataset-settings.model";
import { FlowTooltipsTexts } from "src/app/common/tooltips/flow-tooltips.text";
import { MatRadioModule } from "@angular/material/radio";
import { BufferingBatchingRuleFormComponent } from "../buffering-batching-rule-form/buffering-batching-rule-form.component";
import { BufferingBatchingRuleFormType } from "../buffering-batching-rule-form/buffering-batching-rule-form.types";

@Component({
    selector: "app-transform-trigger-form",
    templateUrl: "./transform-trigger-form.component.html",
    styleUrls: ["./transform-trigger-form.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [
        //-----//
        FormsModule,
        ReactiveFormsModule,

        //-----//
        MatSlideToggleModule,
        MatRadioModule,

        //-----//
        TooltipIconComponent,
        BufferingBatchingRuleFormComponent,
    ],
})
export class TransformTriggerFormComponent extends BaseComponent implements OnInit {
    @Input({ required: true }) public form: FormGroup<TransformTriggerFormType>;
    @Input({ required: true }) public updateStateToggleLabel: string;

    public readonly UPDATES_TOOLTIP = FlowTooltipsTexts.UPDATE_SELECTOR_TOOLTIP;
    public readonly BREAKING_NO_ACTION_TOOLTIP = FlowTooltipsTexts.BREAKING_NO_ACTION_TOOLTIP;
    public readonly BREAKING_RECOVER_TOOLTIP = FlowTooltipsTexts.BREAKING_RECOVER_TOOLTIP;
    public readonly NEW_DATA_TRANSFORM_IMMEDIATE_TOOLTIP = FlowTooltipsTexts.NEW_DATA_TRANSFORM_IMMEDIATE_TOOLTIP;
    public readonly NEW_DATA_TRANSFORM_BUFFERING_TOOLTIP = FlowTooltipsTexts.NEW_DATA_TRANSFORM_BUFFERING_TOOLTIP;

    public readonly BatchingRuleType: typeof BatchingRuleType = BatchingRuleType;
    public readonly FlowTriggerBreakingChangeRule: typeof FlowTriggerBreakingChangeRule = FlowTriggerBreakingChangeRule;

    public static buildForm(): FormGroup<TransformTriggerFormType> {
        const bufferingForm = BufferingBatchingRuleFormComponent.buildForm();
        bufferingForm.disable();

        const formGroup = new FormGroup<TransformTriggerFormType>({
            updatesEnabled: new FormControl<boolean>(false, { nonNullable: true }),
            forNewData: new FormGroup<BatchingRuleFormType>({
                batchingRuleType: new FormControl<MaybeNull<BatchingRuleType>>(
                    { value: null, disabled: true },
                    { nonNullable: true, validators: [Validators.required] },
                ),
                buffering: bufferingForm,
            }),
            forBreakingChange: new FormControl<MaybeNull<FlowTriggerBreakingChangeRule>>(
                { value: null, disabled: true },
                { nonNullable: true, validators: [Validators.required] },
            ),
        });

        return formGroup;
    }

    public static buildTransformTriggerInput(transformTriggerFormValue: TransformTriggerFormValue): FlowTriggerInput {
        switch (transformTriggerFormValue.forNewData.batchingRuleType) {
            case BatchingRuleType.BUFFERING: {
                const bufferingValue = transformTriggerFormValue.forNewData.buffering;
                const batchingIntervalValue = bufferingValue?.maxBatchingInterval;
                // istanbul ignore next
                if (!batchingIntervalValue || !batchingIntervalValue.every || !batchingIntervalValue.unit) {
                    throw new Error("Batching interval value is not valid");
                }
                if (bufferingValue.minRecordsToAwait === null) {
                    throw new Error("Min records to await is required");
                }
                return {
                    reactive: {
                        forNewData: {
                            buffering: {
                                minRecordsToAwait: bufferingValue.minRecordsToAwait,
                                maxBatchingInterval: {
                                    every: batchingIntervalValue.every,
                                    unit: batchingIntervalValue.unit,
                                },
                            },
                        },
                        forBreakingChange:
                            transformTriggerFormValue.forBreakingChange ?? FlowTriggerBreakingChangeRule.NoAction,
                    },
                };
            }

            case BatchingRuleType.IMMEDIATE:
            case null: // No batching rule
                return {
                    reactive: {
                        forNewData: {
                            immediate: { dummy: true },
                        },
                        forBreakingChange:
                            transformTriggerFormValue.forBreakingChange ?? FlowTriggerBreakingChangeRule.NoAction,
                    },
                };
        }
    }

    public ngOnInit(): void {
        this.setupFormControlRelationships();
    }

    public get updatesEnabledControl(): AbstractControl {
        return this.form.controls.updatesEnabled;
    }

    public get forBreakingChangeControl(): AbstractControl {
        return this.form.controls.forBreakingChange;
    }

    public get forNewDataControl(): FormGroup<BatchingRuleFormType> {
        return this.form.controls.forNewData;
    }

    public get batchingRuleTypeControl(): FormControl<MaybeNull<BatchingRuleType>> {
        return this.forNewDataControl.controls.batchingRuleType;
    }

    public get bufferingBatchingForm(): FormGroup<BufferingBatchingRuleFormType> {
        return this.forNewDataControl.controls.buffering;
    }

    private setupFormControlRelationships(): void {
        this.updatesEnabledControl.valueChanges
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe((updated: boolean) => {
                if (updated) {
                    this.forBreakingChangeControl.enable();
                    this.enableForNewDataControls();
                } else {
                    this.forBreakingChangeControl.disable();
                    this.forNewDataControl.disable();
                }
            });

        this.batchingRuleTypeControl.valueChanges
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe((batchingRuleType: MaybeNull<BatchingRuleType>) => {
                // Only update buffering form state if the parent forNewDataControl is enabled
                if (this.forNewDataControl.enabled) {
                    if (batchingRuleType === BatchingRuleType.BUFFERING) {
                        this.bufferingBatchingForm.enable();
                    } else {
                        this.bufferingBatchingForm.disable();
                    }
                }
            });
    }

    private enableForNewDataControls(): void {
        // Enable the batchingRuleType control
        this.batchingRuleTypeControl.enable();

        // Enable the buffering form only if BUFFERING is selected
        const currentBatchingRuleType = this.batchingRuleTypeControl.value;
        if (currentBatchingRuleType === BatchingRuleType.BUFFERING) {
            this.bufferingBatchingForm.enable();
        } else {
            this.bufferingBatchingForm.disable();
        }
    }
}
