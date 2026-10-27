/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { ActivatedRouteSnapshot, ResolveFn } from "@angular/router";

import { enumValueOf, requireValue } from "@common/helpers/app.helpers";

import { SettingsTabsEnum } from "src/app/dataset-view/additional-components/dataset-settings-component/dataset-settings.model";
import ProjectLinks from "src/app/project-links";

export const datasetSettingsActiveSectionResolverFn: ResolveFn<SettingsTabsEnum> = (route: ActivatedRouteSnapshot) => {
    const activeTab = requireValue(
        enumValueOf(SettingsTabsEnum, route.children[0]?.data[ProjectLinks.URL_PARAM_TAB]),
        "Route has no SettingsTabsEnum tab",
    );
    return activeTab;
};
