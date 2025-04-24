/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { ActivatedRouteSnapshot, ResolveFn, RouterStateSnapshot } from "@angular/router";
import { DatasetViewData } from "src/app/dataset-view/dataset-view.interface";
import { datasetSettingsGeneralTabResolver } from "./dataset-settings-general-tab.resolver";

export const datasetSettingsTransformTabResolver: ResolveFn<DatasetViewData | null> = (
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
) => {
    return datasetSettingsGeneralTabResolver(route, state);
};
