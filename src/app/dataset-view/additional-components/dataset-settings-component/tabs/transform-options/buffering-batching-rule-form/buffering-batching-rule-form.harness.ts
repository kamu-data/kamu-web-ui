/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

/* istanbul ignore file */

import { ComponentHarness } from "@angular/cdk/testing";

import { TimeDeltaFormHarness } from "src/app/common/components/time-delta-form/time-delta-form.harness";
import { TimeDeltaFormValue } from "src/app/common/components/time-delta-form/time-delta-form.value";

import { BufferingBatchingRuleFormValue } from "./buffering-batching-rule-form.types";

export class BufferingBatchingRuleFormHarness extends ComponentHarness {
    public static readonly hostSelector = "app-buffering-batching-rule-form";

    private readonly locatorMinRecordsInput = this.locatorFor('[data-test-id="batching-min-records"]');
    private readonly locatorMinRecordsErrorMessage = this.locatorForOptional(
        '[data-test-id="min-records-error-message"]',
    );

    private readonly locatorTimeDeltaForm = this.locatorForOptional(TimeDeltaFormHarness);

    public async setMinRecordsToAwait(value: number | "" | null): Promise<void> {
        const input = await this.locatorMinRecordsInput();
        await input.clear();
        if (value === "") {
            // Blank input, do not set any value, but ensure the input is touched
            await input.blur();
        } else if (value !== null) {
            await input.sendKeys(value.toString());
            await input.blur();
        }
    }

    public async setMaxBatchingInterval(timeDelta: TimeDeltaFormValue): Promise<void> {
        const timeDeltaForm = await this.locatorTimeDeltaForm();
        if (!timeDeltaForm) {
            throw new Error("Time delta form did not appear");
        }

        await timeDeltaForm.setTimeDelta(timeDelta.every, timeDelta.unit);
    }

    public async getMinRecordsToAwait(): Promise<number | null> {
        const input = await this.locatorMinRecordsInput();
        const value = await input.getProperty<string>("value");
        if (value == null || value === "") {
            return null;
        }
        return Number(value);
    }

    public async isMinRecordsInvalid(): Promise<boolean> {
        const input = await this.locatorMinRecordsInput();
        return input.hasClass("ng-invalid");
    }

    public async isMinRecordsUntouched(): Promise<boolean> {
        const input = await this.locatorMinRecordsInput();
        return input.hasClass("ng-untouched");
    }

    public async getMinRecordsErrorMessage(): Promise<string | null> {
        const errorElement = await this.locatorMinRecordsErrorMessage();
        if (errorElement) {
            const message = await errorElement.text();
            return message === "" ? null : message;
        }
        return null;
    }

    public async getMaxBatchingInterval(): Promise<TimeDeltaFormValue> {
        const timeDeltaForm = await this.locatorTimeDeltaForm();
        if (!timeDeltaForm) {
            throw new Error("Time delta form did not appear");
        }
        return await timeDeltaForm.getTimeDelta();
    }

    public async currentFormValue(): Promise<BufferingBatchingRuleFormValue> {
        const minRecordsToAwait = await this.getMinRecordsToAwait();
        const maxBatchingInterval = await this.getMaxBatchingInterval();

        return {
            minRecordsToAwait,
            maxBatchingInterval,
        } as BufferingBatchingRuleFormValue;
    }
}
