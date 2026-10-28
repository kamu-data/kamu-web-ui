/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

/** The error keys `appFieldError` has a message for; a validator whose errors it shows uses one of them. */
export const VALIDATION_ERRORS = [
    "required",
    "minlength",
    "maxlength",
    "maxBytes",
    "passwordsMismatch",
    "email",
    "min",
    "max",
    "integer",
    "blank",
    "singleChar",
    "format",
    "url",
    "invalidCronExpression",
    "duplicate",
    "duplicateItems",
    "requiredUnless",
    "server",
] as const;

export type ValidationError = (typeof VALIDATION_ERRORS)[number];
