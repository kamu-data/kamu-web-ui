/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { ComponentFixture, fakeAsync, flush, TestBed, tick } from "@angular/core/testing";

import { of } from "rxjs";

import { Apollo } from "apollo-angular";

import { mockSearchOverviewResponse } from "../api/mock/search.mock";
import { SearchApi } from "../api/search.api";
import { findElementByDataTestId } from "../common/helpers/base-test.helpers.spec";
import { SharedTestModule } from "../common/modules/shared-test.module";
import { NavigationService } from "../services/navigation.service";
import { mockDatasetSearchResult } from "./mock.data";
import { SearchComponent } from "./search.component";
import { SearchService } from "./search.service";

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
            imports: [SharedTestModule, SearchComponent],
            providers: [Apollo],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(SearchComponent);
        navigationService = TestBed.inject(NavigationService);
        searchService = TestBed.inject(SearchService);
        searchApi = TestBed.inject(SearchApi);
        component = fixture.componentInstance;
        component.data = mockDatasetSearchResult;
        component.ngOnInit();
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });

    it("should initially search query/page from active route", () => {
        component.search = DEFAULT_SEARCH_QUERY;
        component.page = DEFAULT_SEARCH_PAGE;

        expect(component.searchValue).toEqual(DEFAULT_SEARCH_QUERY);
        expect(component.currentPage).toEqual(DEFAULT_SEARCH_PAGE);
    });

    it("should call updateAllComplete method upon request", () => {
        component.updateAllComplete();
        expect(component.allComplete).toEqual(false);
    });

    it("should check onPageChange method with page", () => {
        const testSearchValue = "test";
        const testCurrentPage = 2;
        component.search = testSearchValue;
        fixture.detectChanges();
        const navigationServiceSpy = spyOn(navigationService, "navigateToSearch");
        component.onPageChange(testCurrentPage);
        expect(component.currentPage).toBe(testCurrentPage);
        expect(navigationServiceSpy).toHaveBeenCalledWith(testSearchValue, testCurrentPage);
    });

    it("should check onPageChange method when page equal 0", () => {
        const testSearchValue = "test";
        component.search = testSearchValue;
        fixture.detectChanges();
        const navigationServiceSpy = spyOn(navigationService, "navigateToSearch");
        component.onPageChange(1);
        expect(component.currentPage).toBe(1);
        expect(navigationServiceSpy).toHaveBeenCalledWith(testSearchValue);
    });

    it("should check search results update the dataset table", fakeAsync(() => {
        spyOn(searchApi, "overviewDatasetSearch").and.returnValue(of(mockSearchOverviewResponse));
        const testSearchQuery = "test";
        component.page = 1;

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
