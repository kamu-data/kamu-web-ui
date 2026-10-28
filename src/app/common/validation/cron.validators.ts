/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { AbstractControl, ValidationErrors } from "@angular/forms";

import { MaybeNull } from "@interface/app.types";

const MONTH_NAMES: Readonly<Record<string, number>> = {
    JAN: 1,
    FEB: 2,
    MAR: 3,
    APR: 4,
    MAY: 5,
    JUN: 6,
    JUL: 7,
    AUG: 8,
    SEP: 9,
    OCT: 10,
    NOV: 11,
    DEC: 12,
};

/** Sunday is 1, as in kamu-cli's `cron` crate. */
const WEEKDAY_NAMES: Readonly<Record<string, number>> = {
    SUN: 1,
    MON: 2,
    TUE: 3,
    WED: 4,
    THU: 5,
    FRI: 6,
    SAT: 7,
};

/**
 * Fails with `invalidCronExpression`, whose value is the message, when a non-empty value is not a 5-field
 * expression kamu-cli's `cron` crate accepts. Month and day-of-week names are accepted in their own field only.
 */
export function cronValidator(control: AbstractControl): MaybeNull<ValidationErrors> {
    const cron = typeof control.value === "string" ? control.value.trim() : "";

    if (!cron) {
        return null;
    }

    const parts = cron.split(/\s+/);
    if (parts.length !== 5) {
        return {
            invalidCronExpression: `Cron expression must consist of 5 fields (minute, hour, day of month, month, day of week), but got ${parts.length}.`,
        };
    }

    const [minute, hour, day, month, weekday] = parts;
    const errors: string[] = [];

    validatePart(minute, 0, 59, "Minute", errors);
    validatePart(hour, 0, 23, "Hour", errors);
    validatePart(day, 1, 31, "Day of month", errors);
    validatePart(month, 1, 12, "Month", errors, MONTH_NAMES);
    validatePart(weekday, 1, 7, "Day of week", errors, WEEKDAY_NAMES);

    return errors.length ? { invalidCronExpression: errors.join(" ") } : null;
}

function validatePart(
    part: string,
    min: number,
    max: number,
    label: string,
    errors: string[],
    names: Readonly<Record<string, number>> = {},
) {
    const validPattern =
        /^((\*|\?|[A-Z]+|\d+|\d+-\d+|\d+\/\d+|\*\/\d+|\d+-\d+\/\d+|[A-Z]+-[A-Z]+(\/\d+)?)(,(\*|\?|[A-Z]+|\d+|\d+-\d+|\d+\/\d+|\*\/\d+|\d+-\d+\/\d+|[A-Z]+-[A-Z]+(\/\d+)?))*)$/;

    if (part === "?" && !["Minute", "Hour", "Month"].includes(label)) {
        return;
    }

    if (!validPattern.test(part.toUpperCase())) {
        errors.push(`${label} has invalid format: "${part}".`);
        return;
    }

    // Each entry is `start`, `start-end` or `*`, optionally followed by `/step`. kamu-cli's `cron` crate requires
    // values within the field's bounds, a range that does not run backwards, and a step from 1 to the field's maximum.
    const values = part.split(",").flatMap((entry) => {
        const [base, stepText] = entry.split("/");
        if (stepText !== undefined) {
            const step = Number(stepText);
            if (step < 1 || step > max) {
                errors.push(`${label} step must be between 1 and ${max}, but got ${stepText}.`);
                return [];
            }
        }
        if (base === "*") {
            return [];
        }
        const [fromText, toText] = base.split("-");
        const from = parseCronValue(fromText, names);
        if (toText === undefined) {
            if (from === null) {
                errors.push(`${label} has invalid value: "${entry}".`);
                return [];
            }
            return [from];
        }
        const to = parseCronValue(toText, names);
        if (from === null || to === null || from > to) {
            errors.push(`${label} has invalid range: "${entry}".`);
            return [];
        }
        return [from, to];
    });

    values.forEach((v) => {
        if (v < min || v > max) {
            errors.push(`${label} must be between ${min} and ${max}, but got ${v}.`);
        }
    });
}

function parseCronValue(input: string, names: Readonly<Record<string, number>>): MaybeNull<number> {
    const named = names[input.toUpperCase()];
    if (named !== undefined) {
        return named;
    }

    const num = Number(input);
    return isNaN(num) ? null : num;
}
