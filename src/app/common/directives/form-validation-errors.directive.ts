/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { Directive, ElementRef, Input, OnChanges, OnDestroy, SimpleChanges } from "@angular/core";
import { FormGroup, AbstractControl, ValidationErrors } from "@angular/forms";
import { Subscription, tap } from "rxjs";
import AppValues from "../values/app.values";
import { ValidationError, ValidationErrorTuple } from "./form-validation-errors.types";
import { NgSelectComponent } from "@ng-select/ng-select";

@Directive({
    selector: "[appFieldError]",
})
export class FormValidationErrorsDirective implements OnDestroy, OnChanges {
    @Input({ required: true }) public appFieldError:
        | ValidationError
        | ValidationError[]
        | ValidationErrorTuple
        | ValidationErrorTuple[];
    @Input() public input: HTMLInputElement | NgSelectComponent | undefined;
    @Input({ required: true }) public group: FormGroup;
    @Input() public fieldControl: AbstractControl | null;
    @Input() public fieldLabel: string | undefined;

    private readonly nativeElement: HTMLElement;
    private controlSubscription: Subscription | undefined;
    private ngSelectStatusSubscription: Subscription | undefined;
    private ngSelectBlurSubscription: Subscription | undefined;
    private readonly MIN_REQUIRED_LENGTH = 2;
    private readonly MAX_REQUIRED_LENGTH = 100;

    public constructor(private el: ElementRef) {
        this.nativeElement = this.el.nativeElement as HTMLElement;
    }

    /* istanbul ignore next */
    public renderErrors(errors: string) {
        this.nativeElement.innerText = errors;
    }

    /* istanbul ignore next */
    public getStandardErrorMessage(error: ValidationError): string {
        const label = this.fieldLabel || "Input";

        const errorDetails = this.fieldControl?.getError(error) as ValidationErrors;
        switch (error) {
            case "required":
                return `${label} is required`;
            case "minlength":
                return `${label} must be at least ${errorDetails?.requiredLength ?? this.MIN_REQUIRED_LENGTH} characters`;
            case "maxlength":
                return `${label} can't exceed ${errorDetails?.requiredLength ?? this.MAX_REQUIRED_LENGTH} characters`;
            case "invalid":
                return `A valid ${label} is required`;
            case "pattern": {
                const keyPattern = errorDetails?.requiredPattern as string;
                return `${label} ${this.patternMessages[keyPattern]}`;
            }

            default:
                return "Unknown validator";
        }
    }

    /* istanbul ignore next */
    public updateErrorMessage() {
        const errorsToDisplay: string[] = [];
        const errors = Array.isArray(this.appFieldError) ? this.appFieldError : [this.appFieldError];
        errors.forEach((error: ValidationError | { error: ValidationError; message: string }) => {
            const errorCode = typeof error === "object" ? error.error : error;
            const message =
                typeof error === "object" ? () => error.message : () => this.getStandardErrorMessage(errorCode);
            const errorChecker =
                errorCode === "invalid"
                    ? () => this.fieldControl?.invalid
                    : () => this.fieldControl?.hasError(errorCode);
            if (errorChecker()) {
                errorsToDisplay.push(message());
            }
        });

        if (errorsToDisplay.length) {
            this.renderErrors(errorsToDisplay[0]);
        } else {
            this.renderErrors("");
        }
    }

    public ngOnDestroy(): void {
        this.unsubscribe();
    }

    public unsubscribe(): void {
        this.controlSubscription?.unsubscribe();
        this.ngSelectStatusSubscription?.unsubscribe();
        this.ngSelectBlurSubscription?.unsubscribe();
        this.controlSubscription = undefined;
        this.ngSelectStatusSubscription = undefined;
        this.ngSelectBlurSubscription = undefined;
    }

    /* istanbul ignore next */
    public initFieldControl() {
        if (this.input && this.group) {
            if (this.input instanceof HTMLInputElement) {
                const controlName = this.input.getAttribute("formControlName") ?? "";
                this.fieldControl = this.fieldControl || this.group.get(controlName);

                if (!this.fieldControl) {
                    throw new Error(`[appFieldError] couldn't bind to control ${controlName}`);
                }
                this.unsubscribe();

                this.controlSubscription = this.fieldControl?.valueChanges
                    .pipe(tap(() => this.updateErrorMessage()))
                    .subscribe();
            }

            if (this.input instanceof NgSelectComponent) {
                this.ngSelectStatusSubscription = this.fieldControl?.statusChanges.subscribe(() => {
                    this.updateErrorMessage();
                });
                this.ngSelectBlurSubscription = this.input.blurEvent.subscribe(() => {
                    this.updateErrorMessage();
                });
            }
        }
    }

    /* istanbul ignore next */
    public ngOnChanges(changes: SimpleChanges): void {
        this.initFieldControl();
        if (changes.input && changes.input.firstChange) {
            if (this.input) {
                (this.input as HTMLInputElement).onblur = () => this.updateErrorMessage();
            } else {
                throw new Error(`appFieldError directive [input] parameter couldn't bind to any input element`);
            }
        }
    }

    private patternMessages: { [pattern: string]: string } = {
        [String(AppValues.URL_PATTERN_ONLY_HTTPS)]: 'must start with "https://"',
    };
}
