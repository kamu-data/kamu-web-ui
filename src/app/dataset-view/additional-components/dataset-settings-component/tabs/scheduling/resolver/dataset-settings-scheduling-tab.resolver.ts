/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { ActivatedRouteSnapshot, ResolveFn, RouterStateSnapshot } from "@angular/router";
import { DatasetViewData } from "src/app/dataset-view/dataset-view.interface";
import { datasetSettingsGeneralTabResolverFn } from "../../general/resolver/dataset-settings-general-tab.resolver";
import { DatasetFlowTriggerService } from "../../../services/dataset-flow-trigger.service";
import { inject } from "@angular/core";
import { map, Observable, of, switchMap } from "rxjs";
import { DatasetFlowType, GetDatasetFlowTriggersQuery } from "src/app/api/kamu.graphql.interface";
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
                .fetchDatasetFlowTriggers(data.datasetBasics.id, DatasetFlowType.Ingest)
                .pipe(
                    map((query: GetDatasetFlowTriggersQuery) => {
                        const flowTriggers = query.datasets.byId?.flows.triggers.byType;
                        const paused = flowTriggers?.paused ?? true;
                        const schedule = flowTriggers?.schedule ?? null;
                        return {
                            datasetBasics: data.datasetBasics,
                            datasetPermissions: data.datasetPermissions,
                            schedule,
                            paused,
                        } as DatasetSettingsSchedulingTabData;
                    }),
                );
        }),
    );
};
