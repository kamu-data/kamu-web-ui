/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { FormControl } from "@angular/forms";

export enum DatasetResetMode {
    RESET_TO_SEED = "resetToSeed",
    RESET_METADATA_ONLY = "resetMetadataOnly",
}

export interface ResetDatasetFormType {
    mode: FormControl<DatasetResetMode>;
}

export interface RenameDatasetFormType {
    datasetName: FormControl<string>;
}
