/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

export type ValidationError = "required" | "minlength" | "maxlength" | "invalid" | "pattern";

export type ValidationErrorTuple = {
    error: ValidationError;
    message: string;
};

export const ErrorSets: { [key: string]: ValidationError[] } = {
    TargetUrl: ["required", "pattern"],
};
