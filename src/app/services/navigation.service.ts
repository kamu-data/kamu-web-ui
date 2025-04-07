/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { DatasetInfo, FlowDetailsNavigationParams } from "../interface/navigation.interface";
import { promiseWithCatch } from "src/app/common/helpers/app.helpers";
import { inject, Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { DatasetNavigationParams, MetadataBlockNavigationParams } from "../interface/navigation.interface";
import ProjectLinks from "../project-links";
import { FlowDetailsTabs } from "../dataset-flow/dataset-flow-details/dataset-flow-details.types";
import { AccountSettingsTabs } from "../account/settings/account-settings.constants";

@Injectable({ providedIn: "root" })
export class NavigationService {
    private router = inject(Router);

    public navigateToWebsite(url: string): void {
        window.open(url, "_blank");
    }

    public navigateToHome(): void {
        promiseWithCatch(this.router.navigate([ProjectLinks.URL_HOME]));
    }

    public navigateToPath(url: string): void {
        promiseWithCatch(this.router.navigateByUrl(url));
    }

    public navigateToReplacedPath(url: string): void {
        promiseWithCatch(this.router.navigateByUrl(url, { replaceUrl: true }));
    }

    public navigateToAdminDashBoard(): void {
        promiseWithCatch(this.router.navigate([ProjectLinks.URL_ADMIN_DASHBOARD]));
    }

    public navigateToSearch(query?: string, page?: number): void {
        const queryParams = query ? (page ? { query, page } : { query }) : page ? { page } : {};
        promiseWithCatch(this.router.navigate([ProjectLinks.URL_SEARCH], { queryParams }));
    }

    public navigateToQueryExplainer(commitmentUploadToken: string): void {
        if (commitmentUploadToken) {
            const link = this.router.serializeUrl(
                this.router.createUrlTree([`/${ProjectLinks.URL_QUERY_EXPLAINER}`], {
                    queryParams: {
                        [ProjectLinks.URL_QUERY_PARAM_COMMITMENT_UPLOAD_TOKEN]: commitmentUploadToken,
                    },
                }),
            );
            window.open(link, "_blank");
        }
    }

    public navigateToDatasetCreate(): void {
        promiseWithCatch(this.router.navigate([ProjectLinks.URL_DATASET_CREATE]));
    }

    public navigateToSettings(tab?: AccountSettingsTabs, page?: number): void {
        promiseWithCatch(
            this.router.navigate([ProjectLinks.URL_SETTINGS, tab ? tab : AccountSettingsTabs.PROFILE], {
                queryParams: page && page > 1 ? { page } : {},
            }),
        );
    }

    public navigateToMetadataBlock(params: MetadataBlockNavigationParams): void {
        promiseWithCatch(
            this.router.navigate([params.accountName, params.datasetName, ProjectLinks.URL_BLOCK, params.blockHash]),
        );
    }

    public navigateToAddPollingSource(params: DatasetInfo): void {
        promiseWithCatch(
            this.router.navigate([params.accountName, params.datasetName, ProjectLinks.URL_PARAM_ADD_POLLING_SOURCE]),
        );
    }

    public navigateToAddPushSource(params: DatasetInfo, sourceName?: string): void {
        promiseWithCatch(
            this.router.navigate([params.accountName, params.datasetName, ProjectLinks.URL_PARAM_ADD_PUSH_SOURCE], {
                queryParams: sourceName ? { name: sourceName } : {},
            }),
        );
    }

    public navigateToSetTransform(params: DatasetInfo): void {
        promiseWithCatch(
            this.router.navigate([params.accountName, params.datasetName, ProjectLinks.URL_PARAM_SET_TRANSFORM]),
        );
    }

    public navigateToDatasetView(params: DatasetNavigationParams): void {
        promiseWithCatch(
            this.router.navigate([params.accountName, params.datasetName], {
                queryParams:
                    params.page === 1
                        ? { tab: params.tab, section: params.section }
                        : { tab: params.tab, section: params.section, page: params.page, sqlQuery: params.sqlQuery },
                state: params.state,
            }),
        );
    }

    public navigateToLogin(): void {
        promiseWithCatch(this.router.navigate([ProjectLinks.URL_LOGIN]));
    }

    public navigateToOwnerView(ownerName: string, tab?: string, page?: number): void {
        promiseWithCatch(
            this.router.navigate([ownerName, ProjectLinks.URL_ACCOUNT_SELECT, tab], {
                queryParams: { page },
            }),
        );
    }

    public navigateToPageNotFound(): void {
        promiseWithCatch(
            this.router.navigate([ProjectLinks.URL_PAGE_NOT_FOUND], {
                skipLocationChange: true,
            }),
        );
    }

    public navigateToReturnToCli(): void {
        promiseWithCatch(
            this.router.navigate([ProjectLinks.URL_RETURN_TO_CLI], {
                skipLocationChange: true,
            }),
        );
    }

    public navigateToFlowDetails(params: FlowDetailsNavigationParams): void {
        promiseWithCatch(
            this.router.navigate([
                params.accountName,
                params.datasetName,
                ProjectLinks.URL_FLOW_DETAILS,
                params.flowId,
                params.tab ?? FlowDetailsTabs.HISTORY,
            ]),
        );
    }

    public navigateWithSqlQuery(sqlQuery: string): void {
        promiseWithCatch(
            this.router.navigate([], {
                queryParams: {
                    [ProjectLinks.URL_QUERY_PARAM_SQL_QUERY]: sqlQuery,
                },
                queryParamsHandling: "merge",
            }),
        );
    }
}
