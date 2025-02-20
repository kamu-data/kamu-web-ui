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
                RouterModule,
                DatasetVisibilityModule,
            ],
            providers: [NavigationService, SearchService, AuthApi, SearchApi, ModalService],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(SearchComponent);
        navigationService = TestBed.inject(NavigationService);
        searchService = TestBed.inject(SearchService);
        component = fixture.componentInstance;
        component.page = DEFAULT_SEARCH_PAGE;
        component.searchValue = DEFAULT_SEARCH_QUERY;
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });

    it("should initially search query/page from active route", () => {
        const searchDatasetsSpy = spyOn(searchService, "searchDatasets").and.callThrough();
        fixture.detectChanges();
        expect(component.currentPage).toEqual(DEFAULT_SEARCH_PAGE);
        expect(searchDatasetsSpy).toHaveBeenCalledTimes(1);
    });

    it("should call updateAllComplete method upon request", () => {
        component.updateAllComplete();
        expect(component.allComplete).toEqual(false);
    });

    it("should check onPageChange method with page", () => {
        const testSearchValue = "test";
        const testCurrentPage = 2;
        component.searchValue = testSearchValue;
        fixture.detectChanges();
        const navigationServiceSpy = spyOn(navigationService, "navigateToSearch");
        component.onPageChange(testCurrentPage);
        expect(navigationServiceSpy).toHaveBeenCalledWith(testSearchValue, testCurrentPage);
    });

    it("should check onPageChange method when page number equal 1", () => {
        const testSearchValue = "test";
        component.searchValue = testSearchValue;
        fixture.detectChanges();
        const navigationServiceSpy = spyOn(navigationService, "navigateToSearch");
        component.onPageChange(1);
        expect(navigationServiceSpy).toHaveBeenCalledWith(testSearchValue);
    });

    it("should check search results update the dataset table", fakeAsync(() => {
        component.tableData$ = of(mockDatasetSearchResult);

        tick();
        fixture.detectChanges();

        const datasetList = findElementByDataTestId(fixture, "dataset-list");
        const pagination = findElementByDataTestId(fixture, "pagination");
        expect(datasetList).toBeDefined();
        expect(pagination).toBeDefined();

        flush();
    }));
});
