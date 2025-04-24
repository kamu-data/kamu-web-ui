/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { ActivatedRouteSnapshot, ResolveFn } from "@angular/router";
import { DatasetViewTypeEnum } from "src/app/dataset-view/dataset-view.interface";
import ProjectLinks from "src/app/project-links";

export const datasetViewActiveTabResolver: ResolveFn<DatasetViewTypeEnum> = (route: ActivatedRouteSnapshot) => {
    const activeTab = route.children[0].data[ProjectLinks.URL_PARAM_TAB] as DatasetViewTypeEnum;
    return activeTab;
};
