/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { FormControl, FormGroup, ValidationErrors, Validators } from "@angular/forms";

import {
    matchFieldsValidator,
    newPasswordValidators,
    trimmedMinLengthValidator,
} from "@common/validation/password.validators";
import { MaybeNull } from "@interface/app.types";

describe("Password validators", () => {
    describe("trimmedMinLengthValidator", () => {
        [
            { value: "", expected: null },
            { value: "12345678", expected: null },
            { value: "1234567", expected: { minlength: { requiredLength: 8, actualLength: 7 } } },
            { value: " 1234567 ", expected: { minlength: { requiredLength: 8, actualLength: 7 } } },
        ].forEach(({ value, expected }) => {
            it(`should check ${JSON.stringify(value)}`, () => {
                expect(trimmedMinLengthValidator(8)(new FormControl(value))).toEqual(expected);
            });
        });
    });

    describe("newPasswordValidators", () => {
        function check(value: string, configuredMinLength: number): MaybeNull<ValidationErrors> {
            return new FormControl(value, Validators.compose(newPasswordValidators(configuredMinLength))).errors;
        }

        it("should never accept fewer characters than the server does", () => {
            expect(check("1234567", 4)).toEqual({ minlength: { requiredLength: 8, actualLength: 7 } });
        });

        it("should apply a configured minimum above the server's", () => {
            expect(check("1234567890", 12)).toEqual({ minlength: { requiredLength: 12, actualLength: 10 } });
        });

        it("should reject characters outside ASCII", () => {
            expect(check("pässwörd", 8)).toEqual({ format: { message: "may only contain ASCII characters" } });
        });
    });

    describe("matchFieldsValidator", () => {
        function form(password: string, confirm: string): FormGroup {
            return new FormGroup(
                {
                    newPassword: new FormControl(password),
                    confirmPassword: new FormControl(confirm, [Validators.required, Validators.minLength(8)]),
                },
                { validators: matchFieldsValidator("newPassword", "confirmPassword") },
            );
        }

        it("should mark the confirmation while it differs", () => {
            expect(form("password1", "password2").controls.confirmPassword.errors).toEqual({ passwordsMismatch: true });
        });

        it("should clear the mismatch once the values match", () => {
            const group = form("password1", "password2");
            group.controls.confirmPassword.setValue("password1");
            expect(group.controls.confirmPassword.errors).toBeNull();
        });

        it("should keep the confirmation's own errors", () => {
            const group = form("short", "short");
            expect(group.controls.confirmPassword.errors).toEqual({
                minlength: { requiredLength: 8, actualLength: 5 },
            });

            group.controls.newPassword.setValue("shorter");
            expect(group.controls.confirmPassword.errors).toEqual({
                minlength: { requiredLength: 8, actualLength: 5 },
                passwordsMismatch: true,
            });
        });

        it("should throw when a control is missing", () => {
            expect(
                () =>
                    new FormGroup(
                        { newPassword: new FormControl("") },
                        { validators: matchFieldsValidator("newPassword", "confirmPassword") },
                    ),
            ).toThrow("[matchFieldsValidator]: One of the controls was not found.");
        });
    });
});
