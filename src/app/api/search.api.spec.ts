import { TestBed } from "@angular/core/testing";
import { SearchApi, SEARCH_RESULTS_PER_PAGE } from "./search.api";
import { ApolloTestingController, ApolloTestingModule } from "apollo-angular/testing";
import {
    SearchDatasetsAutocompleteDocument,
    SearchDatasetsOverviewDocument,
    SearchDatasetsOverviewQuery,
} from "./kamu.graphql.interface";
import { mockSearchOverviewResponse, mockAutoCompleteResponse } from "./mock/search.mock";
import { DatasetAutocompleteItem } from "../interface/search.interface";

describe("SearchApi", () => {
    let service: SearchApi;
    let controller: ApolloTestingController;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [SearchApi],
            imports: [ApolloTestingModule],
        });
        service = TestBed.inject(SearchApi);
        controller = TestBed.inject(ApolloTestingController);
    });

    afterEach(() => {
        controller.verify();
    });

    it("should be created", () => {
        expect(service).toBeTruthy();
    });

    it("should check dataset autocomplete", () => {
        const TEST_QUERY = "a";
        service.autocompleteDatasetSearch(TEST_QUERY).subscribe((res: DatasetAutocompleteItem[]) => {
            expect(res.length).toEqual(mockAutoCompleteResponse.search.query.nodes.length + 1 /* dummy result */);
        });

        const op = controller.expectOne(SearchDatasetsAutocompleteDocument);
        expect(op.operation.variables.query).toEqual(TEST_QUERY);
        expect(op.operation.variables.perPage).toEqual(SEARCH_RESULTS_PER_PAGE);

        op.flush({
            data: mockAutoCompleteResponse,
        });
    });

    it("should check dataset autocomplete with empty query", () => {
        service.autocompleteDatasetSearch("").subscribe((res: DatasetAutocompleteItem[]) => {
            expect(res).toEqual([]);
        });
    });

    it("should check dataset search with empty query", () => {
        const EMPTY_QUERY = "";
        service.overviewDatasetSearch(EMPTY_QUERY).subscribe((res: SearchDatasetsOverviewQuery) => {
            expect(res.search.query.totalCount).toEqual(13);
        });

        const op = controller.expectOne(SearchDatasetsOverviewDocument);
        expect(op.operation.variables.query).toEqual(EMPTY_QUERY);
        expect(op.operation.variables.perPage).toEqual(SEARCH_RESULTS_PER_PAGE);

        op.flush({
            data: mockSearchOverviewResponse,
        });
    });
});
