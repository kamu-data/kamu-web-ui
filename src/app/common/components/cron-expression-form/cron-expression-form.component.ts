/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { NgIf } from "@angular/common";
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, Input, OnInit } from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";

import { BaseComponent } from "@common/components/base.component";
import { CronExpressionFormType } from "@common/components/cron-expression-form/cron-expression-form.value";
import { FormValidationErrorsDirective } from "@common/directives/form-validation-errors.directive";
import { cronExpressionNextTime } from "@common/helpers/app.helpers";
import { cronValidator } from "@common/helpers/cron-expression-validator.helper";

@Component({
    selector: "app-cron-expression-form",
    templateUrl: "./cron-expression-form.component.html",
    styleUrls: ["./cron-expression-form.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [
        //-----//
        NgIf,
        ReactiveFormsModule,
        //-----//
        FormValidationErrorsDirective,
    ],
})
export class CronExpressionFormComponent extends BaseComponent implements OnInit {
    @Input({ required: true }) public form: FormGroup<CronExpressionFormType>;
    @Input() public label: string = "Cron expression :";
    @Input() public placeholder: string = "Example: * * * * ?";

    public readonly NEXT_TIME_LABEL: string = "Next time";
    private readonly cdr = inject(ChangeDetectorRef);

    public static buildForm(): FormGroup<CronExpressionFormType> {
        return new FormGroup<CronExpressionFormType>({
            cronExpression: new FormControl<string>("", {
                validators: [Validators.required, cronValidator],
                nonNullable: true,
            }),
        });
    }

    public get cronExpressionControl(): FormControl<string> {
        return this.form.controls.cronExpression;
    }

    public get nextTime(): string {
        return cronExpressionNextTime(this.cronExpressionControl.value);
    }

    public ngOnInit(): void {
        this.subscribeToFormStatusChanges();
    }

    private subscribeToFormStatusChanges(): void {
        this.form.statusChanges.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => {
            this.cdr.markForCheck();
        });
    }
}
