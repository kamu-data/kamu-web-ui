import { MatChipsModule } from "@angular/material/chips";
import { DatasetInfo } from "../interface/navigation.interface";
import { AuthApi } from "../api/auth.api";
import { SearchApi } from "../api/search.api";
import { ComponentFixture, TestBed, fakeAsync, flush, tick } from "@angular/core/testing";
import { SearchComponent } from "./search.component";
import { NavigationService } from "../services/navigation.service";
import { SearchService } from "./search.service";
import { ApolloTestingModule } from "apollo-angular/testing";
import { ModalService } from "../components/modal/modal.service";
import { RouterTestingModule } from "@angular/router/testing";
import { mockSearchOverviewResponse } from "../api/mock/search.mock";
import { of } from "rxjs";
import { ActivatedRoute, NavigationEnd, Router } from "@angular/router";
import ProjectLinks from "../project-links";
import {
    activeRouteMock,
    activeRouteMockQueryParamMap,
    findElementByDataTestId,
    routerMock,
    routerMockEventSubject,
} from "../common/base-test.helpers.spec";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { DatasetListComponent } from "../components/dataset-list-component/dataset-list.component";
import { FormsModule } from "@angular/forms";
import { DatasetListItemComponent } from "../components/dataset-list-item/dataset-list-item.component";
import { NgbPaginationModule, NgbPopoverModule, NgbRatingModule } from "@ng-bootstrap/ng-bootstrap";
import { DisplayTimeModule } from "../components/display-time/display-time.module";
import { MatIconModule } from "@angular/material/icon";
import { PaginationComponent } from "../components/pagination-component/pagination.component";
import { MatDividerModule } from "@angular/material/divider";

describe("SearchComponent", () => {
    let component: SearchComponent;
    let fixture: ComponentFixture<SearchComponent>;
    let navigationService: NavigationService;
    let searchService: SearchService;
    let searchApi: SearchApi;

    const DEFAULT_SEARCH_QUERY = "defaultSearchQuery";
    const DEFAULT_SEARCH_PAGE = 3;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [SearchComponent, DatasetListComponent, DatasetListItemComponent, PaginationComponent],
            imports: [
                ApolloTestingModule,
                RouterTestingModule,
                MatCheckboxModule,
                FormsModule,
                NgbRatingModule,
                DisplayTimeModule,
                NgbPopoverModule,
                MatIconModule,
                MatChipsModule,
                NgbPaginationModule,
                MatDividerModule,
            ],
            providers: [
                NavigationService,
                SearchService,
                AuthApi,
                SearchApi,
                ModalService,
                { provide: Router, useValue: routerMock },
                { provide: ActivatedRoute, useValue: activeRouteMock },
            ],
        }).compileComponents();
    });

    function setSearchUrl(searchQuery?: string, page?: number): void {
        if (searchQuery) {
            activeRouteMockQueryParamMap.set(ProjectLinks.URL_QUERY_PARAM_QUERY, searchQuery);
        } else if (activeRouteMockQueryParamMap.has(ProjectLinks.URL_QUERY_PARAM_QUERY)) {
            activeRouteMockQueryParamMap.delete(ProjectLinks.URL_QUERY_PARAM_QUERY);
        }

        if (page) {
            activeRouteMockQueryParamMap.set(ProjectLinks.URL_QUERY_PARAM_PAGE, page.toString());
        } else if (activeRouteMockQueryParamMap.has(ProjectLinks.URL_QUERY_PARAM_PAGE)) {
            activeRouteMockQueryParamMap.delete(ProjectLinks.URL_QUERY_PARAM_PAGE);
        }
    }

    function pushNavigationEnd(): void {
        routerMockEventSubject.next(new NavigationEnd(1, ProjectLinks.URL_SEARCH, ""));
    }

    beforeEach(() => {
        activeRouteMockQueryParamMap.clear();
        setSearchUrl(DEFAULT_SEARCH_QUERY, DEFAULT_SEARCH_PAGE);

        fixture = TestBed.createComponent(SearchComponent);
        navigationService = TestBed.inject(NavigationService);
        searchService = TestBed.inject(SearchService);
        searchApi = TestBed.inject(SearchApi);
        component = fixture.componentInstance;
        component.ngOnInit();
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });

    it("should initially search query/page from active route", () => {
        expect(component.searchValue).toEqual(DEFAULT_SEARCH_QUERY);
        expect(component.currentPage).toEqual(DEFAULT_SEARCH_PAGE);
    });

    it("should pick default search query/page when arguments are not specified", () => {
        setSearchUrl();
        pushNavigationEnd();
        fixture.detectChanges();
        expect(component.searchValue).toEqual("");
        expect(component.currentPage).toEqual(1);

        const testQuery = "test";
        setSearchUrl(testQuery);
        pushNavigationEnd();
        fixture.detectChanges();
        expect(component.searchValue).toEqual(testQuery);
        expect(component.currentPage).toEqual(1);

        setSearchUrl(undefined, 4);
        pushNavigationEnd();
        fixture.detectChanges();
        expect(component.searchValue).toEqual("");
        expect(component.currentPage).toEqual(4);
    });

    it("should pick search query/page from url updates", () => {
        const testQuery = "test";
        const testPage = 2;
        setSearchUrl(testQuery, testPage);
        pushNavigationEnd();

        fixture.detectChanges();
        expect(component.searchValue).toEqual(testQuery);
        expect(component.currentPage).toEqual(testPage);
    });

    it("should call updateAllComplete method upon request", () => {
        component.updateAllComplete();
        expect(component.allComplete).toEqual(false);
    });

    it("should call navigateToDatasetView in navigation service on dataset selection", () => {
        const data: DatasetInfo = {
            accountName: "test",
            datasetName: "test datasetName",
        };
        const routerSpy = spyOn(navigationService, "navigateToDatasetView");
        component.onSelectDataset(data);
        expect(routerSpy).toHaveBeenCalledWith({
            accountName: data.accountName,
            datasetName: data.datasetName,
        });
    });

    it("should check onPageChange method with page", () => {
        const testSearchValue = "test";
        const testCurrentPage = 2;
        component.searchValue = testSearchValue;
        fixture.detectChanges();
        const navigationServiceSpy = spyOn(navigationService, "navigateToSearch");
        component.onPageChange(testCurrentPage);
        expect(component.currentPage).toBe(testCurrentPage);
        expect(navigationServiceSpy).toHaveBeenCalledWith(testSearchValue, testCurrentPage);
    });

    it("should check onPageChange method when page equal 0", () => {
        const testSearchValue = "test";
        component.searchValue = testSearchValue;
        fixture.detectChanges();
        const navigationServiceSpy = spyOn(navigationService, "navigateToSearch");
        component.onPageChange(0);
        expect(component.currentPage).toBe(1);
        expect(navigationServiceSpy).toHaveBeenCalledWith(testSearchValue);
    });

    it("should check search results update the dataset table", fakeAsync(() => {
        spyOn(searchApi, "overviewDatasetSearch").and.returnValue(of(mockSearchOverviewResponse));
        const testSearchQuery = "test";
        component.currentPage = 1;

        searchService.searchDatasets(testSearchQuery);
        tick();
        fixture.detectChanges();
        const datasetList = findElementByDataTestId(fixture, "dataset-list");
        const pagination = findElementByDataTestId(fixture, "pagination");
        expect(datasetList).toBeDefined();
        expect(pagination).toBeDefined();
        flush();
    }));
});
