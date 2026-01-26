/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { ComponentFixture, fakeAsync, flush, TestBed, tick } from "@angular/core/testing";
import { SearchAndSchemasSectionComponent } from "./search-and-schemas-section.component";
import { SharedTestModule } from "src/app/common/modules/shared-test.module";
import { Apollo } from "apollo-angular";
import { NgbTypeaheadSelectItemEvent } from "@ng-bootstrap/ng-bootstrap";
import { SqlQueryService } from "src/app/services/sql-query.service";
import { mockDatasetBasicsDerivedFragment, mockSqlQueryResponseState } from "src/app/search/mock.data";
import { DatasetService } from "src/app/dataset-view/dataset.service";
import { of } from "rxjs";
import { mockGetDatasetSchemaQuery } from "src/app/dataset-view/additional-components/metadata-component/components/set-transform/mock.data";
import AppValues from "src/app/common/values/app.values";
import { dispatchInputEvent, emitClickOnElementByDataTestId } from "src/app/common/helpers/base-test.helpers.spec";
import { DatasetAutocompleteItem, TypeNames } from "src/app/interface/search.interface";
import { SearchApi } from "src/app/api/search.api";
import { provideHttpClient, withInterceptorsFromDi } from "@angular/common/http";
import { provideToastr } from "ngx-toastr";

describe("SearchAndSchemasSectionComponent", () => {
    let component: SearchAndSchemasSectionComponent;
    let fixture: ComponentFixture<SearchAndSchemasSectionComponent>;
    let sqlQueryService: SqlQueryService;
    let datasetService: DatasetService;
    let searchApi: SearchApi;
    let requestDatasetSchemaSpy: jasmine.Spy;

    beforeEach(() => {
        TestBed.configureTestingModule({
    imports: [SharedTestModule, SearchAndSchemasSectionComponent],
    providers: [Apollo, provideToastr(), provideHttpClient(withInterceptorsFromDi())]
});
        fixture = TestBed.createComponent(SearchAndSchemasSectionComponent);
        component = fixture.componentInstance;
        sqlQueryService = TestBed.inject(SqlQueryService);
        datasetService = TestBed.inject(DatasetService);
        searchApi = TestBed.inject(SearchApi);
        sqlQueryService.emitSqlQueryResponseChanged(mockSqlQueryResponseState);
        requestDatasetSchemaSpy = spyOn(datasetService, "requestDatasetSchema").and.returnValue(
            of(mockGetDatasetSchemaQuery),
        );
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });

    it("should check remove dataset schema", () => {
        component.inputDatasets.add("dataset1");
        component.inputDatasets.add("dataset2");
        fixture.detectChanges();
        component.searchResult = [
            { datasetAlias: "dataset1", schema: null },
            { datasetAlias: "dataset2", schema: null },
        ];

        component.removeDataset("dataset2");
        expect(component.searchResult.length).toEqual(1);
        expect(component.searchResult).toEqual([{ datasetAlias: "dataset1", schema: null }]);
    });

    it("should activate search API and update view", fakeAsync(() => {
        fixture.detectChanges();
        const MOCK_AUTOCOMPLETE_ITEM: DatasetAutocompleteItem = {
            __typename: TypeNames.datasetType,
            dummy: false,
            dataset: mockDatasetBasicsDerivedFragment,
        };
        const searchApiAutocompleteDatasetSearchSpy = spyOn(searchApi, "autocompleteDatasetSearch").and.callFake(() =>
            of([MOCK_AUTOCOMPLETE_ITEM]),
        );

        const SEARCH_DATASET = "mockDatasetName";
        dispatchInputEvent(fixture, "global-query-search-dataset", SEARCH_DATASET);
        tick(AppValues.SHORT_DELAY_MS);

        expect(searchApiAutocompleteDatasetSearchSpy).toHaveBeenCalledWith(SEARCH_DATASET);
        flush();
    }));

    it("should clear search input", () => {
        fixture.detectChanges();
        const SEARCH_DATASET = "mockDatasetName";
        dispatchInputEvent(fixture, "global-query-search-dataset", SEARCH_DATASET);
        expect(component.searchDataset).toEqual(SEARCH_DATASET);

        emitClickOnElementByDataTestId(fixture, "clear-input");

        expect(component.searchDataset).toEqual("");
    });

    it("should check select input dataset", () => {
        const mockNgbTypeaheadSelectItemEvent = {
            item: {
                dataset: mockDatasetBasicsDerivedFragment,
                __typename: TypeNames.datasetType,
            },
        } as NgbTypeaheadSelectItemEvent;

        component.onSelectItem(mockNgbTypeaheadSelectItemEvent);

        expect(component.inputDatasets.size).toBe(1);
        expect(requestDatasetSchemaSpy).toHaveBeenCalledTimes(1);
    });

    it("should check sorterd dataset list", () => {
        fixture.detectChanges();
        component.searchResult = [
            { datasetAlias: "dataset1", schema: null },
            { datasetAlias: "dataset2", schema: null },
        ];
        expect(component.sortedSearchResult[0].datasetAlias).toEqual("dataset1");
        expect(component.sortedSearchResult[1].datasetAlias).toEqual("dataset2");
    });
});
