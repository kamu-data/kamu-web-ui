/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { ActivatedRouteSnapshot, ResolveFn, RouterStateSnapshot } from "@angular/router";

import { datasetSettingsGeneralTabResolverFn } from "src/app/dataset-view/additional-components/dataset-settings-component/tabs/general/resolver/dataset-settings-general-tab.resolver";
import { DatasetViewData } from "src/app/dataset-view/dataset-view.interface";

export const datasetSettingsCompactionTabResolverFn: ResolveFn<DatasetViewData | null> = (
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
) => {
    return datasetSettingsGeneralTabResolverFn(route, state);
};
