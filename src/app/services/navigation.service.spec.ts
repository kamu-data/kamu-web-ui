import { routes } from "./../app-routing.module";
import { RouterTestingModule } from "@angular/router/testing";
import { TestBed } from "@angular/core/testing";
import { NavigationService } from "./navigation.service";
import ProjectLinks from "../project-links";
import { DatasetNavigationParams } from "../interface/navigation.interface";
import { Router } from "@angular/router";

describe("NavigationService", () => {
    let service: NavigationService;
    let router: Router;

    beforeAll(() => {
        window.onbeforeunload = () => null;
    });

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [RouterTestingModule.withRoutes(routes)],
        });
        service = TestBed.inject(NavigationService);
        router = TestBed.inject(Router);
    });

    it("should be created", () => {
        expect(service).toBeTruthy();
    });

    it("should test navigate to home", () => {
        const routerSpy = spyOn(router, "navigate").and.callThrough();
        service.navigateToHome();
        expect(routerSpy).toHaveBeenCalledWith([ProjectLinks.URL_HOME]);
    });

    it("should test navigate to login", () => {
        const routerSpy = spyOn(router, "navigate").and.resolveTo(true);
        service.navigateToLogin();
        expect(routerSpy).toHaveBeenCalledWith([ProjectLinks.URL_LOGIN]);
    });

    it("should test navigate to owner page", () => {
        const mockOwnerName = "Mock name";
        const routerSpy = spyOn(router, "navigate").and.callThrough();
        service.navigateToOwnerView(mockOwnerName);
        expect(routerSpy).toHaveBeenCalledWith([mockOwnerName]);
    });

    it("should test navigate to website", () => {
        const mockWebsite = "http://google.com";
        const windowMock = { document: {} } as Window;
        const windowSpy = spyOn(window, "open").and.returnValue(windowMock);
        service.navigateToWebsite(mockWebsite);
        expect(windowSpy).toHaveBeenCalledWith(mockWebsite, "_blank");
    });

    it("should test navigate to search", () => {
        const routerSpy = spyOn(router, "navigate").and.callThrough();
        service.navigateToSearch();
        expect(routerSpy).toHaveBeenCalledWith([ProjectLinks.URL_SEARCH], {
            queryParams: {},
        });
    });

    it("should test navigate to search with query", () => {
        const routerSpy = spyOn(router, "navigate").and.callThrough();
        const testQuery = "test query";
        service.navigateToSearch(testQuery);
        expect(routerSpy).toHaveBeenCalledWith([ProjectLinks.URL_SEARCH], {
            queryParams: { query: testQuery },
        });
    });

    it("should test navigate to search with page", () => {
        const routerSpy = spyOn(router, "navigate").and.callThrough();
        const testPage = 3;
        service.navigateToSearch(undefined /*query*/, testPage);
        expect(routerSpy).toHaveBeenCalledWith([ProjectLinks.URL_SEARCH], {
            queryParams: { page: testPage },
        });
    });

    it("should test navigate to search with query and page", () => {
        const routerSpy = spyOn(router, "navigate").and.callThrough();
        const testQuery = "test query";
        const testPage = 3;
        service.navigateToSearch(testQuery, testPage);
        expect(routerSpy).toHaveBeenCalledWith([ProjectLinks.URL_SEARCH], {
            queryParams: { query: testQuery, page: testPage },
        });
    });

    it("should test navigate to dataset create", () => {
        const routerSpy = spyOn(router, "navigate").and.callThrough();
        service.navigateToDatasetCreate();
        expect(routerSpy).toHaveBeenCalledWith([
            ProjectLinks.URL_DATASET_CREATE,
        ]);
    });

    it("should test navigate to dataset view to first page", () => {
        const mockParams: DatasetNavigationParams = {
            accountName: "mockAccountName",
            datasetName: "mockDatasetName",
            tab: "overview",
            page: 1,
        };
        const routerSpy = spyOn(router, "navigate").and.callThrough();
        service.navigateToDatasetView(mockParams);
        expect(routerSpy).toHaveBeenCalledWith(
            [mockParams.accountName, mockParams.datasetName],
            { queryParams: { tab: mockParams.tab } },
        );
    });

    it("should test navigate to dataset view to second page", () => {
        const mockParams: DatasetNavigationParams = {
            accountName: "mockAccountName",
            datasetName: "mockDatasetName",
            tab: "history",
            page: 2,
        };
        const routerSpy = spyOn(router, "navigate").and.callThrough();
        service.navigateToDatasetView(mockParams);
        expect(routerSpy).toHaveBeenCalledWith(
            [mockParams.accountName, mockParams.datasetName],
            { queryParams: { tab: mockParams.tab, page: mockParams.page } },
        );
    });

    it("should test navigate to page not found view", () => {
        const routerSpy = spyOn(router, "navigate").and.callThrough();
        service.navigateToPageNotFound();
        expect(routerSpy).toHaveBeenCalledWith(
            [ProjectLinks.URL_PAGE_NOT_FOUND],
            {
                skipLocationChange: true,
            },
        );
    });
});