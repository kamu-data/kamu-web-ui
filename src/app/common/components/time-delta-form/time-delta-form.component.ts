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
    ValidatorFn,
    Validators,
} from "@angular/forms";
import { TimeUnit } from "src/app/api/kamu.graphql.interface";
import { BaseFormControlComponent } from "../base-form-control.component";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { everyTimeMapperValidators } from "src/app/common/helpers/data.helpers";
import { MaybeNull } from "src/app/interface/app.types";
import { TimeDeltaFormType, TimeDeltaFormValue } from "./time-delta-form.value";
import { NgIf } from "@angular/common";

@Component({
    selector: "app-time-delta-form",
    templateUrl: "./time-delta-form.component.html",
    styleUrls: ["./time-delta-form.component.scss"],
    standalone: true,
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [
        //-----//
        NgIf,
        ReactiveFormsModule,
        //-----//
    ],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => TimeDeltaFormComponent),
            multi: true,
        },
        {
            provide: NG_VALIDATORS,
            useExisting: forwardRef(() => TimeDeltaFormComponent),
            multi: true,
        },
    ],
})
export class TimeDeltaFormComponent extends BaseFormControlComponent<TimeDeltaFormValue> {
    @Input() public label: string = "Launch every:";

    public readonly TimeUnit: typeof TimeUnit = TimeUnit;

    private everyTimeMapperValidators: Record<TimeUnit, ValidatorFn> = everyTimeMapperValidators;

    public override form = new FormGroup<TimeDeltaFormType>({
        every: new FormControl<MaybeNull<number>>({ value: null, disabled: this.disabled }, [Validators.required]),
        unit: new FormControl<MaybeNull<TimeUnit>>({ value: null, disabled: this.disabled }, [Validators.required]),
    });

    protected initializeForm(): void {
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
