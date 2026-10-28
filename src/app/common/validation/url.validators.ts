/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";

import { MaybeNull } from "@interface/app.types";

export type UrlScheme = "http" | "https" | "ws" | "wss" | "ftp" | "ftps";

/** A `${{ ... }}` template, which the backend replaces with a dataset variable's value when it fetches. */
const TEMPLATE = /\$\{\{[^}]*\}\}/g;
const TEMPLATE_START = "${{";

export interface UrlValidatorOptions {
    /**
     * Accept templates in the URL. A template's value is unknown until the backend fetches, so only the text around the
     * templates is checked: no whitespace, an accepted scheme where the scheme is written out, and a valid host where
     * no template touches it.
     */
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
        const valid =
            options.templates && value.includes(TEMPLATE_START)
                ? isTemplatedUrlWithScheme(value, schemes)
                : isUrlWithScheme(value, schemes);
        return valid ? null : { url: { schemes } };
    };
}

function isTemplatedUrlWithScheme(value: string, schemes: readonly UrlScheme[]): boolean {
    if (/\s/.test(value.replace(TEMPLATE, ""))) {
        return false;
    }
    const head = value.slice(0, value.indexOf(TEMPLATE_START)).toLowerCase();
    const schemeEnd = head.indexOf("://");
    if (schemeEnd === -1) {
        // The first template can still complete the scheme, or hold it, as in `${{ env.BASE_URL }}/data.csv`.
        return schemes.some((scheme) => `${scheme}://`.startsWith(head));
    }
    const scheme = head.slice(0, schemeEnd);
    if (!schemes.some((accepted) => accepted === scheme)) {
        return false;
    }
    const authority = value.slice(schemeEnd + 3).split(/[/?#]/)[0];
    return authority.includes(TEMPLATE_START) || isUrlWithScheme(`${scheme}://${authority}/`, schemes);
}

function isUrlWithScheme(value: string, schemes: readonly UrlScheme[]): boolean {
    const url = URL.canParse(value) ? new URL(value) : null;
    return (
        url !== null &&
        url.hostname !== "" &&
        schemes.some((scheme) => url.protocol === `${scheme}:`) &&
        !/\s/.test(value)
    );
}
