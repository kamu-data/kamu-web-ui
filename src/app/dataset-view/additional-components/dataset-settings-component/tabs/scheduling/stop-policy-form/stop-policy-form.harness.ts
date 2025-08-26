/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

/* istanbul ignore file */

import { ComponentHarness } from "@angular/cdk/testing";
import { StopPolicyType } from "../../../dataset-settings.model";
import { MatRadioButtonHarness } from "@angular/material/radio/testing";

export class StopPolicyFormHarness extends ComponentHarness {
    public static readonly hostSelector = "app-stop-policy-form";

    private readonly locatorStopPolicyTypeNeverRadio = this.locatorFor(
        MatRadioButtonHarness.with({ selector: '[data-test-id="stop-policy-never"]' }),
    );

    private readonly locatorStopPolicyTypeAfterConsecutiveFailuresRadio = this.locatorFor(
        MatRadioButtonHarness.with({ selector: '[data-test-id="stop-policy-after-consecutive-failures"]' }),
    );

    public async setSelectedStopPolicyType(stopPolicyType: StopPolicyType): Promise<void> {
        const neverRadio = await this.locatorStopPolicyTypeNeverRadio();
        const afterConsecutiveFailuresRadio = await this.locatorStopPolicyTypeAfterConsecutiveFailuresRadio();

        if (stopPolicyType === StopPolicyType.NEVER) {
            if (!(await neverRadio.isChecked())) {
                await neverRadio.check();
            }
        } else if (stopPolicyType === StopPolicyType.AFTER_CONSECUTIVE_FAILURES) {
            if (!(await afterConsecutiveFailuresRadio.isChecked())) {
                await afterConsecutiveFailuresRadio.check();
            }
        } else {
            // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
            throw new Error(`Unsupported stop policy type: ${stopPolicyType}`);
        }
    }

    public async getStopPolicyType(): Promise<StopPolicyType | null> {
        const neverRadio = await this.locatorStopPolicyTypeNeverRadio();
        const isNeverSelected = await neverRadio.isChecked();

        const afterConsecutiveFailuresRadio = await this.locatorStopPolicyTypeAfterConsecutiveFailuresRadio();
        const isAfterConsecutiveFailuresSelected = await afterConsecutiveFailuresRadio.isChecked();

        if (isNeverSelected) {
            return StopPolicyType.NEVER;
        } else if (isAfterConsecutiveFailuresSelected) {
            return StopPolicyType.AFTER_CONSECUTIVE_FAILURES;
        }
        return null;
    }
}
