/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { FormControl, FormGroup } from "@angular/forms";
import { PollingGroupEnum } from "../../dataset-settings.model";
import { TimeUnit } from "src/app/api/kamu.graphql.interface";
import { MaybeNull } from "src/app/interface/app.types";

export interface PollingFormType {
    pollingGroup: FormGroup<PollingGroupFormValue>;
}

export interface PollingGroupFormValue {
    updatesState: FormControl<boolean>;
    __typename: FormControl<MaybeNull<PollingGroupEnum>>;
    every: FormControl<MaybeNull<number>>;
    unit: FormControl<MaybeNull<TimeUnit>>;
    cronExpression: FormControl<MaybeNull<string>>;
}

export interface IngestConfigurationFormType {
    fetchUncacheable: FormControl<boolean>;
}
