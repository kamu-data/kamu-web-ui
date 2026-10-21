/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { inject } from "@angular/core";
import { ActivatedRouteSnapshot, RedirectCommand, ResolveFn } from "@angular/router";

import { map, of, switchMap } from "rxjs";

import { DatasetFlowType, GetDatasetFlowTriggerQuery } from "@api/kamu.graphql.interface";

import { SettingsTabsEnum } from "src/app/dataset-view/additional-components/dataset-settings-component/dataset-settings.model";
import { resolveSettingsTabAccess } from "src/app/dataset-view/additional-components/dataset-settings-component/resolvers/settings-tab-access.helpers";
import { DatasetFlowTriggerService } from "src/app/dataset-view/additional-components/dataset-settings-component/services/dataset-flow-trigger.service";
import { DatasetSettingsTransformOptionsTabData } from "src/app/dataset-view/additional-components/dataset-settings-component/tabs/transform-options/dataset-settings-transform-options-tab.data";
import ProjectLinks from "src/app/project-links";

export const datasetSettingsTransformTabResolverFn: ResolveFn<DatasetSettingsTransformOptionsTabData> = (
    route: ActivatedRouteSnapshot,
) => {
    const datasetFlowTriggerService = inject(DatasetFlowTriggerService);

    return resolveSettingsTabAccess(route.data[ProjectLinks.URL_PARAM_TAB] as SettingsTabsEnum).pipe(
        switchMap((data) => {
            if (data instanceof RedirectCommand) {
                return of(data);
            }
            return datasetFlowTriggerService
                .fetchDatasetFlowTrigger(data.datasetBasics.id, DatasetFlowType.ExecuteTransform)
                .pipe(
                    map((query: GetDatasetFlowTriggerQuery) => {
                        const flowTriggers = query.datasets.byId?.flows.triggers.byType;
                        const paused = flowTriggers?.paused ?? true;
                        const reactive = flowTriggers?.reactive ?? null;

                        const stopPolicy = flowTriggers?.stopPolicy ?? null;

                        return {
                            datasetBasics: data.datasetBasics,
                            datasetPermissions: data.datasetPermissions,
                            reactive,
                            paused,
                            stopPolicy,
                        };
                    }),
                );
        }),
    );
};
