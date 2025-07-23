/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { AbstractControl, ValidationErrors } from "@angular/forms";

export function cronValidator(control: AbstractControl): ValidationErrors | null {
    const cron = (control.value as string)?.trim();

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
    validatePart(month, 1, 12, "Month", errors, true); // allow JAN, FEB, ...
    validatePart(weekday, 1, 7, "Day of week", errors, true); // allow MON, TUE, ...

    return errors.length ? { invalidCronExpression: errors.join(" ") } : null;
}

function validatePart(part: string, min: number, max: number, label: string, errors: string[], allowNamed = false) {
    const namedValuesMap: Record<string, number> = allowNamed
        ? {
              // Days of week
              SUN: 1,
              MON: 2,
              TUE: 3,
              WED: 4,
              THU: 5,
              FRI: 6,
              SAT: 7,
              // Months
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
          }
        : {}; // no named values allowed if false

    const validPattern =
        /^((\*|\?|[A-Z]+|\d+|\d+-\d+|\d+\/\d+|\*\/\d+|\d+-\d+\/\d+|[A-Z]+-[A-Z]+(\/\d+)?)(,(\*|\?|[A-Z]+|\d+|\d+-\d+|\d+\/\d+|\*\/\d+|\d+-\d+\/\d+|[A-Z]+-[A-Z]+(\/\d+)?))*)$/;

    if (part === "?" && !["Minute", "Hour", "Month"].includes(label)) {
        return;
    }

    if (label === "Month" && part.includes("-") && /[A-Za-z]/.test(part)) {
        const [fromStr, toStr] = part.split("-");
        const from = parseCronValue(fromStr, namedValuesMap);
        const to = parseCronValue(toStr, namedValuesMap);

        if (from === null || to === null || from > to) {
            errors.push(`${label} has invalid named range: "${part}".`);
        }
        return;
    }

    if (!validPattern.test(part)) {
        errors.push(`${label} has invalid format: "${part}".`);
        return;
    }

    const values = part.split(",").map((p) => {
        if (p.includes("-")) {
            const [fromStr, toStr] = p.split("-");
            const from = parseCronValue(fromStr, namedValuesMap);
            const to = parseCronValue(toStr, namedValuesMap);
            if (from === null || to === null) {
                errors.push(`${label} has invalid range: "${p}".`);
                return [];
            }
            return Array.from({ length: to - from + 1 }, (_, i) => from + i);
        } else if (p.startsWith("*/")) {
            const step = Number(p.slice(2));
            return isNaN(step) ? [] : [min];
        } else if (p === "*") {
            return [min];
        } else if (p.includes("/")) {
            const [fromStr, toStr] = p.split("/");
            const from = parseCronValue(fromStr, namedValuesMap);
            const to = parseCronValue(toStr, namedValuesMap);
            if (from === null || to === null) {
                errors.push(`${label} has invalid range: "${p}".`);
                return [];
            }
            return Array.from({ length: to - from + 1 }, (_, i) => from + i);
        } else {
            const v = parseCronValue(p, namedValuesMap);
            if (v === null) {
                errors.push(`${label} has invalid value: "${p}".`);
                return [];
            }
            return [v];
        }
    });

    const result = values.reduce((accumulator, value) => accumulator.concat(value), []);
    result.forEach((v) => {
        if (isNaN(v) || v < min || v > max) {
            errors.push(`${label} must be between ${min} and ${max}, but got ${v}.`);
        }
    });
}

function parseCronValue(input: string, namedMap: Record<string, number>): number | null {
    const upper = input.toUpperCase();

    if (namedMap[upper]) return namedMap[upper];

    const num = Number(input);
    return isNaN(num) ? null : num;
}
