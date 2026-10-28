/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

/* istanbul ignore file */

import { ComponentHarness } from "@angular/cdk/testing";
import { MatRadioButtonHarness } from "@angular/material/radio/testing";

import { unexpectedValueError } from "@common/helpers/app.helpers";
import { NativeInputHarness } from "@common/helpers/native-input.harness";
import { FieldErrorHarness } from "@common/validation/field-error.harness";
import { MaybeNull } from "@interface/app.types";

import { FlowTriggerStopPolicyType } from "src/app/dataset-view/additional-components/dataset-settings-component/dataset-settings.model";
import { FlowStopPolicyFormValue } from "src/app/dataset-view/additional-components/dataset-settings-component/tabs/shared/flow-stop-policy-form/flow-stop-policy-form.types";

export class FlowStopPolicyFormHarness extends ComponentHarness {
    public static readonly hostSelector = "app-flow-stop-policy-form";

    private static readonly NEVER_RADIO_TEST_ID = "stop-policy-never";
    private static readonly AFTER_CONSECUTIVE_FAILURES_RADIO_TEST_ID = "stop-policy-after-consecutive-failures";
    private static readonly MAX_FAILURES_ERROR_TEST_ID = "stop-policy-max-failures-error-message";
    private static readonly MAX_FAILURES_INPUT_TEST_ID = "stop-policy-max-failures-input";

    private readonly locatorStopPolicyTypeNeverRadio = this.locatorFor(
        MatRadioButtonHarness.with({ selector: `[data-test-id="${FlowStopPolicyFormHarness.NEVER_RADIO_TEST_ID}"]` }),
    );

    private readonly locatorStopPolicyTypeAfterConsecutiveFailuresRadio = this.locatorFor(
        MatRadioButtonHarness.with({
            selector: `[data-test-id="${FlowStopPolicyFormHarness.AFTER_CONSECUTIVE_FAILURES_RADIO_TEST_ID}"]`,
        }),
    );

    private readonly locatorMaxFailuresError = this.locatorForOptional(
        FieldErrorHarness.with({ dataTestId: FlowStopPolicyFormHarness.MAX_FAILURES_ERROR_TEST_ID }),
    );

    private readonly locatorMaxFailuresInput = this.locatorFor(
        NativeInputHarness.with({ dataTestId: FlowStopPolicyFormHarness.MAX_FAILURES_INPUT_TEST_ID }),
    );

    public async setSelectedStopPolicyType(stopPolicyType: FlowTriggerStopPolicyType): Promise<void> {
        const neverRadio = await this.locatorStopPolicyTypeNeverRadio();
        const afterConsecutiveFailuresRadio = await this.locatorStopPolicyTypeAfterConsecutiveFailuresRadio();

        if (stopPolicyType === FlowTriggerStopPolicyType.NEVER) {
            if (!(await neverRadio.isChecked())) {
                await neverRadio.check();
            }
        } else if (stopPolicyType === FlowTriggerStopPolicyType.AFTER_CONSECUTIVE_FAILURES) {
            if (!(await afterConsecutiveFailuresRadio.isChecked())) {
                await afterConsecutiveFailuresRadio.check();
            }
        } else {
            throw unexpectedValueError(stopPolicyType, "stop policy type");
        }
    }

    public async getStopPolicyType(): Promise<MaybeNull<FlowTriggerStopPolicyType>> {
        const neverRadio = await this.locatorStopPolicyTypeNeverRadio();
        const isNeverSelected = await neverRadio.isChecked();

        const afterConsecutiveFailuresRadio = await this.locatorStopPolicyTypeAfterConsecutiveFailuresRadio();
        const isAfterConsecutiveFailuresSelected = await afterConsecutiveFailuresRadio.isChecked();

        if (isNeverSelected) {
            return FlowTriggerStopPolicyType.NEVER;
        } else if (isAfterConsecutiveFailuresSelected) {
            return FlowTriggerStopPolicyType.AFTER_CONSECUTIVE_FAILURES;
        }
        return null;
    }

    /** Types the value as a user would; an empty string leaves the field blank. */
    public async setMaxFailures(value: number | string): Promise<void> {
        const stopPolicyType = await this.getStopPolicyType();
        if (stopPolicyType !== FlowTriggerStopPolicyType.AFTER_CONSECUTIVE_FAILURES) {
            throw new Error("Cannot set max failures when stop policy is not 'after consecutive failures'");
        }

        const input = await this.locatorMaxFailuresInput();
        await input.setValue(value.toString());
    }

    public async getMaxFailures(): Promise<number> {
        const input = await this.locatorMaxFailuresInput();
        const value = await input.getValue();
        return Number(value) || 0;
    }

    public async getMaxFailuresError(): Promise<MaybeNull<string>> {
        const error = await this.locatorMaxFailuresError();
        return error ? error.getMessage() : null;
    }

    public async currentFormValue(): Promise<FlowStopPolicyFormValue> {
        const stopPolicyType = await this.getStopPolicyType();
        const maxFailures = await this.getMaxFailures();

        return {
            stopPolicyType,
            maxFailures,
        };
    }
}
