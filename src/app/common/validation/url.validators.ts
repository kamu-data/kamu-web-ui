/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";

import { MaybeNull } from "@interface/app.types";

export type UrlScheme = "http" | "https" | "ws" | "wss" | "ftp" | "ftps";

/** A kamu-cli `${{ ... }}` template, which kamu-cli replaces with a dataset variable's value when it fetches. */
const TEMPLATE = /\$\{\{[^}]*\}\}/g;

export interface UrlValidatorOptions {
    /** Accept templates in the URL, checking the rest of it as if each template were a plain word. */
    templates?: boolean;
}

/**
 * Fails with `url` when a non-empty value is not an absolute URL with a host and one of the schemes.
 * The error carries the schemes, so the message can list them.
 */
export function urlValidator(schemes: readonly UrlScheme[], options: UrlValidatorOptions = {}): ValidatorFn {
    return (control: AbstractControl): MaybeNull<ValidationErrors> => {
        const value: unknown = control.value;
        if (typeof value !== "string" || value === "") {
            return null;
        }
        if (options.templates && value.replace(TEMPLATE, "").trim() === "") {
            return null;
        }
        const checked = options.templates ? value.replace(TEMPLATE, "template") : value;
        const url = URL.canParse(checked) ? new URL(checked) : null;
        const valid =
            url !== null &&
            url.hostname !== "" &&
            schemes.some((scheme) => url.protocol === `${scheme}:`) &&
            !/\s/.test(checked);
        return valid ? null : { url: { schemes } };
    };
}
