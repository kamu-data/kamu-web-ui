/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { inject } from "@angular/core";
import { ActivatedRouteSnapshot, RedirectCommand, ResolveFn, RouterStateSnapshot } from "@angular/router";

import { map, Observable, of, switchMap } from "rxjs";

import { DatasetFlowType, GetDatasetFlowTriggerQuery } from "@api/kamu.graphql.interface";

import { DatasetFlowTriggerService } from "src/app/dataset-view/additional-components/dataset-settings-component/services/dataset-flow-trigger.service";
import { datasetSettingsGeneralTabResolverFn } from "src/app/dataset-view/additional-components/dataset-settings-component/tabs/general/resolver/dataset-settings-general-tab.resolver";
import { DatasetSettingsTransformOptionsTabData } from "src/app/dataset-view/additional-components/dataset-settings-component/tabs/transform-options/dataset-settings-transform-options-tab.data";
import { DatasetViewData } from "src/app/dataset-view/dataset-view.interface";

export const datasetSettingsTransformTabResolverFn: ResolveFn<DatasetSettingsTransformOptionsTabData> = (
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
) => {
    const datasetFlowTriggerService = inject(DatasetFlowTriggerService);

    // The general tab resolver always returns an Observable
    return (datasetSettingsGeneralTabResolverFn(route, state) as Observable<DatasetViewData | RedirectCommand>).pipe(
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
