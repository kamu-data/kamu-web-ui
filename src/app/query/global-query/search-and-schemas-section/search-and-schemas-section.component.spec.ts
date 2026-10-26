/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { provideHttpClient } from "@angular/common/http";
import { ComponentFixture, fakeAsync, flush, TestBed, tick } from "@angular/core/testing";

import { of, throwError } from "rxjs";

import { NgbTypeaheadSelectItemEvent } from "@ng-bootstrap/ng-bootstrap";
import { Apollo } from "apollo-angular";
import { provideToastr } from "ngx-toastr";
import type { Mock } from "vitest";

import {
    dispatchInputEvent,
    emitClickOnElementByDataTestId,
    findAllElementsByDataTestId,
} from "@common/helpers/base-test.helpers.spec";
import { SharedTestModule } from "@common/modules/shared-test.module";
import AppValues from "@common/values/app.values";
import { SearchApi } from "@api/search.api";
import { DatasetAutocompleteItem, TypeNames } from "@interface/search.interface";

import { mockGetDatasetSchemaQuery } from "src/app/dataset-view/additional-components/metadata-component/components/set-transform/mock.data";
import { DatasetService } from "src/app/dataset-view/dataset.service";
import { SearchAndSchemasSectionComponent } from "src/app/query/global-query/search-and-schemas-section/search-and-schemas-section.component";
import { mockDatasetBasicsDerivedFragment, mockSqlQueryResponseState } from "src/app/search/mock.data";
import { SqlQueryService } from "src/app/services/sql-query.service";

describe("SearchAndSchemasSectionComponent", () => {
    let component: SearchAndSchemasSectionComponent;
    let fixture: ComponentFixture<SearchAndSchemasSectionComponent>;
    let sqlQueryService: SqlQueryService;
    let datasetService: DatasetService;
    let searchApi: SearchApi;
    let requestDatasetSchemaSpy: Mock;

    const selectDatasetEvent: NgbTypeaheadSelectItemEvent<DatasetAutocompleteItem> = {
        item: { dataset: mockDatasetBasicsDerivedFragment, dummy: false, __typename: TypeNames.datasetType },
        preventDefault: () => undefined,
    };

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [SharedTestModule, SearchAndSchemasSectionComponent],
            providers: [Apollo, provideToastr(), provideHttpClient()],
        });
        fixture = TestBed.createComponent(SearchAndSchemasSectionComponent);
        component = fixture.componentInstance;
        sqlQueryService = TestBed.inject(SqlQueryService);
        datasetService = TestBed.inject(DatasetService);
        searchApi = TestBed.inject(SearchApi);
        sqlQueryService.emitSqlQueryResponseChanged(mockSqlQueryResponseState);
        requestDatasetSchemaSpy = vi
            .spyOn(datasetService, "requestDatasetSchema")
            .mockReturnValue(of(mockGetDatasetSchemaQuery));
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
        expect([...component.inputDatasets]).toEqual(["dataset1"]);
    });

    it("should check a removed dataset can be picked again", () => {
        component.onSelectItem(selectDatasetEvent);

        component.removeDataset(mockDatasetBasicsDerivedFragment.alias);
        component.onSelectItem(selectDatasetEvent);

        expect(requestDatasetSchemaSpy).toHaveBeenCalledTimes(2);
    });

    it("should activate search API and update view", fakeAsync(() => {
        fixture.detectChanges();
        const MOCK_AUTOCOMPLETE_ITEM: DatasetAutocompleteItem = {
            __typename: TypeNames.datasetType,
            dummy: false,
            dataset: mockDatasetBasicsDerivedFragment,
        };
        const searchApiAutocompleteDatasetSearchSpy = vi
            .spyOn(searchApi, "autocompleteDatasetSearch")
            .mockImplementation(() => of([MOCK_AUTOCOMPLETE_ITEM]));

        const SEARCH_DATASET = "mockDatasetName";
        dispatchInputEvent(fixture, "global-query-search-dataset", SEARCH_DATASET);
        tick(AppValues.SHORT_DELAY_MS);

        expect(searchApiAutocompleteDatasetSearchSpy).toHaveBeenCalledWith(SEARCH_DATASET);
        flush();
    }));

    it("should clear search input", async () => {
        fixture.detectChanges();
        // ngModel writes its initial value in a microtask, which would otherwise clear the typed text
        await fixture.whenStable();
        const SEARCH_DATASET = "mockDatasetName";
        dispatchInputEvent(fixture, "global-query-search-dataset", SEARCH_DATASET);
        expect(component.searchDataset).toEqual(SEARCH_DATASET);

        emitClickOnElementByDataTestId(fixture, "clear-input");

        expect(component.searchDataset).toEqual("");
    });

    it("should check select input dataset", () => {
        component.onSelectItem(selectDatasetEvent);

        expect(component.inputDatasets.size).toBe(1);
        expect(requestDatasetSchemaSpy).toHaveBeenCalledTimes(1);
    });

    it("should check sorterd dataset list", () => {
        fixture.detectChanges();
        component.searchResult = [
            { datasetAlias: "dataset2", schema: null },
            { datasetAlias: "dataset1", schema: null },
        ];
        expect(component.sortedSearchResult.map((item) => item.datasetAlias)).toEqual(["dataset1", "dataset2"]);
        expect(component.searchResult.map((item) => item.datasetAlias)).toEqual(["dataset2", "dataset1"]);
    });

    it("should check running the query again keeps the schema panels", () => {
        fixture.detectChanges();
        const panelsBefore = findAllElementsByDataTestId(fixture, "schema-panel", HTMLElement);
        expect(panelsBefore.length).toBeGreaterThan(0);

        sqlQueryService.emitSqlQueryResponseChanged(mockSqlQueryResponseState);
        fixture.detectChanges();

        const panelsAfter = findAllElementsByDataTestId(fixture, "schema-panel", HTMLElement);
        expect(panelsAfter).toEqual(panelsBefore);
    });

    it("should show schemas of the next query after a schema request fails", () => {
        requestDatasetSchemaSpy.mockReturnValue(throwError(() => new Error("request failed")));
        fixture.detectChanges();
        expect(component.searchResult).toEqual([]);

        requestDatasetSchemaSpy.mockReturnValue(of(mockGetDatasetSchemaQuery));
        sqlQueryService.emitSqlQueryResponseChanged(mockSqlQueryResponseState);
        fixture.detectChanges();

        expect(component.searchResult.length).toBeGreaterThan(0);
    });

    it("should check picking a dataset that is already shown keeps one schema panel for it", () => {
        fixture.detectChanges();
        const panelCount = findAllElementsByDataTestId(fixture, "schema-panel", HTMLElement).length;

        component.onSelectItem(selectDatasetEvent);
        fixture.detectChanges();

        expect(findAllElementsByDataTestId(fixture, "schema-panel", HTMLElement).length).toEqual(panelCount);
    });
});
