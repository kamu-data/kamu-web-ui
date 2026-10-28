/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

/* istanbul ignore file */

import { ComponentHarness } from "@angular/cdk/testing";

import { MaybeNull } from "@interface/app.types";

export class CronExpressionFormHarness extends ComponentHarness {
    public static readonly hostSelector = "app-cron-expression-form";

    private static readonly INPUT_TEST_ID = "cron-expression-input";
    private static readonly ERROR_TEST_ID = "cron-error-message";
    private static readonly NEXT_TIME_TEST_ID = "cron-expression-next-time";

    private readonly input = this.locatorFor(`[data-test-id="${CronExpressionFormHarness.INPUT_TEST_ID}"]`);
    private readonly errorMessage = this.locatorForOptional(
        `[data-test-id="${CronExpressionFormHarness.ERROR_TEST_ID}"]`,
    );
    private readonly nextTime = this.locatorForOptional(
        `[data-test-id="${CronExpressionFormHarness.NEXT_TIME_TEST_ID}"]`,
    );

    public async setCronExpression(value: string): Promise<void> {
        const input = await this.input();
        await input.clear();
        if (value !== "") {
            await input.sendKeys(value);
        }
        await input.blur();
    }

    public async getCronExpression(): Promise<string> {
        const input = await this.input();
        return input.getProperty("value");
    }

    public async isInvalid(): Promise<boolean> {
        const input = await this.input();
        return input.hasClass("ng-invalid");
    }

    public async isUntouched(): Promise<boolean> {
        const input = await this.input();
        return input.hasClass("ng-untouched");
    }

    public async getErrorMessage(): Promise<MaybeNull<string>> {
        const errorElement = await this.errorMessage();
        if (errorElement) {
            const message = await errorElement.text();
            return message === "" ? null : message;
        }
        return null;
    }

    public async getNextTime(): Promise<MaybeNull<string>> {
        const nextTime = await this.nextTime();
        if (nextTime) {
            return nextTime.text();
        }
        return null;
    }
}
