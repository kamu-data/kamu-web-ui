/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { inject } from "@angular/core";
import { ActivatedRouteSnapshot, ResolveFn, RouterStateSnapshot } from "@angular/router";

import { map, Observable, of, switchMap } from "rxjs";

import { DatasetFlowType, FlowTriggerStopPolicy, GetDatasetFlowTriggerQuery } from "src/app/api/kamu.graphql.interface";
import { DatasetViewData } from "src/app/dataset-view/dataset-view.interface";
import { MaybeNull } from "src/app/interface/app.types";

import { DatasetFlowTriggerService } from "../../../services/dataset-flow-trigger.service";
import { datasetSettingsGeneralTabResolverFn } from "../../general/resolver/dataset-settings-general-tab.resolver";
import { DatasetSettingsTransformOptionsTabData } from "../dataset-settings-transform-options-tab.data";

export const datasetSettingsTransformTabResolverFn: ResolveFn<DatasetSettingsTransformOptionsTabData | null> = (
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
) => {
    const datasetFlowTriggerService = inject(DatasetFlowTriggerService);

    return (
        datasetSettingsGeneralTabResolverFn(route, state) as Observable<DatasetSettingsTransformOptionsTabData | null>
    ).pipe(
        // We can safely cast here because the resolver is used in a context where the type is DatasetSettingsIngestConfigurationTabData
        switchMap((data: DatasetViewData | null) => {
            if (data === null) {
                return of(null);
            }
            return datasetFlowTriggerService
                .fetchDatasetFlowTrigger(data.datasetBasics.id, DatasetFlowType.ExecuteTransform)
                .pipe(
                    map((query: GetDatasetFlowTriggerQuery) => {
                        const flowTriggers = query.datasets.byId?.flows.triggers.byType;
                        const paused = flowTriggers?.paused ?? true;
                        const reactive = flowTriggers?.reactive ?? null;

                        let stopPolicy: MaybeNull<FlowTriggerStopPolicy> = null;
                        if (flowTriggers?.stopPolicy) {
                            switch (flowTriggers.stopPolicy.__typename) {
                                case "FlowTriggerStopPolicyNever":
                                    stopPolicy = {
                                        __typename: "FlowTriggerStopPolicyNever",
                                        dummy: false,
                                    };
                                    break;
                                case "FlowTriggerStopPolicyAfterConsecutiveFailures":
                                    stopPolicy = {
                                        __typename: "FlowTriggerStopPolicyAfterConsecutiveFailures",
                                        maxFailures: flowTriggers?.stopPolicy.maxFailures,
                                    };
                                    break;
                                /* istanbul ignore next */
                                default:
                                    throw new Error("Unknown flow trigger stop policy");
                            }
                        }

                        return {
                            datasetBasics: data.datasetBasics,
                            datasetPermissions: data.datasetPermissions,
                            reactive,
                            paused,
                            stopPolicy,
                        } as DatasetSettingsTransformOptionsTabData;
                    }),
                );
        }),
    );
};
