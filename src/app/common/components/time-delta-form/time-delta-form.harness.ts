/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

/* istanbul ignore file */

import { ComponentHarness } from "@angular/cdk/testing";
import { TimeUnit } from "src/app/api/kamu.graphql.interface";

export class TimeDeltaFormHarness extends ComponentHarness {
    public static readonly hostSelector = "app-time-delta-form";

    private readonly locatorEveryInput = this.locatorFor('[data-test-id="time-delta-every"]');
    private readonly locatorUnitSelect = this.locatorFor('[data-test-id="time-delta-unit"]');

    private static readonly UNIT_INDEX: Record<TimeUnit, number> = {
        MINUTES: 0,
        HOURS: 1,
        DAYS: 2,
        WEEKS: 3,
    };

    public async setTimeDelta(every: number | null, unit: TimeUnit | null): Promise<void> {
        const input = await this.locatorEveryInput();
        const select = await this.locatorUnitSelect();

        await input.clear();
        if (every === null) {
            await input.sendKeys("");
        } else {
            await input.sendKeys(every.toString());
        }

        if (unit === null) {
            await select.clear();
        } else {
            const index = TimeDeltaFormHarness.UNIT_INDEX[unit];
            if (index === undefined) {
                throw new Error(`Unknown unit: ${unit}`);
            }
            await select.selectOptions(index);
        }
    }

    public async getTimeDelta(): Promise<{ every: number; unit: string }> {
        const input = await this.locatorEveryInput();
        const select = await this.locatorUnitSelect();

        return {
            every: Number(await input.getProperty("value")),
            unit: await select.getProperty("value"),
        };
    }
}
