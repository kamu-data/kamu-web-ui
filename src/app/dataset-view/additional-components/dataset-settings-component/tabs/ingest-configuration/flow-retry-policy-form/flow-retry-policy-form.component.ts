/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { NgIf } from "@angular/common";
import { ChangeDetectionStrategy, Component, Input, OnInit } from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { MatSlideToggleModule } from "@angular/material/slide-toggle";

import {
    FlowRetryPolicyFormType,
    FlowRetryPolicyFormValue,
} from "src/app/dataset-view/additional-components/dataset-settings-component/tabs/ingest-configuration/flow-retry-policy-form/flow-retry-policy-form.types";

import { BaseComponent } from "@common/components/base.component";
import { TimeDeltaFormComponent } from "@common/components/time-delta-form/time-delta-form.component";
import { TimeDeltaFormType } from "@common/components/time-delta-form/time-delta-form.value";
import { TooltipIconComponent } from "@common/components/tooltip-icon/tooltip-icon.component";
import { FormValidationErrorsDirective } from "@common/directives/form-validation-errors.directive";
import { FlowTooltipsTexts } from "@common/tooltips/flow-tooltips.text";
import {
    FlowRetryBackoffType,
    FlowRetryPolicy,
    FlowRetryPolicyInput,
    TimeDelta,
    TimeUnit,
} from "@api/kamu.graphql.interface";
import { MaybeNull } from "@interface/app.types";

@Component({
    selector: "app-flow-retry-policy-form",
    templateUrl: "./flow-retry-policy-form.component.html",
    styleUrls: ["./flow-retry-policy-form.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [
        //-----//
        NgIf,
        ReactiveFormsModule,
        //-----//
        MatSlideToggleModule,
        //-----//
        FormValidationErrorsDirective,
        TimeDeltaFormComponent,
        TooltipIconComponent,
    ],
})
export class FlowRetryPolicyFormComponent extends BaseComponent implements OnInit {
    @Input({ required: true }) public form: FormGroup<FlowRetryPolicyFormType>;

    public static readonly DEFAULT_MAX_ATTEMPTS: number = 3;
    public static readonly DEFAULT_MIN_DELAY: TimeDelta = {
        every: 15,
        unit: TimeUnit.Minutes,
    };
    public static readonly DEFAULT_BACKOFF_TYPE: FlowRetryBackoffType = FlowRetryBackoffType.Fixed;

    public readonly FlowRetryBackoffType: typeof FlowRetryBackoffType = FlowRetryBackoffType;
    public readonly RETRY_TOOLTIP: string = FlowTooltipsTexts.RETRY_SELECTOR_TOOLTIP;

    public static buildForm(): FormGroup<FlowRetryPolicyFormType> {
        const minDelayForm = TimeDeltaFormComponent.buildForm();
        minDelayForm.patchValue(FlowRetryPolicyFormComponent.DEFAULT_MIN_DELAY);

        const form = new FormGroup<FlowRetryPolicyFormType>({
            retriesEnabled: new FormControl<boolean>(false, { validators: [Validators.required] }),
            maxAttempts: new FormControl<number>(FlowRetryPolicyFormComponent.DEFAULT_MAX_ATTEMPTS, {
                validators: [Validators.required, Validators.min(1), Validators.max(100)],
            }),
            minDelay: minDelayForm,
            backoffType: new FormControl<FlowRetryBackoffType>(FlowRetryPolicyFormComponent.DEFAULT_BACKOFF_TYPE, {
                validators: [Validators.required],
            }),
        });

        // Set initial disabled state since retriesEnabled starts as false
        form.controls.maxAttempts.disable();
        form.controls.minDelay.disable();
        form.controls.backoffType.disable();

        return form;
    }

    public static buildFormValue(retryPolicy: MaybeNull<FlowRetryPolicy>): FlowRetryPolicyFormValue {
        if (retryPolicy) {
            return {
                retriesEnabled: true,
                backoffType: retryPolicy.backoffType,
                maxAttempts: retryPolicy.maxAttempts,
                minDelay: retryPolicy.minDelay,
            };
        } else {
            return {
                retriesEnabled: false,
                backoffType: FlowRetryPolicyFormComponent.DEFAULT_BACKOFF_TYPE,
                maxAttempts: FlowRetryPolicyFormComponent.DEFAULT_MAX_ATTEMPTS,
                minDelay: FlowRetryPolicyFormComponent.DEFAULT_MIN_DELAY,
            };
        }
    }

    public static buildFlowConfigRetryPolicyInput(
        formValue: FlowRetryPolicyFormValue,
    ): MaybeNull<FlowRetryPolicyInput> {
        if (formValue.retriesEnabled) {
            return {
                backoffType: formValue.backoffType,
                maxAttempts: formValue.maxAttempts,
                minDelay: {
                    every: formValue.minDelay.every,
                    unit: formValue.minDelay.unit,
                },
            };
        } else {
            return null;
        }
    }

    public get retriesEnabled(): FormControl<MaybeNull<boolean>> {
        return this.form.controls.retriesEnabled;
    }

    public get maxAttempts(): FormControl<MaybeNull<number>> {
        return this.form.controls.maxAttempts;
    }

    public get minDelay(): FormGroup<TimeDeltaFormType> {
        return this.form.controls.minDelay;
    }

    public get backoffType(): FormControl<MaybeNull<FlowRetryBackoffType>> {
        return this.form.controls.backoffType;
    }

    public ngOnInit(): void {
        this.setupFormControlRelationships();
    }

    private setupFormControlRelationships(): void {
        this.retriesEnabled.valueChanges
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe((enabled: MaybeNull<boolean>) => {
                if (enabled) {
                    this.maxAttempts.enable();
                    this.minDelay.enable();
                    this.backoffType.enable();
                } else {
                    this.maxAttempts.disable();
                    this.minDelay.disable();
                    this.backoffType.disable();
                }
            });
    }

    public readonly BACKOFF_EXPLANATIONS: Record<FlowRetryBackoffType, string> = {
        [FlowRetryBackoffType.Fixed]: "Fixed: The delay between retries is always the same.",
        [FlowRetryBackoffType.Linear]: "Linear: The delay increases linearly with each attempt.",
        [FlowRetryBackoffType.Exponential]: "Exponential: The delay doubles with each attempt.",
        [FlowRetryBackoffType.ExponentialWithJitter]:
            "Exponential with jitter: Like exponential, but adds random component to avoid retry storms.",
    };
}
