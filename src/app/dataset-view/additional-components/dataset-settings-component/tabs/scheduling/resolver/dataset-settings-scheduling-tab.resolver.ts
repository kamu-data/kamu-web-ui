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
import { DatasetSettingsSchedulingTabData } from "src/app/dataset-view/additional-components/dataset-settings-component/tabs/scheduling/dataset-settings-scheduling-tab.data";
import ProjectLinks from "src/app/project-links";

export const datasetSettingsSchedulingTabResolverFn: ResolveFn<DatasetSettingsSchedulingTabData> = (route) => {
    return requestFlowTriggerTabData(
        enumValueOf(SettingsTabsEnum, route.data[ProjectLinks.URL_PARAM_TAB]),
        DatasetFlowType.Ingest,
        (trigger) => ({ schedule: trigger?.schedule ?? null }),
    );
};
