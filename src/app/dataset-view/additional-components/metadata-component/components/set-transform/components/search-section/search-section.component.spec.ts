/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { ComponentFixture, TestBed, fakeAsync, flush, tick } from "@angular/core/testing";
import { SearchSectionComponent } from "./search-section.component";
import { Apollo } from "apollo-angular";
import { MatTreeNestedDataSource } from "@angular/material/tree";
import { NgbTypeaheadSelectItemEvent } from "@ng-bootstrap/ng-bootstrap";
import { of } from "rxjs";
import AppValues from "src/app/common/values/app.values";
import { dispatchInputEvent, emitClickOnElementByDataTestId } from "src/app/common/helpers/base-test.helpers.spec";
import { DatasetAutocompleteItem, TypeNames } from "src/app/interface/search.interface";
import { mockDatasetBasicsDerivedFragment, mockDatasetInfo } from "src/app/search/mock.data";
import { SearchApi } from "src/app/api/search.api";
import { DatasetService } from "src/app/dataset-view/dataset.service";
import { mockGetDatasetSchemaQuery } from "../../mock.data";
import { DatasetNode } from "../../set-transform.types";
import { SharedTestModule } from "src/app/common/modules/shared-test.module";

describe("SearchSectionComponent", () => {
    let component: SearchSectionComponent;
    let fixture: ComponentFixture<SearchSectionComponent>;
    let searchApi: SearchApi;
    let datasetService: DatasetService;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            providers: [Apollo],
            imports: [SharedTestModule, SearchSectionComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(SearchSectionComponent);
        component = fixture.componentInstance;
        component.inputDatasets = new Set<string>();
        component.TREE_DATA = [];
        component.dataSource = new MatTreeNestedDataSource<DatasetNode>();
        component.datasetInfo = mockDatasetInfo;
        searchApi = TestBed.inject(SearchApi);
        datasetService = TestBed.inject(DatasetService);
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });

    it("should activate search API and update view", fakeAsync(() => {
        const MOCK_AUTOCOMPLETE_ITEM: DatasetAutocompleteItem = {
            __typename: TypeNames.datasetType,
            dummy: false,
            dataset: mockDatasetBasicsDerivedFragment,
        };
        const searchApiAutocompleteDatasetSearchSpy = spyOn(searchApi, "autocompleteDatasetSearch").and.callFake(() =>
            of([MOCK_AUTOCOMPLETE_ITEM]),
        );

        const SEARCH_QUERY = "query";
        dispatchInputEvent(fixture, "searchInputDatasets", SEARCH_QUERY);
        tick(AppValues.SHORT_DELAY_MS);

        expect(searchApiAutocompleteDatasetSearchSpy).toHaveBeenCalledWith(SEARCH_QUERY);
        flush();
    }));

    it("should clear search input", () => {
        const SEARCH_QUERY = "query";
        dispatchInputEvent(fixture, "searchInputDatasets", SEARCH_QUERY);
        expect(component.searchDataset).toEqual(SEARCH_QUERY);

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
        const requestDatasetSchemaSpy = spyOn(datasetService, "requestDatasetSchema").and.returnValue(
            of(mockGetDatasetSchemaQuery),
        );

        component.onSelectItem(mockNgbTypeaheadSelectItemEvent);

        expect(component.inputDatasets.size).toBe(1);
        expect(component.TREE_DATA.length).toBe(1);
        expect(requestDatasetSchemaSpy).toHaveBeenCalledTimes(1);
    });

    it("should check delete input dataset", () => {
        const deletedDatasetAlias = "test-account/com.youtube.playlist.featuring-kamu-data.videos.stats";
        component.inputDatasets = new Set([
            '{"datasetRef":"did:odf:fed0176ed321fcd2fc471d4d1ab06662223be2c76b7e3d3f14c37413e0802e1dca3c1","alias":"kamu/github.stats"}',
            '{"datasetRef":"did:odf:fed01ae1c46fe64c9d50d741989b406b89b6c40f3810e1b7bcc0ed83edc050fba2d9d","alias":"test-account/com.youtube.playlist.featuring-kamu-data.videos.stats"}',
        ]);
        component.TREE_DATA = [
            { name: "kamu/github.stats", owner: "kamu" },
            { name: "com.youtube.playlist.featuring-kamu-data.videos.stats", owner: "test-account" },
        ];
        fixture.detectChanges();

        component.deleteInputDataset(deletedDatasetAlias);

        expect(component.inputDatasets.size).toBe(1);
        expect(component.TREE_DATA.length).toBe(1);
    });

    it("should check deleting with same dataset name, but different account name", () => {
        const deletedDatasetAlias = "test-account/com.youtube.playlist.featuring-kamu-data.videos.stats";
        component.inputDatasets = new Set([
            '{"datasetRef":"did:odf:fed0176ed321fcd2fc471d4d1ab06662223be2c76b7e3d3f14c37413e0802e1dca3c1","alias":"kamu/com.youtube.playlist.featuring-kamu-data.videos.stats"}',
            '{"datasetRef":"did:odf:fed01ae1c46fe64c9d50d741989b406b89b6c40f3810e1b7bcc0ed83edc050fba2d9d","alias":"test-account/com.youtube.playlist.featuring-kamu-data.videos.stats"}',
        ]);
        component.TREE_DATA = [
            { name: "com.youtube.playlist.featuring-kamu-data.videos.stats", owner: "kamu" },
            { name: "com.youtube.playlist.featuring-kamu-data.videos.stats", owner: "test-account" },
        ];
        fixture.detectChanges();

        component.deleteInputDataset(deletedDatasetAlias);

        expect(component.inputDatasets.size).toBe(1);
        expect(component.TREE_DATA.length).toBe(1);
    });
});
