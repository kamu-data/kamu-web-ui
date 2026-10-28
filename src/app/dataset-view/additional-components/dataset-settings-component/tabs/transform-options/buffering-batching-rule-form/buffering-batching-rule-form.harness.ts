/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

/* istanbul ignore file */

import { ComponentHarness } from "@angular/cdk/testing";

import { TimeDeltaFormHarness } from "@common/components/time-delta-form/time-delta-form.harness";
import { TimeDeltaFormValue } from "@common/components/time-delta-form/time-delta-form.value";
import { NativeInputHarness } from "@common/helpers/native-input.harness";
import { FieldErrorHarness } from "@common/validation/field-error.harness";
import { MaybeNull } from "@interface/app.types";

import { BufferingBatchingRuleFormValue } from "src/app/dataset-view/additional-components/dataset-settings-component/tabs/transform-options/buffering-batching-rule-form/buffering-batching-rule-form.types";

export class BufferingBatchingRuleFormHarness extends ComponentHarness {
    public static readonly hostSelector = "app-buffering-batching-rule-form";

    private static readonly MIN_RECORDS_INPUT_TEST_ID = "batching-min-records";
    private static readonly MIN_RECORDS_ERROR_TEST_ID = "min-records-error-message";

    private readonly locatorMinRecordsInput = this.locatorFor(
        NativeInputHarness.with({ dataTestId: BufferingBatchingRuleFormHarness.MIN_RECORDS_INPUT_TEST_ID }),
    );
    private readonly locatorMinRecordsError = this.locatorFor(
        FieldErrorHarness.with({ dataTestId: BufferingBatchingRuleFormHarness.MIN_RECORDS_ERROR_TEST_ID }),
    );

    private readonly locatorTimeDeltaForm = this.locatorForOptional(TimeDeltaFormHarness);

    /** Types the value as a user would; an empty string leaves the field blank. */
    public async setMinRecordsToAwait(value: number | string): Promise<void> {
        const input = await this.locatorMinRecordsInput();
        await input.setValue(value.toString());
    }

    public async setMaxBatchingInterval(timeDelta: TimeDeltaFormValue): Promise<void> {
        const timeDeltaForm = await this.locatorTimeDeltaForm();
        if (!timeDeltaForm) {
            throw new Error("Time delta form did not appear");
        }

        await timeDeltaForm.setTimeDelta(timeDelta.every, timeDelta.unit);
    }

    public async getMinRecordsToAwait(): Promise<MaybeNull<number>> {
        const input = await this.locatorMinRecordsInput();
        const value = await input.getValue();
        return value === "" ? null : Number(value);
    }

    public async getMinRecordsError(): Promise<MaybeNull<string>> {
        const error = await this.locatorMinRecordsError();
        return error.getMessage();
    }

    public async getMaxBatchingIntervalError(): Promise<MaybeNull<string>> {
        const timeDeltaForm = await this.locatorTimeDeltaForm();
        if (!timeDeltaForm) {
            throw new Error("Time delta form did not appear");
        }
        return timeDeltaForm.getErrorMessage();
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
        };
    }
}
