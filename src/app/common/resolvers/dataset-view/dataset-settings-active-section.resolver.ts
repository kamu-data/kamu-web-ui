/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { ActivatedRouteSnapshot, ResolveFn } from "@angular/router";
import { SettingsTabsEnum } from "src/app/dataset-view/additional-components/dataset-settings-component/dataset-settings.model";
import ProjectLinks from "src/app/project-links";

export const datasetSettingsActiveSectionResolver: ResolveFn<SettingsTabsEnum> = (route: ActivatedRouteSnapshot) => {
    const section =
        (route.parent?.queryParamMap.get(ProjectLinks.URL_QUERY_PARAM_SECTION) as SettingsTabsEnum) ??
        SettingsTabsEnum.GENERAL;
    return section;
};
