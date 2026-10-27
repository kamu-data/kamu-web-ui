/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { inject } from "@angular/core";
import { ActivatedRouteSnapshot, RedirectCommand, ResolveFn } from "@angular/router";

import { map, of, switchMap } from "rxjs";

import { isNil } from "@common/helpers/app.helpers";
import { DatasetFlowType, GetDatasetFlowConfigsQuery } from "@api/kamu.graphql.interface";

import { SettingsTabsEnum } from "src/app/dataset-view/additional-components/dataset-settings-component/dataset-settings.model";
import { resolveSettingsTabAccess } from "src/app/dataset-view/additional-components/dataset-settings-component/resolvers/settings-tab-access.helpers";
import { DatasetFlowConfigService } from "src/app/dataset-view/additional-components/dataset-settings-component/services/dataset-flow-config.service";
import { DatasetSettingsIngestConfigurationTabData } from "src/app/dataset-view/additional-components/dataset-settings-component/tabs/ingest-configuration/dataset-settings-ingest-configuration-tab.data";
import ProjectLinks from "src/app/project-links";

export const datasetSettingsIngestConfigurationResolverFn: ResolveFn<DatasetSettingsIngestConfigurationTabData> = (
    route: ActivatedRouteSnapshot,
) => {
    const datasetFlowConfigService = inject(DatasetFlowConfigService);

    return resolveSettingsTabAccess(route.data[ProjectLinks.URL_PARAM_TAB] as SettingsTabsEnum).pipe(
        switchMap((data) => {
            if (data instanceof RedirectCommand) {
                return of(data);
            }
            return datasetFlowConfigService.fetchDatasetFlowConfigs(data.datasetBasics.id, DatasetFlowType.Ingest).pipe(
                map((ingestConfig: GetDatasetFlowConfigsQuery): DatasetSettingsIngestConfigurationTabData => {
                    const fullConfig = ingestConfig.datasets.byId?.flows.configs.byType;
                    const retryPolicy = fullConfig?.retryPolicy ?? null;
                    const flowConfigRule = fullConfig?.rule;
                    if (flowConfigRule?.__typename === "FlowConfigRuleIngest") {
                        return {
                            ...data,
                            ingestionRule: flowConfigRule,
                            retryPolicy,
                        };
                    } else if (isNil(flowConfigRule)) {
                        return {
                            ...data,
                            ingestionRule: {
                                __typename: "FlowConfigRuleIngest",
                                fetchUncacheable: false,
                                fetchNextIteration: false,
                            },
                            retryPolicy,
                        };
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
