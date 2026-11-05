/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

/** The triage mode lists failing processes only, so it asks for at least one failure */
export const MIN_CONSECUTIVE_FAILURES_TRIAGE = 1;
export const MIN_CONSECUTIVE_FAILURES_CUSTOM = 0;

/**
 * A whole number of consecutive failures, at least `min`; anything else the input allows becomes the nearest one.
 * There is no maximum: a flow whose stop policy is "never" keeps counting failures.
 */
export function clampConsecutiveFailures(value: unknown, min: number): number {
    const number = typeof value === "number" && Number.isFinite(value) ? Math.round(value) : min;
    return Math.max(number, min);
}
