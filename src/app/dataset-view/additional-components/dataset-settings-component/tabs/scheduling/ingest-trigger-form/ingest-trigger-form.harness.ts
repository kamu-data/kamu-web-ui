/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

/* istanbul ignore file */

import { ComponentHarness } from "@angular/cdk/testing";
import { MatSlideToggleHarness } from "@angular/material/slide-toggle/testing";
import { ScheduleType } from "../../../dataset-settings.model";
import { TimeDeltaFormValue } from "src/app/common/components/time-delta-form/time-delta-form.value";
import { CronExpressionFormHarness } from "src/app/common/components/cron-expression-form/cron-expression-form.harness";
import { TimeDeltaFormHarness } from "src/app/common/components/time-delta-form/time-delta-form.harness";
import { MatRadioButtonHarness } from "@angular/material/radio/testing";
import { IngestTriggerFormValue } from "./ingest-trigger-form.types";

export class IngestTriggerFormHarness extends ComponentHarness {
    public static readonly hostSelector = "app-ingest-trigger-form";

    private readonly locatorUpdatesToggle = this.locatorFor(
        MatSlideToggleHarness.with({ selector: '[data-test-id="ingest-trigger-updates-enabled"]' }),
    );

    private readonly locatorScheduleTypeTimeDeltaRadio = this.locatorFor(
        MatRadioButtonHarness.with({ selector: '[data-test-id="trigger-time-delta"]' }),
    );

    private readonly locatorScheduleTypeCronRadio = this.locatorFor(
        MatRadioButtonHarness.with({ selector: '[data-test-id="trigger-cron"]' }),
    );

    private readonly locatorTimeDeltaForm = this.locatorForOptional(TimeDeltaFormHarness);
    private readonly locatorCronForm = this.locatorForOptional(CronExpressionFormHarness);

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

    public async setSelectedScheduleType(scheduleType: ScheduleType): Promise<void> {
        if (!(await this.isUpdatingEnabled())) {
            throw new Error("Cannot set schedule type when updates are disabled");
        }

        const timeDeltaRadio = await this.locatorScheduleTypeTimeDeltaRadio();
        const cronRadio = await this.locatorScheduleTypeCronRadio();

        if (scheduleType === ScheduleType.TIME_DELTA) {
            if (!(await timeDeltaRadio.isChecked())) {
                await timeDeltaRadio.check();
            }
        } else if (scheduleType === ScheduleType.CRON_5_COMPONENT_EXPRESSION) {
            if (!(await cronRadio.isChecked())) {
                await cronRadio.check();
            }
        } else {
            // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
            throw new Error(`Unsupported schedule type: ${scheduleType}`);
        }
    }

    public async setCronExpression(cronExpression: string): Promise<void> {
        if (!(await this.isUpdatingEnabled())) {
            throw new Error("Cannot set schedule details when updates are disabled");
        }

        const cronForm = await this.locatorCronForm();
        if (!cronForm) {
            throw new Error("CRON expression form did not appear after selecting radio button");
        }

        await cronForm.setCronExpression(cronExpression);
    }

    public async setTimeDeltaSchedule(timeDelta: TimeDeltaFormValue): Promise<void> {
        if (!(await this.isUpdatingEnabled())) {
            throw new Error("Cannot set schedule details when updates are disabled");
        }

        const timeDeltaForm = await this.locatorTimeDeltaForm();
        if (!timeDeltaForm) {
            throw new Error("Time delta form did not appear after selecting radio button");
        }

        await timeDeltaForm.setTimeDelta(timeDelta.every, timeDelta.unit);
    }

    public async isUpdatingEnabled(): Promise<boolean> {
        const toggle = await this.locatorUpdatesToggle();
        return toggle.isChecked();
    }

    public async getScheduleType(): Promise<ScheduleType | null> {
        const scheduleTypeRadio = await this.locatorScheduleTypeTimeDeltaRadio();
        const isTimeDeltaSelected = await scheduleTypeRadio.isChecked();

        const cronRadio = await this.locatorScheduleTypeCronRadio();
        const isCronSelected = await cronRadio.isChecked();

        if (isTimeDeltaSelected) {
            return ScheduleType.TIME_DELTA;
        } else if (isCronSelected) {
            return ScheduleType.CRON_5_COMPONENT_EXPRESSION;
        }
        return null;
    }

    public async currentFormValue(): Promise<IngestTriggerFormValue> {
        const updatesEnabled = await this.isUpdatingEnabled();
        const scheduleType = await this.getScheduleType();

        let timeDelta: TimeDeltaFormValue = { every: null, unit: null };
        let cron: { cronExpression: string | null } = { cronExpression: null };

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
    }
}
