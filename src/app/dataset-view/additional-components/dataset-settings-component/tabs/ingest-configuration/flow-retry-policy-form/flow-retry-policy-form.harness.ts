/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

/* istanbul ignore file */

import { ComponentHarness } from "@angular/cdk/testing";
import { MatSlideToggleHarness } from "@angular/material/slide-toggle/testing";

import { TimeDeltaFormHarness } from "@common/components/time-delta-form/time-delta-form.harness";
import { TimeDeltaFormValue } from "@common/components/time-delta-form/time-delta-form.value";
import { FlowRetryBackoffType, TimeUnit } from "src/app/api/kamu.graphql.interface";

import { FlowRetryPolicyFormValue } from "./flow-retry-policy-form.types";

export class FlowRetryPolicyFormHarness extends ComponentHarness {
    public static readonly hostSelector = "app-flow-retry-policy-form";

    private readonly locatorRetriesEnabledToggle = this.locatorFor(
        MatSlideToggleHarness.with({ selector: '[data-test-id="retry-policy-enabled-toggle"]' }),
    );

    private readonly locatorMaxAttemptsInput = this.locatorFor('[data-test-id="retry-policy-max-attempts-input"]');

    private readonly locatorMinDelayForm = this.locatorForOptional(TimeDeltaFormHarness);

    private readonly locatorBackoffSelect = this.locatorFor('[data-test-id="retry-policy-backoff-select"]');

    private static readonly BACKOFF_TYPE_INDEX: Record<FlowRetryBackoffType, number> = {
        [FlowRetryBackoffType.Fixed]: 0,
        [FlowRetryBackoffType.Linear]: 1,
        [FlowRetryBackoffType.Exponential]: 2,
        [FlowRetryBackoffType.ExponentialWithJitter]: 3,
    };

    public async enableRetries(): Promise<void> {
        const toggle = await this.locatorRetriesEnabledToggle();
        if (!(await toggle.isChecked())) {
            await toggle.toggle();
        }
    }

    public async disableRetries(): Promise<void> {
        const toggle = await this.locatorRetriesEnabledToggle();
        if (await toggle.isChecked()) {
            await toggle.toggle();
        }
    }

    public async isRetriesEnabled(): Promise<boolean> {
        const toggle = await this.locatorRetriesEnabledToggle();
        return toggle.isChecked();
    }

    public async setMaxAttempts(value: number): Promise<void> {
        if (!(await this.isRetriesEnabled())) {
            throw new Error("Cannot set max attempts when retries are disabled");
        }

        const input = await this.locatorMaxAttemptsInput();
        await input.clear();
        await input.sendKeys(value.toString());
        await input.blur();
    }

    public async getMaxAttempts(): Promise<number> {
        const input = await this.locatorMaxAttemptsInput();
        const value = await input.getProperty<string>("value");
        return Number(value) || 0;
    }

    public async setMinDelay(timeDelta: TimeDeltaFormValue): Promise<void> {
        if (!(await this.isRetriesEnabled())) {
            throw new Error("Cannot set min delay when retries are disabled");
        }

        const minDelayForm = await this.locatorMinDelayForm();
        if (!minDelayForm) {
            throw new Error("Min delay form not found");
        }

        await minDelayForm.setTimeDelta(timeDelta.every, timeDelta.unit);
    }

    public async getMinDelay(): Promise<{ every: number; unit: TimeUnit }> {
        const minDelayForm = await this.locatorMinDelayForm();
        if (!minDelayForm) {
            throw new Error("Min delay form not found");
        }

        return minDelayForm.getTimeDelta();
    }

    public async getMinDelayValidationError(): Promise<string | null> {
        const minDelayForm = await this.locatorMinDelayForm();
        if (!minDelayForm) {
            return null;
        }

        return minDelayForm.getErrorMessage();
    }

    public async setBackoffType(backoffType: FlowRetryBackoffType): Promise<void> {
        if (!(await this.isRetriesEnabled())) {
            throw new Error("Cannot set backoff type when retries are disabled");
        }

        const select = await this.locatorBackoffSelect();
        const index = FlowRetryPolicyFormHarness.BACKOFF_TYPE_INDEX[backoffType];
        if (index === undefined) {
            throw new Error(`Unknown backoff type: ${backoffType}`);
        }
        await select.selectOptions(index);
        await select.blur();
    }

    public async getBackoffType(): Promise<FlowRetryBackoffType> {
        const select = await this.locatorBackoffSelect();
        const value = await select.getProperty<string>("value");
        return value as FlowRetryBackoffType;
    }

    public async currentFormValue(): Promise<FlowRetryPolicyFormValue> {
        const retriesEnabled = await this.isRetriesEnabled();

        if (!retriesEnabled) {
            // Return default values when retries are disabled
            return {
                retriesEnabled: false,
                maxAttempts: 3, // Default value
                minDelay: { every: 15, unit: TimeUnit.Minutes },
                backoffType: FlowRetryBackoffType.Fixed,
            };
        }

        const maxAttempts = await this.getMaxAttempts();
        const minDelay = await this.getMinDelay();
        const backoffType = await this.getBackoffType();

        return {
            retriesEnabled,
            maxAttempts,
            minDelay,
            backoffType,
        };
    }
}
