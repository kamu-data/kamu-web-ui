/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { MatChipsModule } from "@angular/material/chips";
import { AuthApi } from "../api/auth.api";
import { SearchApi } from "../api/search.api";
import { ComponentFixture, TestBed, fakeAsync, flush, tick } from "@angular/core/testing";
import { SearchComponent } from "./search.component";
import { NavigationService } from "../services/navigation.service";
import { SearchService } from "./search.service";
import { ApolloTestingModule } from "apollo-angular/testing";
import { ModalService } from "../common/components/modal/modal.service";
import { RouterTestingModule } from "@angular/router/testing";
import { mockSearchOverviewResponse } from "../api/mock/search.mock";
import { of } from "rxjs";
import { RouterModule } from "@angular/router";
import { findElementByDataTestId } from "../common/helpers/base-test.helpers.spec";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { DatasetListComponent } from "../common/components/dataset-list-component/dataset-list.component";
import { FormsModule } from "@angular/forms";
import { DatasetListItemComponent } from "../common/components/dataset-list-component/dataset-list-item/dataset-list-item.component";
import { NgbPaginationModule, NgbPopoverModule, NgbRatingModule } from "@ng-bootstrap/ng-bootstrap";
import { DisplayTimeModule } from "../common/components/display-time/display-time.module";
import { MatIconModule } from "@angular/material/icon";
import { PaginationComponent } from "../common/components/pagination-component/pagination.component";
import { MatDividerModule } from "@angular/material/divider";
import { DatasetVisibilityModule } from "../common/components/dataset-visibility/dataset-visibility.module";
import { mockDatasetSearchResult } from "./mock.data";

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
        RouterModule,
        DatasetVisibilityModule,
        SearchComponent, DatasetListComponent, DatasetListItemComponent, PaginationComponent,
    ],
    providers: [NavigationService, SearchService, AuthApi, SearchApi, ModalService],
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
