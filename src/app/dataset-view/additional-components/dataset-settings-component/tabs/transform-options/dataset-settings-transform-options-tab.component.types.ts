/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { FormControl } from "@angular/forms";
import { TimeUnit } from "src/app/api/kamu.graphql.interface";
import { MaybeNull } from "src/app/interface/app.types";

export interface BatchingFormType {
    updatesState: FormControl<boolean>;
    every: FormControl<MaybeNull<number>>;
    unit: FormControl<MaybeNull<TimeUnit>>;
    minRecordsToAwait: FormControl<MaybeNull<number>>;
}
