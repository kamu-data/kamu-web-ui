/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

/**
 * A whole number of consecutive failures, at least `min`; anything else the input allows becomes the nearest one.
 * There is no maximum: a flow whose stop policy is "never" keeps counting failures.
 */
export function clampConsecutiveFailures(value: unknown, min: number): number {
    const number = typeof value === "number" && Number.isFinite(value) ? Math.round(value) : min;
    return Math.max(number, min);
}
