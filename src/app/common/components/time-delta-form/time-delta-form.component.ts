/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { ChangeDetectionStrategy, Component, Input, OnInit } from "@angular/core";
import { FormControl, FormGroup, ReactiveFormsModule, ValidatorFn, Validators } from "@angular/forms";
import { TimeUnit } from "src/app/api/kamu.graphql.interface";
import { BaseComponent } from "../base.component";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { everyTimeMapperValidators } from "src/app/common/helpers/data.helpers";
import { MaybeNull } from "src/app/interface/app.types";
import { TimeDeltaFormType } from "./time-delta-form.value";
import { FormValidationErrorsDirective } from "../../directives/form-validation-errors.directive";

@Component({
    selector: "app-time-delta-form",
    templateUrl: "./time-delta-form.component.html",
    styleUrls: ["./time-delta-form.component.scss"],
    standalone: true,
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [
        //-----//
        ReactiveFormsModule,

        //-----//
        FormValidationErrorsDirective,
    ],
})
export class TimeDeltaFormComponent extends BaseComponent implements OnInit {
    @Input({ required: true }) public form: FormGroup<TimeDeltaFormType>;
    @Input() public label: string = "Launch every:";

    public readonly TimeUnit: typeof TimeUnit = TimeUnit;

    private everyTimeMapperValidators: Record<TimeUnit, ValidatorFn> = everyTimeMapperValidators;

    public static buildForm(): FormGroup<TimeDeltaFormType> {
        return new FormGroup<TimeDeltaFormType>({
            every: new FormControl<MaybeNull<number>>({ value: null, disabled: false }, [Validators.required]),
            unit: new FormControl<MaybeNull<TimeUnit>>({ value: null, disabled: false }, [Validators.required]),
        });
    }

    public ngOnInit(): void {
        this.setEveryTimeValidator();
    }

    public get everyControl(): FormControl<MaybeNull<number>> {
        return this.form.controls.every;
    }

    public get unitControl(): FormControl<MaybeNull<TimeUnit>> {
        return this.form.controls.unit;
    }

    private setEveryTimeValidator(): void {
        this.unitControl.valueChanges
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe((data: MaybeNull<TimeUnit>) => {
                if (data) {
                    this.everyControl.setValidators([this.everyTimeMapperValidators[data], Validators.required]);
                    this.everyControl.updateValueAndValidity();
                }
            });
    }
}
