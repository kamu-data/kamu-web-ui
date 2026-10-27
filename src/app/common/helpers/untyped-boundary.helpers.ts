/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { HttpErrorResponse } from "@angular/common/http";
import { AbstractControl, ValidationErrors } from "@angular/forms";
import { Data } from "@angular/router";

import { parse } from "yaml";

import { MaybeNull, MaybeUndefined } from "@interface/app.types";

// The only type assertions app code makes: values that arrive as `any`, whose shape only the caller
// knows. Nothing checks it, so a wrong claim surfaces where the value is read. eslint exempts this
// file from `consistent-type-assertions`.

/** Parses JSON whose shape the caller knows: the app's own storage, a config file, an API field holding JSON. */
export function parseJsonAs<T>(text: string): T {
    return JSON.parse(text) as T;
}

/** Parses YAML whose shape the caller knows, such as a metadata event the API encoded. */
export function parseYamlAs<T>(text: string): T {
    return parse(text) as T;
}

/**
 * The value of a form whose type does not say its shape: one whose controls are added at runtime
 * from config, such as the source event editor, or the untyped form behind a custom form control.
 * It is the form's own value object, not a copy.
 */
export function formValueAs<T>(control: AbstractControl): T {
    return control.value as T;
}

/** The detail a validator stored under `key` in its errors, in the type that validator stores. */
export function validationErrorAs<T>(errors: MaybeNull<ValidationErrors>, key: string): MaybeUndefined<T> {
    return errors?.[key] as MaybeUndefined<T>;
}

/** A value another route's resolver stored under `key`, in the type that resolver returns. */
export function routeDataAs<T>(data: Data, key: string): T {
    return data[key] as T;
}

/** The body of an HTTP error response, in the shape the endpoint documents for that status. */
export function httpErrorBodyAs<T>(error: HttpErrorResponse): T {
    return error.error as T;
}
