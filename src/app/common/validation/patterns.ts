/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

/** A regular expression a value must match, with the message shown after the field label when it does not. */
export interface FormatRule {
    regex: RegExp;
    message: string;
}

export const ValidationPatterns = {
    /** kamu-cli `DatasetName` and `AccountName` grammar: hostname labels joined by dots. */
    ODF_NAME: {
        regex: /^[A-Za-z0-9]+(-[A-Za-z0-9]+)*(\.[A-Za-z0-9]+(-[A-Za-z0-9]+)*)*$/,
        message: "may only contain letters, digits, single hyphens and dots between them",
    },
    /** kamu-cli variable and secret key grammar. */
    ENV_VAR_KEY: {
        regex: /^[A-Za-z_][A-Za-z0-9_]*$/,
        message: "may only contain letters, digits and underscores, and can't start with a digit",
    },
} as const satisfies Record<string, FormatRule>;

/** kamu-cli stores dataset and account names in VARCHAR(100) columns. */
export const ODF_NAME_MAX_LENGTH = 100;
/** kamu-cli stores variable and secret keys in a VARCHAR(200) column. */
export const ENV_VAR_KEY_MAX_LENGTH = 200;
/** kamu-cli stops a flow after at most 10 consecutive failures (`MAX_CONSECUTIVE_FAILURES_COUNT`). */
export const MAX_CONSECUTIVE_FAILURES = 10;
