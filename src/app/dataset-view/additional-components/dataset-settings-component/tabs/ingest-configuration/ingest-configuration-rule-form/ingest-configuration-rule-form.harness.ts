/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

/* istanbul ignore file */

import { ComponentHarness } from "@angular/cdk/testing";
import { MatCheckboxHarness } from "@angular/material/checkbox/testing";

import { IngestConfigurationRuleFormValue } from "./ingest-configuration-rule-form.types";

export class IngestConfigurationRuleFormHarness extends ComponentHarness {
    public static readonly hostSelector = "app-ingest-configuration-rule-form";

    private readonly locatorFetchUncacheableCheckbox = this.locatorFor(
        MatCheckboxHarness.with({ selector: '[data-test-id="ingest-config-fetch-uncacheable"]' }),
    );

    private readonly locatorFetchNextIterationCheckbox = this.locatorFor(
        MatCheckboxHarness.with({ selector: '[data-test-id="ingest-config-fetch-next-iteration"]' }),
    );

    public async enableFetchUncacheable(): Promise<void> {
        await this.setFetchUncacheable(true);
    }

    public async enableFetchNextIteration(): Promise<void> {
        await this.setFetchNextIteration(true);
    }

    public async disableFetchUncacheable(): Promise<void> {
        await this.setFetchUncacheable(false);
    }

    public async disableFetchNextIteration(): Promise<void> {
        await this.setFetchNextIteration(false);
    }

    private async setFetchUncacheable(value: boolean): Promise<void> {
        const checkbox = await this.locatorFetchUncacheableCheckbox();
        const currentValue = await checkbox.isChecked();

        if (currentValue !== value) {
            await checkbox.toggle();
        }
    }

    private async setFetchNextIteration(value: boolean): Promise<void> {
        const checkbox = await this.locatorFetchNextIterationCheckbox();
        const currentValue = await checkbox.isChecked();

        if (currentValue !== value) {
            await checkbox.toggle();
        }
    }

    public async isFetchUncacheableEnabled(): Promise<boolean> {
        const checkbox = await this.locatorFetchUncacheableCheckbox();
        return checkbox.isChecked();
    }

    public async isFetchNextIterationEnabled(): Promise<boolean> {
        const checkbox = await this.locatorFetchNextIterationCheckbox();
        return checkbox.isChecked();
    }

    public async currentFormValue(): Promise<IngestConfigurationRuleFormValue> {
        const fetchUncacheable = await this.isFetchUncacheableEnabled();
        const fetchNextIteration = await this.isFetchNextIterationEnabled();

        return {
            fetchUncacheable,
            fetchNextIteration,
        };
    }
}
