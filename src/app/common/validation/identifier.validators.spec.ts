/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { FormControl, ValidationErrors, ValidatorFn, Validators } from "@angular/forms";

import { envVarKeyValidators, odfNameValidators } from "@common/validation/identifier.validators";
import { ValidationPatterns } from "@common/validation/patterns";
import { MaybeNull } from "@interface/app.types";

function check(validators: ValidatorFn[], value: string): MaybeNull<ValidationErrors> {
    return new FormControl(value, Validators.compose(validators)).errors;
}

describe("Identifier validators", () => {
    describe("odfNameValidators", () => {
        const formatError = { format: { message: ValidationPatterns.ODF_NAME.message } };

        // Accepted and rejected names follow the kamu-cli grammar for DatasetName and AccountName.
        ["a", "my-dataset", "com.example.data", "2024-data", "A.b-C.d", "a".repeat(100)].forEach((name) => {
            it(`should accept "${name.length > 20 ? `${name.length} characters` : name}"`, () => {
                expect(check(odfNameValidators(), name)).toBeNull();
            });
        });

        ["a-", "-a", "a--b", "a.", ".a", "a..b", "a_b", "a b", "a/b", "dätä", "a.-b"].forEach((name) => {
            it(`should reject "${name}"`, () => {
                expect(check(odfNameValidators(), name)).toEqual(formatError);
            });
        });

        it("should reject a name over 100 characters", () => {
            expect(check(odfNameValidators(), "a".repeat(101))).toEqual({
                maxlength: { requiredLength: 100, actualLength: 101 },
            });
        });

        it("should answer quickly on a long name ending in an invalid character", () => {
            const started = performance.now();
            check(odfNameValidators(), `${"a".repeat(5000)}!`);
            expect(performance.now() - started).toBeLessThan(100);
        });
    });

    describe("envVarKeyValidators", () => {
        ["A", "_A", "API_KEY_2", "lower_case"].forEach((key) => {
            it(`should accept "${key}"`, () => {
                expect(check(envVarKeyValidators(), key)).toBeNull();
            });
        });

        ["2KEY", "A-B", "A.B", "A B", "KÉY"].forEach((key) => {
            it(`should reject "${key}"`, () => {
                expect(check(envVarKeyValidators(), key)).toEqual({
                    format: { message: ValidationPatterns.ENV_VAR_KEY.message },
                });
            });
        });
    });
});
