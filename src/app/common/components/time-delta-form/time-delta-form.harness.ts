/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

/* istanbul ignore file */

import { ComponentHarness } from "@angular/cdk/testing";

import { FieldErrorHarness } from "@common/validation/field-error.harness";
import { TimeUnit } from "@api/kamu.graphql.interface";
import { MaybeNull } from "@interface/app.types";

export class TimeDeltaFormHarness extends ComponentHarness {
    public static readonly hostSelector = "app-time-delta-form";

    private static readonly EVERY_INPUT_TEST_ID = "time-delta-every";
    private static readonly UNIT_SELECT_TEST_ID = "time-delta-unit";
    private static readonly ERROR_TEST_ID = "time-delta-error-message";
    private static readonly UNIT_ERROR_TEST_ID = "time-delta-unit-error-message";

    private readonly locatorEveryInput = this.locatorFor(
        `[data-test-id="${TimeDeltaFormHarness.EVERY_INPUT_TEST_ID}"]`,
    );
    private readonly locatorUnitSelect = this.locatorFor(
        `[data-test-id="${TimeDeltaFormHarness.UNIT_SELECT_TEST_ID}"]`,
    );

    private readonly locatorError = this.locatorForOptional(`[data-test-id="${TimeDeltaFormHarness.ERROR_TEST_ID}"]`);
    private readonly locatorUnitError = this.locatorFor(
        FieldErrorHarness.with({ dataTestId: TimeDeltaFormHarness.UNIT_ERROR_TEST_ID }),
    );

    private static readonly DEFAULT_UNIT_ORDER: TimeUnit[] = [
        TimeUnit.Minutes,
        TimeUnit.Hours,
        TimeUnit.Days,
        TimeUnit.Weeks,
    ];

    private readonly locatorOptionElements = this.locatorForAll(
        `[data-test-id="${TimeDeltaFormHarness.UNIT_SELECT_TEST_ID}"] option`,
    );

    public async getAvailableUnits(): Promise<TimeUnit[]> {
        const optionElements = await this.locatorOptionElements();

        const units: TimeUnit[] = [];
        for (const option of optionElements) {
            const value: unknown = await option.getProperty("value");
            units.push(TimeDeltaFormHarness.toTimeUnit(value));
        }
        return units;
    }

    public async setTimeDelta(every: MaybeNull<number | "">, unit: MaybeNull<TimeUnit>): Promise<void> {
        const input = await this.locatorEveryInput();
        const select = await this.locatorUnitSelect();

        await input.clear();
        if (every === "") {
            // Blank input, do not set any value, but ensure the input is touched
            await input.blur();
        } else if (every) {
            await input.sendKeys(every.toString());
            await input.blur();
        }

        if (unit === null) {
            await select.clear();
        } else {
            await this.setUnit(unit);
        }
    }

    /** Types the value as a user would, leaving the unit as it is; an empty string leaves the field blank. */
    public async setEvery(value: string): Promise<void> {
        const input = await this.locatorEveryInput();
        await input.clear();
        if (value !== "") {
            await input.sendKeys(value);
        }
        await input.blur();
    }

    /** Picks a unit, leaving the value as it is. */
    public async setUnit(unit: TimeUnit): Promise<void> {
        const select = await this.locatorUnitSelect();
        const availableUnits = await this.getAvailableUnits();
        const index = availableUnits.indexOf(unit);
        if (index === -1) {
            throw new Error(`Unit ${unit} is not available in the current configuration`);
        }
        await select.selectOptions(index);
        await select.blur();
    }

    /** Focuses the unit select and leaves it without choosing. */
    public async touchUnit(): Promise<void> {
        const select = await this.locatorUnitSelect();
        await select.focus();
        await select.blur();
    }

    public async getUnitErrorMessage(): Promise<MaybeNull<string>> {
        const error = await this.locatorUnitError();
        return error.getMessage();
    }

    public async getTimeDelta(): Promise<{ every: number; unit: MaybeNull<TimeUnit> }> {
        const input = await this.locatorEveryInput();
        const select = await this.locatorUnitSelect();

        const every: unknown = await input.getProperty("value");
        const unit: unknown = await select.getProperty("value");
        return {
            every: Number(every),
            // A select with no option chosen has the value ""
            unit: unit === "" ? null : TimeDeltaFormHarness.toTimeUnit(unit),
        };
    }

    public async isEveryInputInvalid(): Promise<boolean> {
        const input = await this.locatorEveryInput();
        return input.hasClass("ng-invalid");
    }

    public async isEveryInputUntouched(): Promise<boolean> {
        const input = await this.locatorEveryInput();
        return input.hasClass("ng-untouched");
    }

    public async getErrorMessage(): Promise<MaybeNull<string>> {
        const errorElement = await this.locatorError();
        if (errorElement) {
            const message = await errorElement.text();
            return message === "" ? null : message;
        }

        return null;
    }

    private static toTimeUnit(value: unknown): TimeUnit {
        const unit = Object.values(TimeUnit).find((timeUnit) => timeUnit === value);
        if (unit === undefined) {
            throw new Error(`Unexpected time unit: ${String(value)}`);
        }
        return unit;
    }
}
