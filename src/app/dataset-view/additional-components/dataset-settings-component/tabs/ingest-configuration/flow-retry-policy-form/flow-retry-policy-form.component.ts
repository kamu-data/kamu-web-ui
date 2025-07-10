/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { ChangeDetectionStrategy, Component, Input, OnInit } from "@angular/core";
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import {
    FlowRetryBackoffType,
    FlowRetryPolicy,
    FlowRetryPolicyInput,
    TimeDelta,
    TimeUnit,
} from "src/app/api/kamu.graphql.interface";
import { FlowRetryPolicyFormType, FlowRetryPolicyFormValue } from "./flow-retry-policy-form.types";
import { TimeDeltaFormValue } from "src/app/common/components/time-delta-form/time-delta-form.value";
import { MaybeNull } from "src/app/interface/app.types";
import { FlowTooltipsTexts } from "src/app/common/tooltips/flow-tooltips.text";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { BaseComponent } from "src/app/common/components/base.component";
import { NgIf } from "@angular/common";
import { FormValidationErrorsDirective } from "src/app/common/directives/form-validation-errors.directive";
import { TimeDeltaFormComponent } from "src/app/common/components/time-delta-form/time-delta-form.component";
import { TooltipIconComponent } from "src/app/common/components/tooltip-icon/tooltip-icon.component";
import { MatSlideToggleModule } from "@angular/material/slide-toggle";

@Component({
    selector: "app-flow-retry-policy-form",
    templateUrl: "./flow-retry-policy-form.component.html",
    styleUrls: ["./flow-retry-policy-form.component.scss"],
    standalone: true,
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
        return new FormGroup<FlowRetryPolicyFormType>({
            retriesEnabled: new FormControl<boolean>(false, { validators: [Validators.required] }),
            maxAttempts: new FormControl<number>(FlowRetryPolicyFormComponent.DEFAULT_MAX_ATTEMPTS, {
                validators: [Validators.required, Validators.min(1), Validators.max(100)],
            }),
            minDelay: new FormControl<TimeDeltaFormValue>(FlowRetryPolicyFormComponent.DEFAULT_MIN_DELAY, {
                validators: [Validators.required],
            }),
            backoffType: new FormControl<FlowRetryBackoffType>(FlowRetryPolicyFormComponent.DEFAULT_BACKOFF_TYPE, {
                validators: [Validators.required],
            }),
        });
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

    public get minDelay(): FormControl<MaybeNull<TimeDeltaFormValue>> {
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
