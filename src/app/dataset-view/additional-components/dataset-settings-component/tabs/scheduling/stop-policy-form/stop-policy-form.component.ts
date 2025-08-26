/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { ChangeDetectionStrategy, Component, Input, OnInit } from "@angular/core";
import { AbstractControl, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from "@angular/forms";
import { MatRadioModule } from "@angular/material/radio";
import { MatSlideToggleModule } from "@angular/material/slide-toggle";
import { BaseComponent } from "src/app/common/components/base.component";
import { StopPolicyFormType, StopPolicyFormValue } from "./stop-policy-form.types";
import { MaybeNull } from "src/app/interface/app.types";
import { StopPolicyType } from "../../../dataset-settings.model";
import { FlowTriggerStopPolicyInput } from "src/app/api/kamu.graphql.interface";
import { FormValidationErrorsDirective } from "src/app/common/directives/form-validation-errors.directive";
import { TooltipIconComponent } from "src/app/common/components/tooltip-icon/tooltip-icon.component";
import { FlowTooltipsTexts } from "src/app/common/tooltips/flow-tooltips.text";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";

@Component({
    selector: "app-stop-policy-form",
    templateUrl: "./stop-policy-form.component.html",
    styleUrls: ["./stop-policy-form.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
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
export class StopPolicyFormComponent extends BaseComponent implements OnInit {
    @Input({ required: true }) public form: FormGroup<StopPolicyFormType>;
    @Input({ required: true }) public updatesEnabledControl: FormControl<boolean>;

    public static readonly DEFAULT_MAX_FAILURES: number = 1;

    public readonly StopPolicyType: typeof StopPolicyType = StopPolicyType;

    public readonly NEVER_TOOLTIP: string = FlowTooltipsTexts.STOP_POLICY_NEVER_TOOLTIP;
    public readonly CONSECUTIVE_FAILURES_TOOLTIP: string =
        FlowTooltipsTexts.STOP_POLICY_AFTER_CONSECUTIVE_FAILURES_TOOLTIP;

    public static buildForm(): FormGroup<StopPolicyFormType> {
        return new FormGroup<StopPolicyFormType>({
            stopPolicyType: new FormControl<MaybeNull<StopPolicyType>>(
                { value: null, disabled: true },
                { nonNullable: true, validators: [Validators.required] },
            ),
            maxFailures: new FormControl<number>(
                { value: StopPolicyFormComponent.DEFAULT_MAX_FAILURES, disabled: true },
                { nonNullable: true, validators: [Validators.required, Validators.min(1)] },
            ),
        });
    }

    public static buildStopPolicyInput(stopPolicyFormValue: StopPolicyFormValue): FlowTriggerStopPolicyInput {
        switch (stopPolicyFormValue.stopPolicyType) {
            case StopPolicyType.NEVER:
                return {
                    never: { dummy: false },
                } as FlowTriggerStopPolicyInput;

            case StopPolicyType.AFTER_CONSECUTIVE_FAILURES:
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

    public get stopPolicyTypeControl(): FormControl<MaybeNull<StopPolicyType>> {
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
            .subscribe((stopPolicyType: MaybeNull<StopPolicyType>) => {
                // Only allow reading when updates are enabled in general
                if (this.updatesEnabledControl.value && stopPolicyType === StopPolicyType.AFTER_CONSECUTIVE_FAILURES) {
                    this.maxFailuresControl.enable();
                } else {
                    this.maxFailuresControl.disable();
                }
            });
    }
}
