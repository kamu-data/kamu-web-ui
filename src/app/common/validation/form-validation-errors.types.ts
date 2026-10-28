/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

/** Every error key a form control in the app can carry; `FormValidationErrorsDirective` has a message for each. */
export const VALIDATION_ERRORS = [
    "required",
    "minlength",
    "maxlength",
    "pattern",
    "passwordsMismatch",
    "email",
    "min",
    "max",
    "integer",
    "whitespace",
    "blank",
    "singleChar",
    "format",
    "url",
    "invalidCronExpression",
    "duplicate",
    "duplicateItems",
    "server",
] as const;

export type ValidationError = (typeof VALIDATION_ERRORS)[number];
