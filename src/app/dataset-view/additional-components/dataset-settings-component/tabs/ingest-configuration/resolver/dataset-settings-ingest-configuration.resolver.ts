/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { ActivatedRouteSnapshot, ResolveFn, RouterStateSnapshot } from "@angular/router";
import { DatasetViewData } from "src/app/dataset-view/dataset-view.interface";
import { datasetSettingsGeneralTabResolverFn } from "../../general/resolver/dataset-settings-general-tab.resolver";
import { DatasetSettingsIngestConfigurationTabData } from "../dataset-settings-ingest-configuration-tab.data";
import { map, Observable, of, switchMap } from "rxjs";
import { DatasetFlowConfigService } from "../../../services/dataset-flow-config.service";
import { inject } from "@angular/core";
import { DatasetFlowType, FlowConfigRuleIngest, GetDatasetFlowConfigsQuery } from "src/app/api/kamu.graphql.interface";
import { isNil } from "src/app/common/helpers/app.helpers";

export const datasetSettingsIngestConfigurationResolverFn: ResolveFn<
    DatasetSettingsIngestConfigurationTabData | null
> = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
    const datasetFlowConfigService = inject(DatasetFlowConfigService);

    return (datasetSettingsGeneralTabResolverFn(route, state) as Observable<DatasetViewData | null>).pipe(
        // We can safely cast here because the resolver is used in a context where the type is DatasetSettingsIngestConfigurationTabData
        switchMap((data: DatasetViewData | null) => {
            if (data === null) {
                return of(null);
            }
            return datasetFlowConfigService.fetchDatasetFlowConfigs(data.datasetBasics.id, DatasetFlowType.Ingest).pipe(
                map((ingestConfig: GetDatasetFlowConfigsQuery) => {
                    const fullConfig = ingestConfig.datasets.byId?.flows.configs.byType;
                    const retryPolicy = fullConfig?.retryPolicy ?? null;
                    const flowConfigRule = fullConfig?.rule;
                    if (flowConfigRule?.__typename === "FlowConfigRuleIngest") {
                        return {
                            ...data,
                            ingestionRule: flowConfigRule,
                            retryPolicy,
                        } as DatasetSettingsIngestConfigurationTabData;
                    } else if (isNil(flowConfigRule)) {
                        return {
                            ...data,
                            ingestionRule: {
                                fetchUncacheable: false,
                                fetchNextIteration: false,
                            } as FlowConfigRuleIngest,
                            retryPolicy,
                        } as DatasetSettingsIngestConfigurationTabData;
                    } else {
                        throw new Error(
                            `Unexpected flow config rule type: ${flowConfigRule?.__typename}. Expected FlowConfigRuleIngest.`,
                        );
                    }
                }),
            );
        }),
    );
};
