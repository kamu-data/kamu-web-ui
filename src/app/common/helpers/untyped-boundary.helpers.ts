/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { Data } from "@angular/router";

import { parse } from "yaml";

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

/** A value another route's resolver stored under `key`, in the type that resolver returns. */
export function routeDataAs<T>(data: Data, key: string): T {
    return data[key] as T;
}
