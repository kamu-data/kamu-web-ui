/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { ResolveFn, RouterStateSnapshot } from "@angular/router";
import { SettingsTabsEnum } from "src/app/dataset-view/additional-components/dataset-settings-component/dataset-settings.model";

export const datasetSettingsActiveSectionResolver: ResolveFn<SettingsTabsEnum> = (_, state: RouterStateSnapshot) => {
    const pathWithoutQuery = state.url.split("?")[0];
    const pathWithoutHash = pathWithoutQuery.split("#")[0];
    const routeSegments = pathWithoutHash.split("/").filter(Boolean);
    return routeSegments[routeSegments.length - 1] as SettingsTabsEnum;
};
