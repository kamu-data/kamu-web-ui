/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

/* istanbul ignore file */

import { BaseHarnessFilters, ComponentHarness, HarnessPredicate } from "@angular/cdk/testing";

import { MaybeUndefined } from "@interface/app.types";

export interface NativeInputHarnessFilters extends BaseHarnessFilters {
    dataTestId?: string;
}

/** Narrows a predicate to the element whose `data-test-id` is `dataTestId`, when one is given. */
export function withDataTestId<T extends ComponentHarness>(
    predicate: HarnessPredicate<T>,
    dataTestId: MaybeUndefined<string>,
): HarnessPredicate<T> {
    return predicate.addOption("dataTestId", dataTestId, async (harness, id) => {
        const host = await harness.host();
        const value = await host.getAttribute("data-test-id");
        return value === id;
    });
}

/**
 * A plain `input`, `textarea` or `select` element, the kind the app's Bootstrap forms use.
 * Material's `MatInputHarness` matches only elements carrying `matInput`.
 */
export class NativeInputHarness extends ComponentHarness {
    public static readonly hostSelector = "input, textarea, select";

    public static with(options: NativeInputHarnessFilters = {}): HarnessPredicate<NativeInputHarness> {
        return withDataTestId(new HarnessPredicate(NativeInputHarness, options), options.dataTestId);
    }

    /** Types the value as a user would, replacing the current one, then leaves the field. */
    public async setValue(value: string): Promise<void> {
        const host = await this.host();
        await host.clear();
        if (value !== "") {
            await host.sendKeys(value);
        }
        await host.blur();
    }

    /** Picks the option of a `select` that has this value, then leaves the field. */
    public async selectValue(value: string): Promise<void> {
        const host = await this.host();
        await host.setInputValue(value);
        await host.dispatchEvent("change");
        await host.blur();
    }

    public async getValue(): Promise<string> {
        const host = await this.host();
        const value: unknown = await host.getProperty("value");
        return typeof value === "string" ? value : "";
    }

    /** Focuses the field and leaves it without typing. */
    public async touch(): Promise<void> {
        const host = await this.host();
        await host.focus();
        await host.blur();
    }

    public async isDisabled(): Promise<boolean> {
        const host = await this.host();
        const disabled: unknown = await host.getProperty("disabled");
        return disabled === true;
    }

    public async getType(): Promise<string> {
        const host = await this.host();
        const type = await host.getAttribute("type");
        return type ?? "";
    }
}
