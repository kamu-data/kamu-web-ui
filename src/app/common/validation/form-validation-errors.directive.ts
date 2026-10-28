/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { DestroyRef, Directive, ElementRef, inject, Input, isDevMode, OnChanges } from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { AbstractControl, FormArray, FormGroup, ValidationErrors } from "@angular/forms";

import { Subscription } from "rxjs";

import { NgSelectComponent } from "@ng-select/ng-select";

import { isRecord, oneOf } from "@common/helpers/app.helpers";
import { VALIDATION_ERRORS, ValidationError } from "@common/validation/form-validation-errors.types";
import { MaybeNull, MaybeNullOrUndefined, MaybeUndefined } from "@interface/app.types";

/** A number a validator stored in its error details. */
function numberDetail(details: unknown, key: string): MaybeUndefined<number> {
    const value = isRecord(details) ? details[key] : undefined;
    return typeof value === "number" ? value : undefined;
}

/** A string a validator stored in its error details. */
function stringDetail(details: unknown, key: string): MaybeUndefined<string> {
    const value = isRecord(details) ? details[key] : undefined;
    return typeof value === "string" ? value : undefined;
}

function urlSchemesDetail(details: unknown): string {
    const schemes = isRecord(details) ? details.schemes : undefined;
    const names = Array.isArray(schemes) ? schemes.filter((scheme) => typeof scheme === "string") : [];
    return names.map((scheme) => `${scheme}://`).join(", ");
}

/** The message for one error of a field. */
export function validationErrorMessage(label: string, error: ValidationError, details: unknown): string {
    switch (error) {
        case "required":
            return `${label} is required`;
        case "minlength":
            return `${label} must be at least ${numberDetail(details, "requiredLength")} characters`;
        case "maxlength":
            return `${label} can't exceed ${numberDetail(details, "requiredLength")} characters`;
        case "maxBytes":
            return `${label} can't exceed ${numberDetail(details, "max")} bytes`;
        case "passwordsMismatch":
            return "Passwords mismatch";
        case "email":
            return "Please provide a valid email address";
        case "min":
            return `${label} must be at least ${numberDetail(details, "min")}`;
        case "max":
            return `${label} must be at most ${numberDetail(details, "max")}`;
        case "integer":
            return `${label} must be a whole number`;
        case "blank":
            return `${label} can't be blank`;
        case "singleChar":
            return `${label} must be a single ASCII character`;
        case "format":
            return `${label} ${stringDetail(details, "message") ?? "has the wrong format"}`;
        case "url": {
            const schemes = urlSchemesDetail(details);
            return schemes === "" ? `${label} must be a URL` : `${label} must be a URL starting with ${schemes}`;
        }
        case "invalidCronExpression":
            return typeof details === "string" ? details : `${label} is not a valid cron expression`;
        case "duplicate":
            return `${label} already exists`;
        case "requiredUnless": {
            const sibling = stringDetail(details, "sibling");
            return sibling === undefined ? `${label} is required` : `${label} is required unless ${sibling} is set`;
        }
        case "duplicateItems": {
            const value = stringDetail(details, "value");
            return value === undefined
                ? `${label} contains a value more than once`
                : `${label} contains "${value}" more than once`;
        }
        case "server":
            return stringDetail(details, "message") ?? `${label} was rejected by the server`;
    }
}

/**
 * The message for the first of a field's errors. In dev mode, and so in every spec, an error key with no message
 * throws, which makes a validator added without a message fail the specs of the form that uses it.
 */
export function fieldErrorMessage(label: string, errors: ValidationErrors): string {
    const [key] = Object.keys(errors);
    const error = oneOf(VALIDATION_ERRORS, key);
    if (error !== undefined) {
        return validationErrorMessage(label, error, errors[key]);
    }
    if (isDevMode()) {
        throw new Error(`[appFieldError] "${label}" has the error "${key}", which has no message`);
    }
    return `${label} is invalid`;
}

/**
 * Renders, into its element, the message for the first error of a form control once the user has touched or
 * changed it. The control is `fieldControl`, or the control of `group` that `input` is bound to by
 * `formControlName`.
 */
@Directive({
    selector: "[appFieldError]",
})
export class FormValidationErrorsDirective implements OnChanges {
    @Input() public input: MaybeUndefined<
        HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement | NgSelectComponent
    >;
    @Input() public group: MaybeUndefined<FormGroup | FormArray>;
    @Input() public fieldControl: MaybeNullOrUndefined<AbstractControl>;
    @Input({ required: true }) public fieldLabel: string;
    @Input() public dataTestId: string = "";

    private readonly nativeElement = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;
    private readonly destroyRef = inject(DestroyRef);
    private control: MaybeNull<AbstractControl> = null;
    private controlSubscription: MaybeUndefined<Subscription>;

    public ngOnChanges(): void {
        this.nativeElement.setAttribute("data-test-id", this.dataTestId);
        const control = this.fieldControl ?? this.boundControl();
        if (control !== this.control) {
            this.control = control;
            this.controlSubscription?.unsubscribe();
            this.controlSubscription = control.events
                .pipe(takeUntilDestroyed(this.destroyRef))
                .subscribe(() => this.renderError());
        }
        this.renderError();
    }

    private boundControl(): AbstractControl {
        const controlName =
            this.input && !(this.input instanceof NgSelectComponent)
                ? this.input.getAttribute("formControlName")
                : null;
        const control = controlName === null ? null : this.group?.get(controlName);
        if (!control) {
            throw new Error(`[appFieldError] "${this.fieldLabel}" is bound to no control`);
        }
        return control;
    }

    private renderError(): void {
        const control = this.control;
        const errors = control?.errors;
        this.nativeElement.innerText =
            !control || !errors || (!control.touched && !control.dirty)
                ? ""
                : fieldErrorMessage(this.fieldLabel, errors);
    }
}
