/* eslint-disable @typescript-eslint/dot-notation */
import { Apollo } from "apollo-angular";
import { SearchApi } from "./../api/search.api";
import { TestBed } from "@angular/core/testing";
import { AppSearchService } from "./search.service";
import {
    DatasetAutocompleteItem,
    DatasetSearchResult,
} from "../interface/search.interface";
import { mockDataDataset } from "./mock.data";
import { of, throwError } from "rxjs";

describe("SerchService", () => {
    let service: AppSearchService;
    let searchApi: SearchApi;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [SearchApi, Apollo],
        });
        service = TestBed.inject(AppSearchService);
        searchApi = TestBed.inject(SearchApi);
    });

    it("should be created", async () => {
        await expect(service).toBeTruthy();
    });

    it("should be check get onAutocompleteSearchChanges", async () => {
        const result = service.onAutocompleteSearchChanges;
        await expect(result).toBeDefined();
    });

    it("should be call inputQueryChanges$ ", async () => {
        const searchValue = "test";
        const inputQueryChangesSpy = spyOn(
            service["inputQueryChanges$"],
            "next",
        );
        service.searchQueryChanges(searchValue);
        await expect(inputQueryChangesSpy).toHaveBeenCalled();
    });

    it("should be call overviewSearchChanges$ ", async () => {
        const mockSearchData: DatasetSearchResult = {
            datasets: [],
            totalCount: 10,
            pageInfo: {
                currentPage: 1,
                hasNextPage: true,
                hasPreviousPage: false,
            },
            currentPage: 1,
        };
        const overviewSearchChangesSpy = spyOn(
            service["overviewSearchChanges$"],
            "next",
        );
        service.overviewSearchChanges(mockSearchData);
        await expect(overviewSearchChangesSpy).toHaveBeenCalled();
    });

    it("should be call autocompleteSearchChanges$ ", async () => {
        const mockSearchData: DatasetAutocompleteItem[] = [];
        const autocompleteSearchChangesSpy = spyOn(
            service["autocompleteSearchChanges$"],
            "next",
        );
        service.autocompleteSearchChanges(mockSearchData);
        await expect(autocompleteSearchChangesSpy).toHaveBeenCalled();
    });

    it("should be call autocompleteSearchChanges with data", () => {
        const mockSearchQuery = "Test string";
        const autocompleteSearchChangesSpy = spyOn(
            service,
            "autocompleteSearchChanges",
        ).and.callThrough();
        spyOn(searchApi, "autocompleteDatasetSearch").and.returnValue(
            of(mockDataDataset),
        );
        service.autocompleteDatasetSearch(mockSearchQuery);
        searchApi
            .autocompleteDatasetSearch(mockSearchQuery)
            .subscribe((data: DatasetAutocompleteItem[]) => {
                void expect(data).toEqual(mockDataDataset);
                expect(autocompleteSearchChangesSpy).toHaveBeenCalledWith(data);
            });
    });

    it("should be call autocompleteSearchChanges with empty array", () => {
        const mockSearchQuery = "Test string";
        const autocompleteSearchChangesSpy = spyOn(
            service,
            "autocompleteSearchChanges",
        ).and.callThrough();
        spyOn(searchApi, "autocompleteDatasetSearch").and.returnValue(
            throwError("error"),
        );
        service.autocompleteDatasetSearch(mockSearchQuery);
        searchApi
            .autocompleteDatasetSearch(mockSearchQuery)
            .subscribe(undefined, () => {
                expect(autocompleteSearchChangesSpy).toHaveBeenCalledWith([]);
            });
    });
});
