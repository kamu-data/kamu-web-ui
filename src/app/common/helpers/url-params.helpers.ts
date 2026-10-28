/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { MaybeNull, MaybeNullOrUndefined, MaybeUndefined } from "@interface/app.types";

// Each format matches what the API accepts for the scalar, and is never stricter than it:
// a value it lets through may still be unknown to the API, but never refused as malformed.

const MAX_U64 = 2n ** 64n - 1n;

const ODF_NAME_PATTERN = /^[A-Za-z0-9]+(-[A-Za-z0-9]+)*(\.[A-Za-z0-9]+(-[A-Za-z0-9]+)*)*$/;

const UUID_PATTERN = /^(urn:uuid:)?\{?[0-9a-f]{8}-?[0-9a-f]{4}-?[0-9a-f]{4}-?[0-9a-f]{4}-?[0-9a-f]{12}\}?$/i;

const MULTIBASE_PATTERN = /^(f([0-9a-f]{2})+|u[A-Za-z0-9_-]+|z[1-9A-HJ-NP-Za-km-z]+)$/i;

/** Whether `value` is a `FlowID`: an unsigned 64-bit integer in decimal */
export function isFlowId(value: string): boolean {
    return /^\+?\d+$/.test(value) && BigInt(value.replace("+", "")) <= MAX_U64;
}

/** Whether `value` is a UUID, the format of `WebhookSubscriptionID` and `DeviceCode` */
export function isUuid(value: string): boolean {
    return UUID_PATTERN.test(value);
}

/** Whether `value` is an `AccountName` or a `DatasetName`; both follow the ODF hostname grammar */
export function isOdfName(value: string): boolean {
    return ODF_NAME_PATTERN.test(value);
}

/** Whether `value` is a `Multihash` in one of the multibase encodings the API decodes */
export function isMultihash(value: string): boolean {
    return MULTIBASE_PATTERN.test(value);
}

/**
 * Input transform for a query parameter bound to a component input: the router binds a parameter
 * repeated in the URL as an array, which reads here as its first value, as `queryParamMap.get` does.
 */
export function queryParamValue(value: unknown): MaybeUndefined<string> {
    const first: unknown = Array.isArray(value) ? value[0] : value;
    return typeof first === "string" ? first : undefined;
}

/** The number a URL parameter such as a page holds, or `null` when it is missing or not a positive whole number */
export function positiveIntegerFromParam(param: MaybeNullOrUndefined<string>): MaybeNull<number> {
    if (!param || !/^\d+$/.test(param)) {
        return null;
    }
    const value = Number(param);
    return value >= 1 && Number.isSafeInteger(value) ? value : null;
}

/** Whether the path of `url` is `/<path>` or a page below it; the query string and fragment do not count */
export function isUrlWithin(url: string, path: string): boolean {
    const urlPath = url.split(/[?#]/)[0];
    return urlPath === `/${path}` || urlPath.startsWith(`/${path}/`);
}

/** The page the address bar shows, with its query string and fragment, as an in-app path to return to */
export function currentLocationPath(): string {
    const { pathname, search, hash } = window.location;
    return pathname + search + hash;
}

/** A path inside the app, such as the page to return to after login, or `undefined` for anything else */
export function inAppPathFromParam(param: MaybeNullOrUndefined<string>): MaybeUndefined<string> {
    return param && /^\/(?![/\\])/.test(param) ? param : undefined;
}

/**
 * A folder of a collection as the app writes it, `/` or `/a/b`: rooted, with no empty segment and no
 * trailing slash. A path that is not rooted reads as the root.
 */
export function collectionPathFromParam(param: MaybeNullOrUndefined<string>): string {
    if (!param?.startsWith("/")) {
        return "/";
    }
    return "/" + param.split("/").filter(Boolean).join("/");
}
