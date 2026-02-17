/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { ChangeDetectionStrategy, Component, Input, OnInit } from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { AbstractControl, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from "@angular/forms";
import { MatRadioModule } from "@angular/material/radio";
import { MatSlideToggleModule } from "@angular/material/slide-toggle";

import { FlowTriggerStopPolicyInput } from "@api/kamu.graphql.interface";
import { BaseComponent } from "@common/components/base.component";
import { TooltipIconComponent } from "@common/components/tooltip-icon/tooltip-icon.component";
import { FormValidationErrorsDirective } from "@common/directives/form-validation-errors.directive";
import { FlowTooltipsTexts } from "@common/tooltips/flow-tooltips.text";
import { FlowTriggerStopPolicyType } from "src/app/dataset-view/additional-components/dataset-settings-component/dataset-settings.model";
import {
    FlowStopPolicyFormType,
    FlowStopPolicyFormValue,
} from "src/app/dataset-view/additional-components/dataset-settings-component/tabs/shared/flow-stop-policy-form/flow-stop-policy-form.types";
import { MaybeNull } from "src/app/interface/app.types";

@Component({
    selector: "app-flow-stop-policy-form",
    templateUrl: "./flow-stop-policy-form.component.html",
    styleUrls: ["./flow-stop-policy-form.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [
        //-----//
        FormsModule,
        ReactiveFormsModule,
        //-----//
        MatRadioModule,
        MatSlideToggleModule,
        //-----//
        FormValidationErrorsDirective,
        TooltipIconComponent,
    ],
})
export class FlowStopPolicyFormComponent extends BaseComponent implements OnInit {
    @Input({ required: true }) public form: FormGroup<FlowStopPolicyFormType>;
    @Input({ required: true }) public updatesEnabledControl: FormControl<boolean>;

    public static readonly DEFAULT_MAX_FAILURES: number = 1;

    public readonly StopPolicyType: typeof FlowTriggerStopPolicyType = FlowTriggerStopPolicyType;

    public readonly NEVER_TOOLTIP: string = FlowTooltipsTexts.STOP_POLICY_NEVER_TOOLTIP;
    public readonly CONSECUTIVE_FAILURES_TOOLTIP: string =
        FlowTooltipsTexts.STOP_POLICY_AFTER_CONSECUTIVE_FAILURES_TOOLTIP;

    public static buildForm(): FormGroup<FlowStopPolicyFormType> {
        return new FormGroup<FlowStopPolicyFormType>({
            stopPolicyType: new FormControl<MaybeNull<FlowTriggerStopPolicyType>>(
                { value: null, disabled: true },
                { nonNullable: true, validators: [Validators.required] },
            ),
            maxFailures: new FormControl<number>(
                { value: FlowStopPolicyFormComponent.DEFAULT_MAX_FAILURES, disabled: true },
                { nonNullable: true, validators: [Validators.required, Validators.min(1)] },
            ),
        });
    }

    public static buildStopPolicyInput(stopPolicyFormValue: FlowStopPolicyFormValue): FlowTriggerStopPolicyInput {
        switch (stopPolicyFormValue.stopPolicyType) {
            case FlowTriggerStopPolicyType.NEVER:
                return {
                    never: { dummy: false },
                } as FlowTriggerStopPolicyInput;

            case FlowTriggerStopPolicyType.AFTER_CONSECUTIVE_FAILURES:
            case null: // No stop policy yet
                return {
                    afterConsecutiveFailures: { maxFailures: stopPolicyFormValue.maxFailures },
                } as FlowTriggerStopPolicyInput;

            /* istanbul ignore next */
            default:
                throw new Error(`Unknown stop policy type`);
        }
    }

    public ngOnInit(): void {
        this.setupFormControlRelationships();
    }

    public get stopPolicyTypeControl(): FormControl<MaybeNull<FlowTriggerStopPolicyType>> {
        return this.form.controls.stopPolicyType;
    }

    public get maxFailuresControl(): AbstractControl {
        return this.form.controls.maxFailures;
    }

    private setupFormControlRelationships(): void {
        this.updatesEnabledControl.valueChanges
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe((updated: boolean) => {
                if (updated) {
                    this.stopPolicyTypeControl.enable();
                } else {
                    this.stopPolicyTypeControl.disable();
                }
            });

        this.stopPolicyTypeControl.valueChanges
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe((stopPolicyType: MaybeNull<FlowTriggerStopPolicyType>) => {
                // Only allow reading when updates are enabled in general
                if (
                    this.updatesEnabledControl.value &&
                    stopPolicyType === FlowTriggerStopPolicyType.AFTER_CONSECUTIVE_FAILURES
                ) {
                    this.maxFailuresControl.enable();
                } else {
                    this.maxFailuresControl.disable();
                }
            });
    }
}
