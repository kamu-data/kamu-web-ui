/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { inject } from "@angular/core";
import { ActivatedRouteSnapshot, ResolveFn, RouterStateSnapshot } from "@angular/router";

import { map, Observable, of, switchMap } from "rxjs";

import { DatasetFlowType, GetDatasetFlowTriggerQuery } from "src/app/api/kamu.graphql.interface";
import { DatasetViewData } from "src/app/dataset-view/dataset-view.interface";

import { DatasetFlowTriggerService } from "../../../services/dataset-flow-trigger.service";
import { datasetSettingsGeneralTabResolverFn } from "../../general/resolver/dataset-settings-general-tab.resolver";
import { DatasetSettingsSchedulingTabData } from "../dataset-settings-scheduling-tab.data";

export const datasetSettingsSchedulingTabResolverFn: ResolveFn<DatasetSettingsSchedulingTabData | null> = (
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
) => {
    const datasetFlowTriggerService = inject(DatasetFlowTriggerService);

    return (
        datasetSettingsGeneralTabResolverFn(route, state) as Observable<DatasetSettingsSchedulingTabData | null>
    ).pipe(
        // We can safely cast here because the resolver is used in a context where the type is DatasetSettingsIngestConfigurationTabData
        switchMap((data: DatasetViewData | null) => {
            if (data === null) {
                return of(null);
            }
            return datasetFlowTriggerService
                .fetchDatasetFlowTrigger(data.datasetBasics.id, DatasetFlowType.Ingest)
                .pipe(
                    map((query: GetDatasetFlowTriggerQuery) => {
                        const flowTriggers = query.datasets.byId?.flows.triggers.byType;
                        const paused = flowTriggers?.paused ?? true;
                        const schedule = flowTriggers?.schedule ?? null;
                        const stopPolicy = flowTriggers?.stopPolicy ?? null;
                        return {
                            datasetBasics: data.datasetBasics,
                            datasetPermissions: data.datasetPermissions,
                            schedule,
                            paused,
                            stopPolicy,
                        } as DatasetSettingsSchedulingTabData;
                    }),
                );
        }),
    );
};
