/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

/* istanbul ignore file */

import { ComponentHarness } from "@angular/cdk/testing";

export class CronExpressionFormHarness extends ComponentHarness {
    public static readonly hostSelector = "app-cron-expression-form";

    private readonly input = this.locatorFor('[data-test-id="cron-expression-input"]');
    private readonly errorMessage = this.locatorForOptional('[data-test-id="error-message"]');
    private readonly nextTime = this.locatorForOptional('[data-test-id="cron-expression-next-time"]');

    public async setCronExpression(value: string): Promise<void> {
        const input = await this.input();
        await input.clear();
        await input.sendKeys(value);
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

    public async getErrorMessage(): Promise<string | null> {
        const errorMessage = await this.errorMessage();
        if (errorMessage) {
            return errorMessage.text();
        }
        return null;
    }

    public async getNextTime(): Promise<string | null> {
        const nextTime = await this.nextTime();
        if (nextTime) {
            return nextTime.text();
        }
        return null;
    }
}
