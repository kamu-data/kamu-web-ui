/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { FormControl, FormGroup } from "@angular/forms";

import {
    CronExpressionFormType,
    CronExpressionFormValue,
} from "@common/components/cron-expression-form/cron-expression-form.value";
import { TimeDeltaFormType, TimeDeltaFormValue } from "@common/components/time-delta-form/time-delta-form.value";
import { MaybeNull } from "@interface/app.types";

import { ScheduleType } from "src/app/dataset-view/additional-components/dataset-settings-component/dataset-settings.model";

export interface IngestTriggerFormType {
    __typename: FormControl<MaybeNull<ScheduleType>>;
    timeDelta: FormGroup<TimeDeltaFormType>;
    cron: FormGroup<CronExpressionFormType>;
}

export interface IngestTriggerFormValue {
    __typename: MaybeNull<ScheduleType>;
    timeDelta: TimeDeltaFormValue;
    cron: CronExpressionFormValue;
}
