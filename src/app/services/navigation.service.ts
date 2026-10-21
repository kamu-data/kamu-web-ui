/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { inject, Injectable } from "@angular/core";
import { RedirectCommand, Router, UrlTree } from "@angular/router";

import { promiseWithCatch } from "@common/helpers/app.helpers";
import { FlowStatus } from "@api/kamu.graphql.interface";
import {
    DatasetInfo,
    DatasetNavigationParams,
    FlowDetailsNavigationParams,
    MetadataBlockNavigationParams,
    WebhooksNavigationParams,
} from "@interface/navigation.interface";

import { AccountTabs } from "src/app/account/account.constants";
import {
    AccountFlowsNav,
    ProcessCardFilterMode,
} from "src/app/account/additional-components/account-flows-tab/account-flows-tab.types";
import { AccountSettingsTabs } from "src/app/account/settings/account-settings.constants";
import { FlowDetailsTabs } from "src/app/dataset-flow/dataset-flow-details/dataset-flow-details.types";
import { SettingsTabsEnum } from "src/app/dataset-view/additional-components/dataset-settings-component/dataset-settings.model";
import { MetadataTabs } from "src/app/dataset-view/additional-components/metadata-component/metadata.constants";
import { DatasetViewTypeEnum } from "src/app/dataset-view/dataset-view.interface";
import ProjectLinks, { SourceEventEditor } from "src/app/project-links";

@Injectable({ providedIn: "root" })
export class NavigationService {
    private router = inject(Router);

    public navigateToWebsite(url: string): void {
        window.open(url, "_blank");
    }

    public navigateToHome(): void {
        promiseWithCatch(this.router.navigate([ProjectLinks.URL_HOME]));
    }

