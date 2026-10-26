/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { TestBed } from "@angular/core/testing";
import { provideRouter, RedirectCommand, Router, UrlTree } from "@angular/router";

import { FlowStatus } from "@api/kamu.graphql.interface";
import { DatasetNavigationParams } from "@interface/navigation.interface";

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
import { NavigationService } from "src/app/services/navigation.service";

describe("NavigationService", () => {
    let service: NavigationService;
    let router: Router;

    beforeAll(() => {
        window.onbeforeunload = () => null;
    });

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [provideRouter([])],
        });
        service = TestBed.inject(NavigationService);
        router = TestBed.inject(Router);
    });

    it("should be created", () => {
        expect(service).toBeTruthy();
    });

    it("should test navigate to home", () => {
        const routerSpy = spyOn(router, "navigateByUrl").and.resolveTo(true);
        service.navigateToHome();
        expect(navigatedUrl(routerSpy)).toEqual("/");
    });

    it("should build the home URL", () => {
        expect(router.serializeUrl(service.homeUrlTree())).toEqual("/");
    });

    it("should build the sign-in unavailable URL", () => {
        expect(router.serializeUrl(service.loginUnavailableUrlTree())).toEqual(
            `/${ProjectLinks.URL_LOGIN_UNAVAILABLE}`,
        );
    });

    it("should build the login URL with and without a redirect URL", () => {
        expect(router.serializeUrl(service.loginUrlTree())).toEqual(`/${ProjectLinks.URL_LOGIN}`);
        expect(router.serializeUrl(service.loginUrlTree("/kamu"))).toEqual(
            `/${ProjectLinks.URL_LOGIN}?${ProjectLinks.URL_QUERY_PARAM_REDIRECT_URL}=%2Fkamu`,
        );
    });

    it("should build the owner view URL", () => {
        expect(router.serializeUrl(service.ownerViewUrlTree("kamu", AccountTabs.DATASETS))).toEqual(
            `/kamu/${ProjectLinks.URL_ACCOUNT_SELECT}/${AccountTabs.DATASETS}`,
        );
    });

    it("should build a page-not-found redirect that keeps the URL", () => {
        const command = service.pageNotFoundRedirect();
        expect(command).toBeInstanceOf(RedirectCommand);
        expect(router.serializeUrl(command.redirectTo)).toEqual(`/${ProjectLinks.URL_PAGE_NOT_FOUND}`);
        expect(command.navigationBehaviorOptions).toEqual({ skipLocationChange: true });
    });

    it("should test navigate to login with a redirect URL", () => {
        const routerSpy = spyOn(router, "navigateByUrl").and.resolveTo(true);
        service.navigateToLogin("/kamu");
        expect(navigatedUrl(routerSpy)).toEqual(
            `/${ProjectLinks.URL_LOGIN}?${ProjectLinks.URL_QUERY_PARAM_REDIRECT_URL}=%2Fkamu`,
        );
    });

    it("should test navigate to login", () => {
        const routerSpy = spyOn(router, "navigateByUrl").and.resolveTo(true);
        service.navigateToLogin();
        expect(navigatedUrl(routerSpy)).toEqual(`/${ProjectLinks.URL_LOGIN}`);
    });

    it("should navigate to a settings tab, adding the page after the first one", () => {
        const routerSpy = spyOn(router, "navigateByUrl").and.resolveTo(true);
        service.navigateToSettings(AccountSettingsTabs.ACCESS_TOKENS);
        expect(navigatedUrl(routerSpy)).toEqual(`/${ProjectLinks.URL_SETTINGS}/${AccountSettingsTabs.ACCESS_TOKENS}`);
        service.navigateToSettings(AccountSettingsTabs.ACCESS_TOKENS, 1);
        expect(navigatedUrl(routerSpy)).toEqual(`/${ProjectLinks.URL_SETTINGS}/${AccountSettingsTabs.ACCESS_TOKENS}`);
        service.navigateToSettings(AccountSettingsTabs.ACCESS_TOKENS, 2);
        expect(navigatedUrl(routerSpy)).toEqual(
            `/${ProjectLinks.URL_SETTINGS}/${AccountSettingsTabs.ACCESS_TOKENS}?page=2`,
        );
    });

    it("should build the metadata block URL", () => {
        expect(
            router.serializeUrl(
                service.metadataBlockUrlTree({ accountName: "kamu", datasetName: "ds", blockHash: "f1620abc" }),
            ),
        ).toEqual(`/kamu/ds/${ProjectLinks.URL_BLOCK}/f1620abc`);
    });

    it("should navigate to a metadata tab, the watermark tab by default", () => {
        const routerSpy = spyOn(router, "navigateByUrl").and.resolveTo(true);
        service.navigateToMetadata({ accountName: "kamu", datasetName: "ds" });
        expect(navigatedUrl(routerSpy)).toEqual(`/kamu/ds/${DatasetViewTypeEnum.Metadata}/${MetadataTabs.Watermark}`);
        service.navigateToMetadata({ accountName: "kamu", datasetName: "ds" }, MetadataTabs.Schema);
        expect(navigatedUrl(routerSpy)).toEqual(`/kamu/ds/${DatasetViewTypeEnum.Metadata}/${MetadataTabs.Schema}`);
    });

    it("should navigate to the webhooks list and to one webhook", () => {
        const routerSpy = spyOn(router, "navigateByUrl").and.resolveTo(true);
        const webhooksUrl = `/kamu/ds/${DatasetViewTypeEnum.Settings}/${SettingsTabsEnum.WEBHOOKS}`;
        service.navigateToWebhooks({ accountName: "kamu", datasetName: "ds" });
        expect(navigatedUrl(routerSpy)).toEqual(webhooksUrl);
        service.navigateToWebhooks({ accountName: "kamu", datasetName: "ds", webhookId: "w1" });
        expect(navigatedUrl(routerSpy)).toEqual(`${webhooksUrl}/w1`);
    });

    it("should test navigate to owner page and tab equal overview", () => {
        const routerSpy = spyOn(router, "navigateByUrl").and.resolveTo(true);
        service.navigateToOwnerView("kamu", AccountTabs.OVERVIEW);
        expect(navigatedUrl(routerSpy)).toEqual(`/kamu/${ProjectLinks.URL_ACCOUNT_SELECT}/${AccountTabs.OVERVIEW}`);
    });

    it("should join several flow statuses in the owner page URL", () => {
        const routerSpy = spyOn(router, "navigateByUrl").and.resolveTo(true);
        service.navigateToOwnerView("kamu", AccountTabs.FLOWS, undefined, undefined, [
            FlowStatus.Finished,
            FlowStatus.Running,
        ]);
        expect(navigatedUrl(routerSpy)).toEqual(
            `/kamu/${ProjectLinks.URL_ACCOUNT_SELECT}/${AccountTabs.FLOWS}?${ProjectLinks.URL_QUERY_PARAM_ACCOUNT_FLOW_STATUS}=${FlowStatus.Finished},${FlowStatus.Running}`,
        );
    });

    it("should test navigate to owner page and tab not equal overview", () => {
        const routerSpy = spyOn(router, "navigateByUrl").and.resolveTo(true);
        service.navigateToOwnerView(
            "kamu",
            AccountTabs.DATASETS,
            2,
            AccountFlowsNav.ACTIVITY,
            [FlowStatus.Finished],
            ProcessCardFilterMode.CUSTOM,
        );
        const [path] = navigatedUrl(routerSpy).split("?");
        expect(path).toEqual(`/kamu/${ProjectLinks.URL_ACCOUNT_SELECT}/${AccountTabs.DATASETS}`);
        expect(router.parseUrl(navigatedUrl(routerSpy)).queryParams).toEqual({
            [ProjectLinks.URL_QUERY_PARAM_ACCOUNT_NAV]: AccountFlowsNav.ACTIVITY,
            [ProjectLinks.URL_QUERY_PARAM_ACCOUNT_FLOW_STATUS]: FlowStatus.Finished,
            [ProjectLinks.URL_QUERY_PARAM_ACCOUNT_FLOW_FILTERS_MODE]: ProcessCardFilterMode.CUSTOM,
            page: "2",
        });
    });

    it("should leave the tab out of the owner page URL when none is given", () => {
        expect(router.serializeUrl(service.ownerViewUrlTree("kamu"))).toEqual(
            `/kamu/${ProjectLinks.URL_ACCOUNT_SELECT}`,
        );
    });

    it("should test navigate to website", () => {
        const mockWebsite = "http://google.com";
        const windowSpy = spyOn(window, "open").and.returnValue(null);
        service.navigateToWebsite(mockWebsite);
        expect(windowSpy).toHaveBeenCalledWith(mockWebsite, "_blank");
    });

    it("should test navigate to search", () => {
        const routerSpy = spyOn(router, "navigate").and.resolveTo(true);
        service.navigateToSearch();
        expect(routerSpy).toHaveBeenCalledWith([ProjectLinks.URL_SEARCH], {
            queryParams: {},
        });
    });

    it("should test navigate to search with query", () => {
        const routerSpy = spyOn(router, "navigate").and.resolveTo(true);
        const testQuery = "test query";
        service.navigateToSearch(testQuery);
        expect(routerSpy).toHaveBeenCalledWith([ProjectLinks.URL_SEARCH], {
            queryParams: { query: testQuery },
        });
    });

    it("should test navigate to search with page", () => {
        const routerSpy = spyOn(router, "navigate").and.resolveTo(true);
        const testPage = 3;
        service.navigateToSearch(undefined /*query*/, testPage);
        expect(routerSpy).toHaveBeenCalledWith([ProjectLinks.URL_SEARCH], {
            queryParams: { page: testPage },
        });
    });

    it("should test navigate to search with query and page", () => {
        const routerSpy = spyOn(router, "navigate").and.resolveTo(true);
        const testQuery = "test query";
        const testPage = 3;
        service.navigateToSearch(testQuery, testPage);
        expect(routerSpy).toHaveBeenCalledWith([ProjectLinks.URL_SEARCH], {
            queryParams: { query: testQuery, page: testPage },
        });
    });

    it("should navigate to a dataset tab and pass the navigation state", () => {
        const routerSpy = spyOn(router, "navigateByUrl").and.resolveTo(true);
        const state = { from: "test" };

        service.navigateToDatasetView({ accountName: "kamu", datasetName: "ds", tab: "history", page: 2, state });

        expect(navigatedUrl(routerSpy)).toEqual("/kamu/ds/history?page=2");
        expect(routerSpy.calls.mostRecent().args[1]).toEqual({ state });
    });

    [
        { params: { accountName: "kamu", datasetName: "ds" }, expectedUrl: "/kamu/ds" },
        {
            params: { accountName: "kamu", datasetName: "ds", tab: DatasetViewTypeEnum.Overview },
            expectedUrl: "/kamu/ds",
        },
        {
            params: { accountName: "kamu", datasetName: "ds", tab: "history", page: 1 },
            expectedUrl: "/kamu/ds/history",
        },
        {
            params: { accountName: "kamu", datasetName: "ds", tab: DatasetViewTypeEnum.Settings, section: "webhooks" },
            expectedUrl: "/kamu/ds/settings/webhooks",
        },
        {
            params: { accountName: "kamu", datasetName: "ds", tab: DatasetViewTypeEnum.Flows, webhookId: ["a", "b"] },
            expectedUrl: "/kamu/ds/flows?webhookId=a,b",
        },
    ].forEach(({ params, expectedUrl }: { params: DatasetNavigationParams; expectedUrl: string }) => {
        it(`should build the dataset URL ${expectedUrl}`, () => {
            expect(router.serializeUrl(service.datasetViewUrlTree(params))).toEqual(expectedUrl);
        });
    });

    it("should test navigate to page not found view", () => {
        const routerSpy = spyOn(router, "navigateByUrl").and.resolveTo(true);
        service.navigateToPageNotFound();
        expect(navigatedUrl(routerSpy)).toEqual(`/${ProjectLinks.URL_PAGE_NOT_FOUND}`);
        expect(routerSpy.calls.mostRecent().args[1]).toEqual({ skipLocationChange: true });
    });

    it("should test navigate to return to CLI view", () => {
        const routerSpy = spyOn(router, "navigate").and.resolveTo(true);
        service.navigateToReturnToCli();
        expect(routerSpy).toHaveBeenCalledWith([ProjectLinks.URL_RETURN_TO_CLI], {
            skipLocationChange: true,
        });
    });

    it("should test navigate to admin dashboard", () => {
        const routerSpy = spyOn(router, "navigate").and.resolveTo(true);
        service.navigateToAdminDashBoard();
        expect(routerSpy).toHaveBeenCalledWith([ProjectLinks.URL_ADMIN_DASHBOARD]);
    });

    it("should test navigate to AddPollingSource view", () => {
        const routerSpy = spyOn(router, "navigateByUrl").and.resolveTo(true);
        service.navigateToAddPollingSource({ accountName: "kamu", datasetName: "ds" });
        expect(navigatedUrl(routerSpy)).toEqual(`/kamu/ds/${SourceEventEditor.AddPollingSource}`);
    });

    it("should test navigate to AddPushSource view", () => {
        const routerSpy = spyOn(router, "navigateByUrl").and.resolveTo(true);
        service.navigateToAddPushSource({ accountName: "kamu", datasetName: "ds" }, "Mock-name");
        expect(navigatedUrl(routerSpy)).toEqual(
            `/kamu/ds/${SourceEventEditor.AddPushSource}?${ProjectLinks.URL_QUERY_PARAM_PUSH_SOURCE_NAME}=Mock-name`,
        );
    });

    it("should test navigate to SetTransform view", () => {
        const routerSpy = spyOn(router, "navigateByUrl").and.resolveTo(true);
        service.navigateToSetTransform({ accountName: "kamu", datasetName: "ds" });
        expect(navigatedUrl(routerSpy)).toEqual(`/kamu/ds/${SourceEventEditor.SetTransform}`);
    });

    it("should test navigate to flow details view, the history tab by default", () => {
        const routerSpy = spyOn(router, "navigateByUrl").and.resolveTo(true);
        service.navigateToFlowDetails({ accountName: "kamu", datasetName: "ds", flowId: "5" });
        expect(navigatedUrl(routerSpy)).toEqual(
            `/kamu/ds/${ProjectLinks.URL_FLOW_DETAILS}/5/${FlowDetailsTabs.HISTORY}`,
        );
        service.navigateToFlowDetails({
            accountName: "kamu",
            datasetName: "ds",
            flowId: "5",
            tab: FlowDetailsTabs.LOGS,
        });
        expect(navigatedUrl(routerSpy)).toEqual(`/kamu/ds/${ProjectLinks.URL_FLOW_DETAILS}/5/${FlowDetailsTabs.LOGS}`);
    });

    it("should open the query explainer in a new tab for an upload token", () => {
        const windowOpenSpy = spyOn(window, "open");
        service.navigateToQueryExplainer("token-1");
        expect(windowOpenSpy).toHaveBeenCalledOnceWith(
            `/${ProjectLinks.URL_QUERY_EXPLAINER}?${ProjectLinks.URL_QUERY_PARAM_COMMITMENT_UPLOAD_TOKEN}=token-1`,
            "_blank",
        );
    });

    it("should not open the query explainer without an upload token", () => {
        const windowOpenSpy = spyOn(window, "open");
        service.navigateToQueryExplainer("");
        expect(windowOpenSpy).not.toHaveBeenCalled();
    });

    it("should merge the SQL query into the current query parameters", () => {
        const routerSpy = spyOn(router, "navigate").and.resolveTo(true);
        service.navigateWithSqlQuery("select 1");
        expect(routerSpy).toHaveBeenCalledOnceWith([], {
            queryParams: { [ProjectLinks.URL_QUERY_PARAM_SQL_QUERY]: "select 1" },
            queryParamsHandling: "merge",
        });
    });

    function navigatedUrl(routerSpy: jasmine.Spy<Router["navigateByUrl"]>): string {
        const [url] = routerSpy.calls.mostRecent().args;
        expect(url).toBeInstanceOf(UrlTree);
        return url instanceof UrlTree ? router.serializeUrl(url) : url;
    }
});
