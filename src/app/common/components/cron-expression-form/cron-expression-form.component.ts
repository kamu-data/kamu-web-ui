/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { ChangeDetectionStrategy, Component, forwardRef, Input } from "@angular/core";
import {
    FormControl,
    FormGroup,
    NG_VALIDATORS,
    NG_VALUE_ACCESSOR,
    ReactiveFormsModule,
    Validators,
} from "@angular/forms";
import { BaseFormControlComponent } from "../base-form-control.component";
import { cronExpressionValidator } from "src/app/common/helpers/data.helpers";
import { cronExpressionNextTime } from "src/app/common/helpers/app.helpers";
import { MaybeNull } from "src/app/interface/app.types";
import { CronExpressionFormType, CronExpressionFormValue } from "./cron-expression-form.value";
import { NgIf } from "@angular/common";

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
    ],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => CronExpressionFormComponent),
            multi: true,
        },
        {
            provide: NG_VALIDATORS,
            useExisting: forwardRef(() => CronExpressionFormComponent),
            multi: true,
        },
    ],
})
export class CronExpressionFormComponent extends BaseFormControlComponent<CronExpressionFormValue> {
    @Input() public label: string = "Cron expression :";
    @Input() public placeholder: string = "Example: * * * * ?";

    public readonly INVALID_EXPRESSION_MESSAGE: string = "Invalid expression";
    public readonly NEXT_TIME_LABEL: string = "Next time";

    public override form = new FormGroup<CronExpressionFormType>({
        cronExpression: new FormControl<MaybeNull<string>>({ value: "", disabled: this.disabled }, [
            Validators.required,
            cronExpressionValidator(),
        ]),
    });

    public get cronExpressionControl(): FormControl<MaybeNull<string>> {
        return this.form.controls.cronExpression;
    }

    public get nextTime(): string {
        return cronExpressionNextTime(this.cronExpressionControl.value as string);
    }
}
