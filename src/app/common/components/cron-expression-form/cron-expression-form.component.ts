/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { ChangeDetectionStrategy, Component, Input } from "@angular/core";
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { BaseComponent } from "../base.component";
import { cronExpressionNextTime } from "src/app/common/helpers/app.helpers";
import { CronExpressionFormType } from "./cron-expression-form.value";
import { NgIf } from "@angular/common";
import { FormValidationErrorsDirective } from "../../directives/form-validation-errors.directive";
import { cronValidator } from "../../helpers/cron-expression-validator.helper";

@Component({
    selector: "app-cron-expression-form",
    templateUrl: "./cron-expression-form.component.html",
    styleUrls: ["./cron-expression-form.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [
        //-----//
        NgIf,
        ReactiveFormsModule,

        //-----//
        FormValidationErrorsDirective,
    ],
})
export class CronExpressionFormComponent extends BaseComponent {
    @Input({ required: true }) public form: FormGroup<CronExpressionFormType>;
    @Input() public label: string = "Cron expression :";
    @Input() public placeholder: string = "Example: * * * * ?";

    public readonly NEXT_TIME_LABEL: string = "Next time";

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
}
