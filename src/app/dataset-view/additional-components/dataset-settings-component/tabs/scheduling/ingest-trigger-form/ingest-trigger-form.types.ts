/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { FormControl, FormGroup } from "@angular/forms";
import { MaybeNull } from "src/app/interface/app.types";
import { TimeDeltaFormType, TimeDeltaFormValue } from "src/app/common/components/time-delta-form/time-delta-form.value";
import {
    CronExpressionFormType,
    CronExpressionFormValue,
} from "src/app/common/components/cron-expression-form/cron-expression-form.value";
import { ScheduleType } from "../../../dataset-settings.model";

export interface IngestTriggerFormType {
    updatesEnabled: FormControl<boolean>;
    __typename: FormControl<MaybeNull<ScheduleType>>;
    timeDelta: FormGroup<TimeDeltaFormType>;
    cron: FormGroup<CronExpressionFormType>;
}

export interface IngestTriggerFormValue {
    updatesEnabled: boolean;
    __typename: MaybeNull<ScheduleType>;
    timeDelta: TimeDeltaFormValue;
    cron: CronExpressionFormValue;
}