    public homeUrlTree(): UrlTree {
        return this.router.createUrlTree([ProjectLinks.URL_HOME]);
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

    public navigateToMetadata(params: DatasetInfo, tab?: MetadataTabs): void {
        promiseWithCatch(
            this.router.navigateByUrl(
                this.datasetViewUrlTree({
                    ...params,
                    tab: DatasetViewTypeEnum.Metadata,
                    section: tab ?? MetadataTabs.Watermark,
                }),
            ),
        );
    }

    public navigateToMetadataBlock(params: MetadataBlockNavigationParams): void {
        promiseWithCatch(this.router.navigateByUrl(this.metadataBlockUrlTree(params)));
    }

    public metadataBlockUrlTree(params: MetadataBlockNavigationParams): UrlTree {
        return this.router.createUrlTree([
            params.accountName,
            params.datasetName,
            ProjectLinks.URL_BLOCK,
            params.blockHash,
        ]);
    }

    public navigateToAddPollingSource(params: DatasetInfo): void {
        promiseWithCatch(
            this.router.navigateByUrl(this.sourceEventEditorUrlTree(params, SourceEventEditor.AddPollingSource)),
        );
    }

    public navigateToAddPushSource(params: DatasetInfo, sourceName?: string): void {
        promiseWithCatch(
            this.router.navigateByUrl(
                this.sourceEventEditorUrlTree(params, SourceEventEditor.AddPushSource, sourceName),
            ),
        );
    }

    public navigateToSetTransform(params: DatasetInfo): void {
        promiseWithCatch(
            this.router.navigateByUrl(this.sourceEventEditorUrlTree(params, SourceEventEditor.SetTransform)),
        );
    }

    /** The URL of a metadata event editor; `sourceName` selects an existing push source to edit. */
    public sourceEventEditorUrlTree(params: DatasetInfo, editor: SourceEventEditor, sourceName?: string): UrlTree {
        return this.router.createUrlTree([params.accountName, params.datasetName, editor], {
            queryParams: sourceName ? { [ProjectLinks.URL_QUERY_PARAM_PUSH_SOURCE_NAME]: sourceName } : {},
        });
    }

    public navigateToDatasetView(params: DatasetNavigationParams): void {
        promiseWithCatch(this.router.navigateByUrl(this.datasetViewUrlTree(params), { state: params.state }));
    }

    /**
     * The URL of a dataset page. The overview tab is the dataset's root URL, so it gets no
     * segment of its own.
     */
    public datasetViewUrlTree(params: DatasetNavigationParams): UrlTree {
        const tab = params.tab === DatasetViewTypeEnum.Overview ? undefined : params.tab;
        return this.router.createUrlTree(
            [
                params.accountName,
                params.datasetName,
                ...(tab ? [tab] : []),
                ...(params.section ? [params.section] : []),
            ],
            {
                queryParams: {
                    sqlQuery: params.sqlQuery,
                    webhookId: params.webhookId?.length ? params.webhookId.join(",") : undefined,
                    category: params.category ? params.category : undefined,
                    webhooksState: params.webhooksState?.join(","),
                    page: params.page === 1 ? undefined : params.page,
                    pathPrefix: params.pathPrefix,
                    version: params.version,
                },
                fragment: params.fragment,
            },
        );
    }

    public navigateToWebhooks(params: WebhooksNavigationParams): void {
        promiseWithCatch(this.router.navigateByUrl(this.webhooksUrlTree(params)));
    }

    public webhooksUrlTree(params: WebhooksNavigationParams): UrlTree {
        return this.router.createUrlTree([
            params.accountName,
            params.datasetName,
            DatasetViewTypeEnum.Settings,
            SettingsTabsEnum.WEBHOOKS,
            ...(params.tab ? [params.tab] : []),
            ...(params.webhookId ? [params.webhookId] : []),
        ]);
    }

    public navigateToLogin(redirectUrl?: string): void {
        promiseWithCatch(
            this.router.navigate([ProjectLinks.URL_LOGIN], {
                queryParams: {
                    [ProjectLinks.URL_QUERY_PARAM_REDIRECT_URL]: redirectUrl,
                },
            }),
        );
    }

    public loginUrlTree(redirectUrl?: string): UrlTree {
        return this.router.createUrlTree([ProjectLinks.URL_LOGIN], {
            queryParams: {
                [ProjectLinks.URL_QUERY_PARAM_REDIRECT_URL]: redirectUrl,
            },
        });
    }

    public navigateToOwnerView(
        ownerName: string,
        tab?: AccountTabs,
        page?: number,
        nav?: AccountFlowsNav,
        status?: FlowStatus[],
        mode?: ProcessCardFilterMode,
    ): void {
        promiseWithCatch(
            this.router.navigate([ownerName, ProjectLinks.URL_ACCOUNT_SELECT, tab], {
                queryParams: {
                    [ProjectLinks.URL_QUERY_PARAM_ACCOUNT_NAV]: nav,
                    [ProjectLinks.URL_QUERY_PARAM_ACCOUNT_FLOW_STATUS]: status?.join(","),
                    [ProjectLinks.URL_QUERY_PARAM_ACCOUNT_FLOW_FILTERS_MODE]: mode,
                    page,
                },
            }),
        );
    }

    public ownerViewUrlTree(ownerName: string, tab: AccountTabs): UrlTree {
        return this.router.createUrlTree([ownerName, ProjectLinks.URL_ACCOUNT_SELECT, tab]);
    }

    public navigateToPageNotFound(): void {
        promiseWithCatch(
            this.router.navigate([ProjectLinks.URL_PAGE_NOT_FOUND], {
                skipLocationChange: true,
            }),
        );
    }

    /**
     * Shows the page-not-found view from a resolver, as part of the navigation being resolved,
     * and keeps the requested URL in the address bar.
     */
    public pageNotFoundRedirect(): RedirectCommand {
        return new RedirectCommand(this.router.createUrlTree([ProjectLinks.URL_PAGE_NOT_FOUND]), {
            skipLocationChange: true,
        });
    }

    public navigateToReturnToCli(): void {
        promiseWithCatch(
            this.router.navigate([ProjectLinks.URL_RETURN_TO_CLI], {
                skipLocationChange: true,
            }),
        );
    }

    public navigateToFlowDetails(params: FlowDetailsNavigationParams): void {
        promiseWithCatch(this.router.navigateByUrl(this.flowDetailsUrlTree(params)));
    }

    public flowDetailsUrlTree(params: FlowDetailsNavigationParams): UrlTree {
        return this.router.createUrlTree([
            params.accountName,
            params.datasetName,
            ProjectLinks.URL_FLOW_DETAILS,
            params.flowId,
            params.tab ?? FlowDetailsTabs.HISTORY,
        ]);
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
