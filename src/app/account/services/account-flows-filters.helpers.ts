/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { MAX_CONSECUTIVE_FAILURES } from "@common/validation/patterns";

/** A whole number of consecutive failures from `min` to 10; anything else the input allows becomes the nearest one. */
export function clampConsecutiveFailures(value: unknown, min: number): number {
    const number = typeof value === "number" && Number.isFinite(value) ? Math.round(value) : min;
    return Math.min(Math.max(number, min), MAX_CONSECUTIVE_FAILURES);
}
