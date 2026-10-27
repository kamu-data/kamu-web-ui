/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { ResolveFn } from "@angular/router";

import { enumValueOf } from "@common/helpers/app.helpers";
import { DatasetFlowType } from "@api/kamu.graphql.interface";

import { SettingsTabsEnum } from "src/app/dataset-view/additional-components/dataset-settings-component/dataset-settings.model";
import { requestFlowTriggerTabData } from "src/app/dataset-view/additional-components/dataset-settings-component/resolvers/flow-trigger-tab.helpers";
import { DatasetSettingsTransformOptionsTabData } from "src/app/dataset-view/additional-components/dataset-settings-component/tabs/transform-options/dataset-settings-transform-options-tab.data";
import ProjectLinks from "src/app/project-links";

export const datasetSettingsTransformTabResolverFn: ResolveFn<DatasetSettingsTransformOptionsTabData> = (route) => {
    return requestFlowTriggerTabData(
        enumValueOf(SettingsTabsEnum, route.data[ProjectLinks.URL_PARAM_TAB]),
        DatasetFlowType.ExecuteTransform,
        (trigger) => ({ reactive: trigger?.reactive ?? null }),
    );
};
