/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import {
    ChangeDetectionStrategy,
    Component,
    EventEmitter,
    forwardRef,
    Input,
    OnInit,
    Output,
} from "@angular/core";
import {
    ControlValueAccessor,
    FormControl,
    FormGroup,
    NG_VALUE_ACCESSOR,
    ValidatorFn,
    Validators,
} from "@angular/forms";
import { TimeUnit } from "src/app/api/kamu.graphql.interface";
import { BaseComponent } from "../base.component";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { everyTimeMapperValidators } from "src/app/common/helpers/data.helpers";
import { MaybeNull } from "src/app/interface/app.types";
import { TimeDeltaFormType, TimeDeltaFormValue } from "./time-delta-form.value";


@Component({
    selector: "app-time-delta-form",
    templateUrl: "./time-delta-form.component.html",
    styleUrls: ["./time-delta-form.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => TimeDeltaFormComponent),
            multi: true,
        },
    ],
})
export class TimeDeltaFormComponent extends BaseComponent implements OnInit, ControlValueAccessor {
    @Input() public disabled: boolean = false;
    @Input() public label: string = "Launch every:";
    @Output() public formChange = new EventEmitter<FormGroup<TimeDeltaFormType>>();

    public readonly TimeUnit: typeof TimeUnit = TimeUnit;
    
    private everyTimeMapperValidators: Record<TimeUnit, ValidatorFn> = everyTimeMapperValidators;

    public timeDeltaForm = new FormGroup<TimeDeltaFormType>({
        every: new FormControl<MaybeNull<number>>({ value: null, disabled: this.disabled }, [
            Validators.required,
            Validators.min(1),
        ]),
        unit: new FormControl<MaybeNull<TimeUnit>>({ value: null, disabled: this.disabled }, [Validators.required]),
    });

    private onChange = (_value: TimeDeltaFormValue) => {};
    private onTouched = () => {};

    public ngOnInit(): void {
        this.setEveryTimeValidator();
        this.subscribeToFormChanges();
    }

    public writeValue(value: TimeDeltaFormValue): void {
        if (value) {
            this.timeDeltaForm.patchValue(value, { emitEvent: false });
        }
    }

    public registerOnChange(fn: (value: TimeDeltaFormValue) => void): void {
        this.onChange = fn;
    }

    public registerOnTouched(fn: () => void): void {
        this.onTouched = fn;
    }

    public setDisabledState(isDisabled: boolean): void {
        this.disabled = isDisabled;
        if (isDisabled) {
            this.timeDeltaForm.disable();
        } else {
            this.timeDeltaForm.enable();
        }
    }

    public get everyControl(): FormControl<MaybeNull<number>> {
        return this.timeDeltaForm.controls.every;
    }

    public get unitControl(): FormControl<MaybeNull<TimeUnit>> {
        return this.timeDeltaForm.controls.unit;
    }

    private setEveryTimeValidator(): void {
        this.unitControl.valueChanges.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((data: MaybeNull<TimeUnit>) => {
            if (data) {
                this.everyControl.setValidators([this.everyTimeMapperValidators[data], Validators.required]);
                this.everyControl.updateValueAndValidity();
            }
        });
    }

    private subscribeToFormChanges(): void {
        this.timeDeltaForm.valueChanges.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((value) => {
            this.onChange(value as TimeDeltaFormValue);
            this.formChange.emit(this.timeDeltaForm);
        });

        this.timeDeltaForm.statusChanges.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => {
            this.onTouched();
        });
    }
}
