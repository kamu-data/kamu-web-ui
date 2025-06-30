/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { FlowRetryBackoffType, FlowRetryPolicy, TimeUnit } from "src/app/api/kamu.graphql.interface";
import { FlowRetryPolicyFormType } from "./flow-retry-policy-form.types";
import { TimeDeltaFormValue } from "src/app/common/components/time-delta-form/time-delta-form.value";
import { MaybeNull } from "src/app/interface/app.types";
import { FlowTooltipsTexts } from "src/app/common/tooltips/flow-tooltips.text";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { BaseComponent } from "src/app/common/components/base.component";

@Component({
    selector: "app-flow-retry-policy-form",
    templateUrl: "./flow-retry-policy-form.component.html",
    styleUrls: ["./flow-retry-policy-form.component.scss"],
})
export class FlowRetryPolicyFormComponent extends BaseComponent implements OnInit {
    @Input({ required: true }) public retryPolicy: FlowRetryPolicy | null = null;
    @Output() public changeRetryPolicyEmit = new EventEmitter<FormGroup<FlowRetryPolicyFormType>>();

    public readonly FlowRetryBackoffType: typeof FlowRetryBackoffType = FlowRetryBackoffType;
    public readonly RETRY_TOOLTIP: string = FlowTooltipsTexts.RETRY_SELECTOR_TOOLTIP;

    public readonly DEFAULT_MAX_ATTEMPTS: number = 3;
    public readonly DEFAULT_MIN_DELAY: TimeDeltaFormValue = {
        every: 15,
        unit: TimeUnit.Minutes,
    };
    public readonly DEFAULT_BACKOFF_TYPE: FlowRetryBackoffType = FlowRetryBackoffType.Fixed;

    public flowRetryPolicyForm = new FormGroup<FlowRetryPolicyFormType>({
        retriesEnabled: new FormControl<boolean>(false, { validators: [Validators.required] }),
        maxAttempts: new FormControl<number>(this.DEFAULT_MAX_ATTEMPTS, {
            validators: [Validators.required, Validators.min(1), Validators.max(100)],
        }),
        minDelay: new FormControl<TimeDeltaFormValue>(this.DEFAULT_MIN_DELAY, { validators: [Validators.required] }),
        backoffType: new FormControl<FlowRetryBackoffType>(this.DEFAULT_BACKOFF_TYPE, {
            validators: [Validators.required],
        }),
    });

    public get retriesEnabled(): FormControl<MaybeNull<boolean>> {
        return this.flowRetryPolicyForm.controls.retriesEnabled;
    }

    public get maxAttempts(): FormControl<MaybeNull<number>> {
        return this.flowRetryPolicyForm.controls.maxAttempts;
    }

    public get minDelay(): FormControl<MaybeNull<TimeDeltaFormValue>> {
        return this.flowRetryPolicyForm.controls.minDelay;
    }

    public get backoffType(): FormControl<MaybeNull<FlowRetryBackoffType>> {
        return this.flowRetryPolicyForm.controls.backoffType;
    }

    public ngOnInit(): void {
        this.setupFormControlRelationships();
        this.initRetryPolicyForm();
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

    private initRetryPolicyForm(): void {
        if (this.retryPolicy) {
            this.flowRetryPolicyForm.patchValue({
                retriesEnabled: true,
                backoffType: this.retryPolicy.backoffType,
                maxAttempts: this.retryPolicy.maxAttempts,
                minDelay: this.retryPolicy.minDelay,
            });
        } else {
            this.flowRetryPolicyForm.patchValue({
                retriesEnabled: false,
                backoffType: this.DEFAULT_BACKOFF_TYPE,
                maxAttempts: this.DEFAULT_MAX_ATTEMPTS,
                minDelay: this.DEFAULT_MIN_DELAY,
            });
        }

        this.changeRetryPolicyEmit.emit(this.flowRetryPolicyForm);
    }
}
