/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

/* istanbul ignore file */

import { ComponentHarness } from "@angular/cdk/testing";
import { MatSlideToggleHarness } from "@angular/material/slide-toggle/testing";
import { BufferingBatchingRuleFormHarness } from "../buffering-batching-rule-form/buffering-batching-rule-form.harness";
import { MatRadioButtonHarness } from "@angular/material/radio/testing";
import { BatchingRuleType } from "../../../dataset-settings.model";
import { FlowTriggerBreakingChangeRule } from "src/app/api/kamu.graphql.interface";
import { TransformTriggerFormValue } from "./transform-trigger-form.types";
import { TimeDeltaFormValue } from "src/app/common/components/time-delta-form/time-delta-form.value";
import { BufferingBatchingRuleFormValue } from "../buffering-batching-rule-form/buffering-batching-rule-form.types";

export class TransformTriggerFormHarness extends ComponentHarness {
    public static readonly hostSelector = "app-transform-trigger-form";

    private readonly locatorUpdatesToggle = this.locatorFor(
        MatSlideToggleHarness.with({ selector: '[data-test-id="transform-trigger-updates-enabled"]' }),
    );

    private readonly locatorBatchingRuleImmediateRadio = this.locatorFor(
        MatRadioButtonHarness.with({ selector: '[data-test-id="batching-rule-immediate"]' }),
    );

    private readonly locatorBatchingRuleBufferingRadio = this.locatorFor(
        MatRadioButtonHarness.with({ selector: '[data-test-id="batching-rule-buffering"]' }),
    );

    private readonly locatorBufferingForm = this.locatorForOptional(BufferingBatchingRuleFormHarness);

    private readonly locatorBreakingChangeNoActionRadio = this.locatorFor(
        MatRadioButtonHarness.with({ selector: '[data-test-id="breaking-change-no-action"]' }),
    );

    private readonly locatorBreakingChangeRecoverRadio = this.locatorFor(
        MatRadioButtonHarness.with({ selector: '[data-test-id="breaking-change-recover"]' }),
    );

    public async enableUpdates(): Promise<void> {
        const toggle = await this.locatorUpdatesToggle();
        if (!(await toggle.isChecked())) {
            await toggle.toggle();
        }
    }

    public async disableUpdates(): Promise<void> {
        const toggle = await this.locatorUpdatesToggle();
        if (await toggle.isChecked()) {
            await toggle.toggle();
        }
    }

    public async setSelectedBatchingRuleType(batchingRuleType: BatchingRuleType): Promise<void> {
        if (!(await this.isUpdatingEnabled())) {
            throw new Error("Cannot set batching rule type when updates are disabled");
        }

        const immediateRadio = await this.locatorBatchingRuleImmediateRadio();
        const bufferingRadio = await this.locatorBatchingRuleBufferingRadio();

        if (batchingRuleType === BatchingRuleType.IMMEDIATE) {
            if (!(await immediateRadio.isChecked())) {
                await immediateRadio.check();
            }
        } else if (batchingRuleType === BatchingRuleType.BUFFERING) {
            if (!(await bufferingRadio.isChecked())) {
                await bufferingRadio.check();
            }
        } else {
            // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
            throw new Error(`Unsupported batching rule type: ${batchingRuleType}`);
        }
    }

    public async setSelectedBreakingChangeRule(rule: FlowTriggerBreakingChangeRule): Promise<void> {
        const noActionRadio = await this.locatorBreakingChangeNoActionRadio();
        const recoverRadio = await this.locatorBreakingChangeRecoverRadio();

        if (rule === FlowTriggerBreakingChangeRule.Recover) {
            if (!(await recoverRadio.isChecked())) {
                await recoverRadio.check();
            }
        } else if (rule === FlowTriggerBreakingChangeRule.NoAction) {
            if (!(await noActionRadio.isChecked())) {
                await noActionRadio.check();
            }
        } else {
            // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
            throw new Error(`Unsupported breaking change rule: ${rule}`);
        }
    }

    public async enterBufferingBatchingRule(
        minInputRecords: number,
        maxBatchingInterval: TimeDeltaFormValue,
    ): Promise<void> {
        if (!(await this.isUpdatingEnabled())) {
            throw new Error("Cannot set schedule details when updates are disabled");
        }

        const bufferingForm = await this.locatorBufferingForm();
        if (!bufferingForm) {
            throw new Error("Buffering form did not appear after selecting radio button");
        }

        await bufferingForm.setMinRecordsToAwait(minInputRecords);
        await bufferingForm.setMaxBatchingInterval(maxBatchingInterval);
    }

    public async isUpdatingEnabled(): Promise<boolean> {
        const toggle = await this.locatorUpdatesToggle();
        return toggle.isChecked();
    }

    public async getBatchingRuleType(): Promise<BatchingRuleType | null> {
        const immediateRadio = await this.locatorBatchingRuleImmediateRadio();
        const isImmediateSelected = await immediateRadio.isChecked();

        const bufferingRadio = await this.locatorBatchingRuleBufferingRadio();
        const isBufferingSelected = await bufferingRadio.isChecked();

        if (isImmediateSelected) {
            return BatchingRuleType.IMMEDIATE;
        } else if (isBufferingSelected) {
            return BatchingRuleType.BUFFERING;
        }
        return null;
    }

    public async getBreakingChangeRule(): Promise<FlowTriggerBreakingChangeRule | null> {
        const noActionRadio = await this.locatorBreakingChangeNoActionRadio();
        const isNoActionSelected = await noActionRadio.isChecked();

        const recoverRadio = await this.locatorBreakingChangeRecoverRadio();
        const isRecoverSelected = await recoverRadio.isChecked();

        if (isNoActionSelected) {
            return FlowTriggerBreakingChangeRule.NoAction;
        } else if (isRecoverSelected) {
            return FlowTriggerBreakingChangeRule.Recover;
        }
        return null;
    }

    public async getBufferingFormValue(): Promise<BufferingBatchingRuleFormValue | null> {
        const bufferingForm = await this.locatorBufferingForm();
        if (!bufferingForm) {
            return null;
        }
        return await bufferingForm.currentFormValue();
    }

    public async currentFormValue(): Promise<TransformTriggerFormValue> {
        const updatesEnabled = await this.isUpdatingEnabled();
        const batchingRuleType = await this.getBatchingRuleType();
        const breakingChangeRule = await this.getBreakingChangeRule();

        return {
            updatesEnabled,
            forNewData: {
                batchingRuleType: batchingRuleType ?? BatchingRuleType.IMMEDIATE,
                buffering:
                    batchingRuleType === BatchingRuleType.BUFFERING ? await this.getBufferingFormValue() : undefined,
            },
            forBreakingChange: breakingChangeRule ?? null,
        } as TransformTriggerFormValue;
    }
}
