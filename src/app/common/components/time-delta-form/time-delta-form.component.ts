/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, Input, OnChanges, OnInit } from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import {
    AbstractControl,
    FormControl,
    FormGroup,
    ReactiveFormsModule,
    ValidationErrors,
    Validators,
} from "@angular/forms";

import { BaseComponent } from "@common/components/base.component";
import { TimeDeltaFormType } from "@common/components/time-delta-form/time-delta-form.value";
import { enumValueOf } from "@common/helpers/app.helpers";
import { FormValidationErrorsDirective } from "@common/validation/form-validation-errors.directive";
import { integerInRangeValidators } from "@common/validation/number.validators";
import { TimeUnit } from "@api/kamu.graphql.interface";
import { MaybeNull } from "@interface/app.types";

/** The largest value each unit accepts. */
const MAX_EVERY_PER_UNIT: Record<TimeUnit, number> = {
    [TimeUnit.Minutes]: 60,
    [TimeUnit.Hours]: 24,
    [TimeUnit.Days]: 31,
    [TimeUnit.Weeks]: 51,
};

/** Fails with `max` when the value is above what the sibling `unit` control's unit accepts. */
function everyWithinUnitValidator(control: AbstractControl): MaybeNull<ValidationErrors> {
    const unit = enumValueOf(TimeUnit, control.parent?.get("unit")?.value);
    const value: unknown = control.value;
    if (unit === undefined || typeof value !== "number") {
        return null;
    }
    const max = MAX_EVERY_PER_UNIT[unit];
    return value > max ? { max: { max, actual: value } } : null;
}

@Component({
    selector: "app-time-delta-form",
    templateUrl: "./time-delta-form.component.html",
    styleUrls: ["./time-delta-form.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [
        //-----//
        ReactiveFormsModule,
        //-----//
        FormValidationErrorsDirective,
    ],
})
export class TimeDeltaFormComponent extends BaseComponent implements OnInit, OnChanges {
    @Input({ required: true }) public form: FormGroup<TimeDeltaFormType>;
    @Input() public label: string = "Launch every:";
    @Input() public excludeUnits: TimeUnit[] = [];

    public readonly TimeUnit: typeof TimeUnit = TimeUnit;
    private readonly cdr = inject(ChangeDetectorRef);

    public availableUnits: { value: TimeUnit; label: string }[] = [];

    public ngOnInit(): void {
        this.updateAvailableUnits();
        this.subscribeToFormStatusChanges();
    }

    public ngOnChanges(): void {
        this.updateAvailableUnits();
    }

    private updateAvailableUnits(): void {
        const allUnits = [
            { value: TimeUnit.Minutes, label: "Minutes" },
            { value: TimeUnit.Hours, label: "Hours" },
            { value: TimeUnit.Days, label: "Days" },
            { value: TimeUnit.Weeks, label: "Weeks" },
        ];

        this.availableUnits = allUnits.filter((unit) => !this.excludeUnits.includes(unit.value));
    }

    public static buildForm(): FormGroup<TimeDeltaFormType> {
        const form = new FormGroup<TimeDeltaFormType>({
            every: new FormControl<MaybeNull<number>>({ value: null, disabled: false }, [
                Validators.required,
                ...integerInRangeValidators(1),
                everyWithinUnitValidator,
            ]),
            unit: new FormControl<MaybeNull<TimeUnit>>({ value: null, disabled: false }, [Validators.required]),
        });
        // The group owns both controls, so the subscription ends with it.
        form.controls.unit.valueChanges.subscribe(() => form.controls.every.updateValueAndValidity());
        return form;
    }

    public get everyControl(): FormControl<MaybeNull<number>> {
        return this.form.controls.every;
    }

    public get unitControl(): FormControl<MaybeNull<TimeUnit>> {
        return this.form.controls.unit;
    }

    private subscribeToFormStatusChanges(): void {
        this.form.statusChanges.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => {
            this.cdr.markForCheck();
        });
    }
}
