import { Apollo } from "apollo-angular";
import { SearchApi } from "./../api/search.api";
import { TestBed } from "@angular/core/testing";
import { SearchService } from "./search.service";
import {
    DatasetAutocompleteItem,
    DatasetSearchResult,
} from "../interface/search.interface";
import {
    mockAutocompleteItems,
    mockSearchDatasetOverviewQuery,
} from "./mock.data";
import { of, throwError } from "rxjs";

describe("SearchService", () => {
    let service: SearchService;
    let searchApi: SearchApi;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [SearchApi, Apollo],
        });
        service = TestBed.inject(SearchService);
        searchApi = TestBed.inject(SearchApi);
    });

    it("should be created", async () => {
        await expect(service).toBeTruthy();
    });

    it("should fire overviewSearchChanges$ on search request", async () => {
        const searchApiOverviewDataSearchSpy = spyOn(
            searchApi,
            "overviewDatasetSearch",
        ).and.returnValue(of(mockSearchDatasetOverviewQuery));

        let notificationReceived = false;
        service.onOverviewSearchChanges.subscribe(
            (searchResult: DatasetSearchResult) => {
                notificationReceived = true;

                const expectedSearchData: DatasetSearchResult = {
                    datasets: [
                        mockSearchDatasetOverviewQuery.search.query.nodes[0],
                    ],
                    totalCount: 1,
                    pageInfo:
                        mockSearchDatasetOverviewQuery.search.query.pageInfo,
                    currentPage: 1,
                };
                void expect(searchResult).toEqual(expectedSearchData);
            },
        );

        const testSearchValue = "test";
        service.searchDatasets(testSearchValue);

        expect(searchApiOverviewDataSearchSpy).toHaveBeenCalledWith(
            testSearchValue,
            0,
        );
        await expect(notificationReceived).toBeTruthy();
    });

    it("should fire autocompleteSearchChanges$ on autocomplete request", async () => {
        const searchApiAutocompleteDatasetSearchSpy = spyOn(
            searchApi,
            "autocompleteDatasetSearch",
        ).and.returnValue(of(mockAutocompleteItems));

        let notificationReceived = false;

        service.onAutocompleteSearchChanges.subscribe(
            (autocompleteItems: DatasetAutocompleteItem[]) => {
                notificationReceived = true;
                void expect(autocompleteItems).toEqual(mockAutocompleteItems);
            },
        );

        const testAutoCompleteValue = "test";
        service.autocompleteDatasetSearch(testAutoCompleteValue);

        expect(searchApiAutocompleteDatasetSearchSpy).toHaveBeenCalledWith(
            testAutoCompleteValue,
        );
        await expect(notificationReceived).toBeTruthy();
    });

    it("should fire autocompleteSearchChanges$ with empty collection on autocomplete request failure", async () => {
        const searchApiAutocompleteDatasetSearchSpy = spyOn(
            searchApi,
            "autocompleteDatasetSearch",
        ).and.returnValue(throwError("some error"));

        let notificationReceived = false;

        service.onAutocompleteSearchChanges.subscribe(
            (autocompleteItems: DatasetAutocompleteItem[]) => {
                notificationReceived = true;
                void expect(autocompleteItems).toEqual([]);
            },
        );

        const testAutoCompleteValue = "test";
        service.autocompleteDatasetSearch(testAutoCompleteValue);

        expect(searchApiAutocompleteDatasetSearchSpy).toHaveBeenCalledWith(
            testAutoCompleteValue,
        );
        await expect(notificationReceived).toBeTruthy();
    });
});
