/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { EventEmitter, Input, OnInit, Output, Directive, ChangeDetectorRef, inject } from "@angular/core";
import { AbstractControl, ControlValueAccessor, FormGroup, ValidationErrors, Validator } from "@angular/forms";
import { BaseComponent } from "./base.component";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";

/**
 * Abstract base class for form components that implement ControlValueAccessor.
 * Provides common functionality for form management, value propagation, and disabled state handling.
 *
 * @template TValue - The type of the form value object
 */
@Directive()
export abstract class BaseFormControlComponent<TValue>
    extends BaseComponent
    implements OnInit, ControlValueAccessor, Validator
{
    @Input() public disabled: boolean = false;
    @Output() public formChange = new EventEmitter<FormGroup>();

    private readonly cdr = inject(ChangeDetectorRef);

    protected abstract form: FormGroup;

    private onChange = (_value: TValue) => {};
    private onTouched = () => {};
    private onValidatorChange: () => void = () => {};

    private isWriting = false;

    public ngOnInit(): void {
        this.initializeForm();
        this.subscribeToFormChanges();
    }

    public writeValue(value: TValue): void {
        this.isWriting = true;
        if (value) {
            this.form.patchValue(value, { emitEvent: false });
        } else {
            this.form.reset();
        }
        this.isWriting = false;
    }

    public registerOnChange(fn: (value: TValue) => void): void {
        this.onChange = fn;
    }

    public registerOnTouched(fn: () => void): void {
        this.onTouched = fn;
    }

    public registerOnValidatorChange?(fn: () => void): void {
        this.onValidatorChange = fn;
    }

    public setDisabledState(isDisabled: boolean): void {
        this.disabled = isDisabled;
        if (isDisabled) {
            this.form.disable();
        } else {
            this.form.enable();
        }

        this.cdr.markForCheck();
    }

    /**
     * Override this method to perform additional form initialization logic.
     * Called before form change subscriptions are set up.
     */
    protected initializeForm(): void {
        // Override in subclasses if needed
    }

    /**
     * Override this method to customize how form changes are handled.
     * Default implementation emits onChange and formChange events.
     */
    protected onFormValueChange(value: TValue): void {
        if (this.isWriting) {
            // Prevent recursive calls when writing value
            return;
        }
        this.onChange(value);
        this.formChange.emit(this.form);
    }

    /**
     * Override this method to customize how form status changes are handled.
     * Default implementation calls onTouched.
     */
    protected onFormStatusChange(): void {
        this.onTouched();
        this.onValidatorChange();
    }

    public validate(_: AbstractControl): ValidationErrors | null {
        if (this.form.valid) return null;

        const errors: ValidationErrors = {};

        Object.entries(this.form.controls).forEach(([key, ctrl]) => {
            if (ctrl.invalid) {
                errors[key] = ctrl.errors;
            }
        });

        return errors;
    }

    private subscribeToFormChanges(): void {
        this.form.valueChanges.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((value) => {
            this.onFormValueChange(value as TValue);
        });

        this.form.statusChanges.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => {
            this.onFormStatusChange();
        });
    }
}
