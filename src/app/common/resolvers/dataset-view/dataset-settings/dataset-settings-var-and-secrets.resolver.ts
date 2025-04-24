/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { ResolveFn } from "@angular/router";
import { DatasetViewData } from "src/app/dataset-view/dataset-view.interface";
import { datasetSettingsGeneralTabResolverFn } from "./dataset-settings-general-tab.resolver";

export const datasetSettingsVarAndSecretsResolverFn: ResolveFn<DatasetViewData | null> = (route, state) => {
    return datasetSettingsGeneralTabResolverFn(route, state);
};
