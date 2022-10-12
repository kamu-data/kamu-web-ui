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

    it("should be created", async () => {
        await expect(service).toBeTruthy();
    });

    it("should be test navigate to home", () => {
        const routerSpy = spyOn(router, "navigate").and.callThrough();
        service.navigateToHome();
        expect(routerSpy).toHaveBeenCalledWith([ProjectLinks.urlHome]);
    });

    it("should be test navigate to login", () => {
        const routerSpy = spyOn(router, "navigate").and.returnValue(
            Promise.resolve(true),
        );
        service.navigateToLogin();
        expect(routerSpy).toHaveBeenCalledWith([ProjectLinks.urlLogin]);
    });

    it("should be test navigate to owner page", () => {
        const mockOwnerName = "Mock name";
        const routerSpy = spyOn(router, "navigate").and.callThrough();
        service.navigateToOwnerView(mockOwnerName);
        expect(routerSpy).toHaveBeenCalledWith([mockOwnerName]);
    });

    it("should be test navigate to website", async () => {
        const mockWebsite = "http://google.com";
        const windowMock = { document: {} } as Window;
        const windowSpy = spyOn(window, "open").and.returnValue(windowMock);
        service.navigateToWebsite(mockWebsite);
        await expect(windowSpy).toHaveBeenCalled();
    });

    it("should be test navigate to search", async () => {
        const routerSpy = spyOn(router, "navigate").and.callThrough();
        service.navigateToSearch();
        await expect(routerSpy).toHaveBeenCalled();
    });

    it("should be test navigate to search with query", async () => {
        const routerSpy = spyOn(router, "navigate").and.callThrough();
        service.navigateToSearch("test query");
        await expect(routerSpy).toHaveBeenCalled();
    });

    it("should be test navigate to dataset create", () => {
        const routerSpy = spyOn(router, "navigate").and.callThrough();
        service.navigateToDatasetCreate();
        expect(routerSpy).toHaveBeenCalledWith([ProjectLinks.urlDatasetCreate]);
    });

    it("should be test navigate to dataset view", async () => {
        const mockParams: DatasetNavigationParams = {
            accountName: "mockAccountName",
            datasetName: "mockDatasetName",
            tab: "overview",
            page: 1,
        };
        const routerSpy = spyOn(router, "navigate").and.callThrough();
        service.navigateToDatasetView(mockParams);
        await expect(routerSpy).toHaveBeenCalled();
    });

    it("should be test navigate to page not found view", () => {
        const routerSpy = spyOn(router, "navigate").and.callThrough();
        service.navigateToPageNotFound();
        expect(routerSpy).toHaveBeenCalledWith([ProjectLinks.urlPageNotFound], {
            skipLocationChange: true,
        });
    });
});
