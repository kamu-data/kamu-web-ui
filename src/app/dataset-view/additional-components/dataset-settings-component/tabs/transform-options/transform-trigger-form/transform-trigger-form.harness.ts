/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

/* istanbul ignore file */

import { ComponentHarness } from "@angular/cdk/testing";
import { MatSlideToggleHarness } from "@angular/material/slide-toggle/testing";

export class TransformTriggerFormHarness extends ComponentHarness {
    public static readonly hostSelector = "app-transform-trigger-form";

    private readonly locatorUpdatesToggle = this.locatorFor(
        MatSlideToggleHarness.with({ selector: '[data-test-id="transform-trigger-updates-enabled"]' }),
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

    public async isUpdatingEnabled(): Promise<boolean> {
        const toggle = await this.locatorUpdatesToggle();
        return toggle.isChecked();
    }

    /*
    public async currentFormValue(): Promise<TransformTriggerFormValue> {
        const updatesEnabled = await this.isUpdatingEnabled();
        const scheduleType = await this.getScheduleType();

        let timeDelta: TimeDeltaFormValue = { every: null, unit: null };
        let cron: { cronExpression: string } = { cronExpression: "" };

        if (scheduleType === ScheduleType.TIME_DELTA) {
            const timeDeltaForm = await this.locatorTimeDeltaForm();
            if (timeDeltaForm) {
                timeDelta = await timeDeltaForm.getTimeDelta();
            }
        } else if (scheduleType === ScheduleType.CRON_5_COMPONENT_EXPRESSION) {
            const cronForm = await this.locatorCronForm();
            if (cronForm) {
                cron = { cronExpression: await cronForm.getCronExpression() };
            }
        }

        return {
            updatesEnabled,
            __typename: scheduleType,
            timeDelta,
            cron,
        };
    } */
}
