import { AccountSettingsTabs } from "../auth/settings/account-settings.constants";
import { AccountTabs } from "../auth/account/account.constants";
import { RouterTestingModule } from "@angular/router/testing";
import { TestBed } from "@angular/core/testing";
import { NavigationService } from "./navigation.service";
import ProjectLinks from "../project-links";
import { DatasetNavigationParams, MetadataBlockNavigationParams } from "../interface/navigation.interface";
import { Router } from "@angular/router";

describe("NavigationService", () => {
    let service: NavigationService;
    let router: Router;

    beforeAll(() => {
        window.onbeforeunload = () => null;
    });

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [RouterTestingModule],
        });
        service = TestBed.inject(NavigationService);
        router = TestBed.inject(Router);
    });

    it("should be created", () => {
        expect(service).toBeTruthy();
    });

    it("should test navigate to home", () => {
        const routerSpy = spyOn(router, "navigate").and.resolveTo(true);
        service.navigateToHome();
        expect(routerSpy).toHaveBeenCalledWith([ProjectLinks.URL_HOME]);
    });

    it("should test navigate to login", () => {
        const routerSpy = spyOn(router, "navigate").and.resolveTo(true);
        service.navigateToLogin();
        expect(routerSpy).toHaveBeenCalledWith([ProjectLinks.URL_LOGIN]);
    });

    it("should test navigate to settings", () => {
        const routerSpy = spyOn(router, "navigate").and.resolveTo(true);
        service.navigateToSettings();
        expect(routerSpy).toHaveBeenCalledWith([ProjectLinks.URL_SETTINGS, AccountSettingsTabs.PROFILE]);
    });

    it("should test navigate to metadata block", () => {
        const mockParams: MetadataBlockNavigationParams = {
            accountName: "kamu",
            datasetName: "test.hm",
            blockHash: "kkdcswd6782819e12",
        };
        const routerSpy = spyOn(router, "navigate").and.resolveTo(true);
        service.navigateToMetadataBlock({
            accountName: mockParams.accountName,
            datasetName: mockParams.datasetName,
            blockHash: mockParams.blockHash,
        });
        expect(routerSpy).toHaveBeenCalledWith([
            mockParams.accountName,
            mockParams.datasetName,
            ProjectLinks.URL_BLOCK,
            mockParams.blockHash,
        ]);
    });

    it("should test navigate to owner page and tab equal overview", () => {
        const mockOwnerName = "Mock name";
        const routerSpy = spyOn(router, "navigate").and.resolveTo(true);
        service.navigateToOwnerView(mockOwnerName, AccountTabs.OVERVIEW);
        expect(routerSpy).toHaveBeenCalledWith([mockOwnerName], {
            queryParams: {},
        });
    });

    it("should test navigate to owner page and tab not equal overview", () => {
        const mockOwnerName = "Mock name";
        const testPage = 2;
        const routerSpy = spyOn(router, "navigate").and.resolveTo(true);
        service.navigateToOwnerView(mockOwnerName, AccountTabs.DATASETS, testPage);
        expect(routerSpy).toHaveBeenCalledWith([mockOwnerName], {
            queryParams: { tab: AccountTabs.DATASETS, page: testPage },
        });
    });

    it("should test navigate to website", () => {
        const mockWebsite = "http://google.com";
        const windowMock = { document: {} } as Window;
        const windowSpy = spyOn(window, "open").and.returnValue(windowMock);
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

    it("should test navigate to dataset create", () => {
        const routerSpy = spyOn(router, "navigate").and.resolveTo(true);
        service.navigateToDatasetCreate();
        expect(routerSpy).toHaveBeenCalledWith([ProjectLinks.URL_DATASET_CREATE]);
    });

    it("should test navigate to dataset view to first page", () => {
        const mockParams: DatasetNavigationParams = {
            accountName: "mockAccountName",
            datasetName: "mockDatasetName",
            tab: "overview",
            page: 1,
        };
        const routerSpy = spyOn(router, "navigate").and.resolveTo(true);
        service.navigateToDatasetView(mockParams);
        expect(routerSpy).toHaveBeenCalledWith([mockParams.accountName, mockParams.datasetName], {
            queryParams: { tab: mockParams.tab },
            state: undefined,
        });
    });

    it("should test navigate to dataset view to second page", () => {
        const mockParams: DatasetNavigationParams = {
            accountName: "mockAccountName",
            datasetName: "mockDatasetName",
            tab: "history",
            page: 2,
        };
        const routerSpy = spyOn(router, "navigate").and.resolveTo(true);
        service.navigateToDatasetView(mockParams);
        expect(routerSpy).toHaveBeenCalledWith([mockParams.accountName, mockParams.datasetName], {
            queryParams: { tab: mockParams.tab, page: mockParams.page, section: undefined },
            state: undefined,
        });
    });

    it("should test navigate to page not found view", () => {
        const routerSpy = spyOn(router, "navigate").and.resolveTo(true);
        service.navigateToPageNotFound();
        expect(routerSpy).toHaveBeenCalledWith([ProjectLinks.URL_PAGE_NOT_FOUND], {
            skipLocationChange: true,
        });
    });

    it("should test navigate to return to CLI view", () => {
        const routerSpy = spyOn(router, "navigate").and.resolveTo(true);
        service.navigateToReturnToCli();
        expect(routerSpy).toHaveBeenCalledWith([ProjectLinks.URL_RETURN_TO_CLI], {
            skipLocationChange: true,
        });
    });
});
