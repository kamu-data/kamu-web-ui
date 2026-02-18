/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { ActivatedRouteSnapshot, ResolveFn } from "@angular/router";

import { MetadataTabs } from "src/app/dataset-view/additional-components/metadata-component/metadata.constants";
import ProjectLinks from "src/app/project-links";

export const metadataActiveTabResolverFn: ResolveFn<MetadataTabs> = (route: ActivatedRouteSnapshot) => {
    const activeTab = route.children[0]?.data[ProjectLinks.URL_PARAM_TAB] as MetadataTabs;
    return activeTab;
};
