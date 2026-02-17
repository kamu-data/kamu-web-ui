/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { ActivatedRouteSnapshot, ResolveFn } from "@angular/router";

import ProjectLinks from "src/app/project-links";

import { MetadataTabs } from "../metadata.constants";

export const metadataActiveTabResolverFn: ResolveFn<MetadataTabs> = (route: ActivatedRouteSnapshot) => {
    const activeTab = route.children[0]?.data[ProjectLinks.URL_PARAM_TAB] as MetadataTabs;
    return activeTab;
};
