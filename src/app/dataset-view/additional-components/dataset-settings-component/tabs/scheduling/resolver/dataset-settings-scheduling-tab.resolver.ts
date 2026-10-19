/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { inject } from "@angular/core";
import { ActivatedRouteSnapshot, ResolveFn, RouterStateSnapshot } from "@angular/router";

import { map, Observable, of, switchMap } from "rxjs";

import { DatasetFlowType, GetDatasetFlowTriggerQuery } from "@api/kamu.graphql.interface";
import { MaybeNull } from "@interface/app.types";

import { DatasetFlowTriggerService } from "src/app/dataset-view/additional-components/dataset-settings-component/services/dataset-flow-trigger.service";
import { datasetSettingsGeneralTabResolverFn } from "src/app/dataset-view/additional-components/dataset-settings-component/tabs/general/resolver/dataset-settings-general-tab.resolver";
import { DatasetSettingsSchedulingTabData } from "src/app/dataset-view/additional-components/dataset-settings-component/tabs/scheduling/dataset-settings-scheduling-tab.data";
import { DatasetViewData } from "src/app/dataset-view/dataset-view.interface";

export const datasetSettingsSchedulingTabResolverFn: ResolveFn<MaybeNull<DatasetSettingsSchedulingTabData>> = (
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
) => {
    const datasetFlowTriggerService = inject(DatasetFlowTriggerService);

    return (
        datasetSettingsGeneralTabResolverFn(route, state) as Observable<MaybeNull<DatasetSettingsSchedulingTabData>>
    ).pipe(
        // We can safely cast here because the resolver is used in a context where the type is DatasetSettingsIngestConfigurationTabData
        switchMap((data: MaybeNull<DatasetViewData>) => {
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
