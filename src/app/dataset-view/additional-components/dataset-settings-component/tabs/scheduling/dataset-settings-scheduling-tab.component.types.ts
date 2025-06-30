/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { FormControl } from "@angular/forms";
import { PollingGroupEnum } from "../../dataset-settings.model";
import { MaybeNull } from "src/app/interface/app.types";
import { TimeDeltaFormValue } from "src/app/common/components/time-delta-form/time-delta-form.value";
import { CronExpressionFormValue } from "src/app/common/components/cron-expression-form/cron-expression-form.value";

export interface PollingGroupFormType {
    updatesEnabled: FormControl<boolean>;
    __typename: FormControl<MaybeNull<PollingGroupEnum>>;
    timeDelta: FormControl<MaybeNull<TimeDeltaFormValue>>;
    cron: FormControl<MaybeNull<CronExpressionFormValue>>;
}

export interface PollingGroupFormValue {
    updatesEnabled: boolean;
    __typename: PollingGroupEnum | null;
    timeDelta: MaybeNull<TimeDeltaFormValue>;
    cron: MaybeNull<CronExpressionFormValue>;
}

export interface IngestConfigurationFormType {
    fetchUncacheable: FormControl<boolean>;
}
