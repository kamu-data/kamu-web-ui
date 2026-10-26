/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

/* istanbul ignore file */

import { ComponentHarness } from "@angular/cdk/testing";
import { MatRadioButtonHarness } from "@angular/material/radio/testing";

import { TimeDeltaFormValue } from "@common/components/time-delta-form/time-delta-form.value";
import { FlowTriggerBreakingChangeRule } from "@api/kamu.graphql.interface";
import { MaybeNull } from "@interface/app.types";

import { BatchingRuleType } from "src/app/dataset-view/additional-components/dataset-settings-component/dataset-settings.model";
import { BufferingBatchingRuleFormHarness } from "src/app/dataset-view/additional-components/dataset-settings-component/tabs/transform-options/buffering-batching-rule-form/buffering-batching-rule-form.harness";
import { BufferingBatchingRuleFormValue } from "src/app/dataset-view/additional-components/dataset-settings-component/tabs/transform-options/buffering-batching-rule-form/buffering-batching-rule-form.types";
import { TransformTriggerFormValue } from "src/app/dataset-view/additional-components/dataset-settings-component/tabs/transform-options/transform-trigger-form/transform-trigger-form.types";

export class TransformTriggerFormHarness extends ComponentHarness {
    public static readonly hostSelector = "app-transform-trigger-form";

    private static readonly BATCHING_RULE_IMMEDIATE_TEST_ID = "batching-rule-immediate";
    private static readonly BATCHING_RULE_BUFFERING_TEST_ID = "batching-rule-buffering";
    private static readonly BREAKING_CHANGE_NO_ACTION_TEST_ID = "breaking-change-no-action";
    private static readonly BREAKING_CHANGE_RECOVER_TEST_ID = "breaking-change-recover";

    private readonly locatorBatchingRuleImmediateRadio = this.locatorFor(
        MatRadioButtonHarness.with({
            selector: `[data-test-id="${TransformTriggerFormHarness.BATCHING_RULE_IMMEDIATE_TEST_ID}"]`,
        }),
    );

    private readonly locatorBatchingRuleBufferingRadio = this.locatorFor(
        MatRadioButtonHarness.with({
            selector: `[data-test-id="${TransformTriggerFormHarness.BATCHING_RULE_BUFFERING_TEST_ID}"]`,
        }),
    );

    private readonly locatorBufferingForm = this.locatorForOptional(BufferingBatchingRuleFormHarness);

    private readonly locatorBreakingChangeNoActionRadio = this.locatorFor(
        MatRadioButtonHarness.with({
            selector: `[data-test-id="${TransformTriggerFormHarness.BREAKING_CHANGE_NO_ACTION_TEST_ID}"]`,
        }),
    );

    private readonly locatorBreakingChangeRecoverRadio = this.locatorFor(
        MatRadioButtonHarness.with({
            selector: `[data-test-id="${TransformTriggerFormHarness.BREAKING_CHANGE_RECOVER_TEST_ID}"]`,
        }),
    );

    public async setSelectedBatchingRuleType(batchingRuleType: BatchingRuleType): Promise<void> {
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
            throw new Error(`Unsupported batching rule type: ${String(batchingRuleType)}`);
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
            throw new Error(`Unsupported breaking change rule: ${String(rule)}`);
        }
    }

    public async enterBufferingBatchingRule(
        minInputRecords: number,
        maxBatchingInterval: TimeDeltaFormValue,
    ): Promise<void> {
        const bufferingForm = await this.locatorBufferingForm();
        if (!bufferingForm) {
            throw new Error("Buffering form did not appear after selecting radio button");
        }

        await bufferingForm.setMinRecordsToAwait(minInputRecords);
        await bufferingForm.setMaxBatchingInterval(maxBatchingInterval);
    }

    public async getBatchingRuleType(): Promise<MaybeNull<BatchingRuleType>> {
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

    public async getBreakingChangeRule(): Promise<MaybeNull<FlowTriggerBreakingChangeRule>> {
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

    public async getBufferingFormValue(): Promise<MaybeNull<BufferingBatchingRuleFormValue>> {
        const bufferingForm = await this.locatorBufferingForm();
        if (!bufferingForm) {
            return null;
        }
        return await bufferingForm.currentFormValue();
    }

    public async currentFormValue(): Promise<TransformTriggerFormValue> {
        const batchingRuleType = await this.getBatchingRuleType();
        const breakingChangeRule = await this.getBreakingChangeRule();

        return {
            forNewData: {
                batchingRuleType,
                buffering:
                    batchingRuleType === BatchingRuleType.BUFFERING
                        ? await this.requireBufferingFormValue()
                        : undefined,
            },
            forBreakingChange: breakingChangeRule,
        };
    }

    private async requireBufferingFormValue(): Promise<BufferingBatchingRuleFormValue> {
        const bufferingFormValue = await this.getBufferingFormValue();
        if (!bufferingFormValue) {
            throw new Error("Buffering form is not shown while the buffering batching rule is selected");
        }
        return bufferingFormValue;
    }
}
