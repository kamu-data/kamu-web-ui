/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { ActivatedRouteSnapshot, ResolveFn, RouterStateSnapshot } from "@angular/router";
import { DatasetViewData } from "src/app/dataset-view/dataset-view.interface";
import { datasetSettingsGeneralTabResolverFn } from "../../general/resolver/dataset-settings-general-tab.resolver";

export const datasetSettingsSchedulingTabResolverFn: ResolveFn<DatasetViewData | null> = (
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
) => {
    return datasetSettingsGeneralTabResolverFn(route, state);
};
