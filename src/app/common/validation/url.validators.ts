/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";

import { MaybeNull } from "@interface/app.types";

export type UrlScheme = "http" | "https" | "ws" | "wss" | "ftp" | "ftps";

/**
 * Fails with `url` when a non-empty value is not an absolute URL with a host and one of the schemes.
 * The error carries the schemes, so the message can list them.
 */
export function urlValidator(schemes: readonly UrlScheme[]): ValidatorFn {
    return (control: AbstractControl): MaybeNull<ValidationErrors> => {
        const value: unknown = control.value;
        if (typeof value !== "string" || value === "") {
            return null;
        }
        const url = URL.canParse(value) ? new URL(value) : null;
        const valid =
            url !== null &&
            url.hostname !== "" &&
            schemes.some((scheme) => url.protocol === `${scheme}:`) &&
            !/\s/.test(value);
        return valid ? null : { url: { schemes } };
    };
}
