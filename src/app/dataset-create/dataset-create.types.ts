/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { FormControl } from "@angular/forms";
import { DatasetKind, DatasetVisibility } from "../api/kamu.graphql.interface";

export interface CreateDatasetFormType {
    // name: FormControl<MaybeNull<string>>;
    owner: FormControl<string>;
    datasetName: FormControl<string>;
    kind: FormControl<DatasetKind>;
    visibility: FormControl<DatasetVisibility>;
}
