import { TestBed } from "@angular/core/testing";
import { SearchApi } from "./search.api";
import {
    ApolloTestingController,
    ApolloTestingModule,
} from "apollo-angular/testing";
import {
    SearchDatasetsAutocompleteDocument,
    SearchDatasetsOverviewDocument,
} from "./kamu.graphql.interface";
import {
    mockSearchOverviewResponse,
    mockSearchResponse,
    searchResult,
} from "./search.mock";

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

    it("should be created", async () => {
        await expect(service).toBeTruthy();
    });

    it("should be call autocomplete with search query", async () => {
        service.autocompleteDatasetSearch("a").subscribe((res) => {
            void expect(res[0].__typename).toEqual(searchResult[0].__typename);
            void expect(res.length).toEqual(11);
        });

        const op = controller.expectOne(SearchDatasetsAutocompleteDocument);
        await expect(op.operation.variables.query).toEqual("a");
        await expect(op.operation.variables.perPage).toEqual(10);

        op.flush({
            data: mockSearchResponse,
        });
    });

    it("should check autocomplete without search query", () => {
        service.autocompleteDatasetSearch("").subscribe((res) => {
            void expect(res).toEqual([]);
        });
    });

    it("should be call autocomplete with search query", async () => {
        service.overviewDatasetSearch("").subscribe((res) => {
            void expect(res.search.query.totalCount).toEqual(13);
        });

        const op = controller.expectOne(SearchDatasetsOverviewDocument);
        await expect(op.operation.variables.query).toEqual("");
        await expect(op.operation.variables.perPage).toEqual(10);

        op.flush({
            data: mockSearchOverviewResponse,
        });
    });
});
