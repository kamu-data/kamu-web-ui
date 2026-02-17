/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { ComponentFixture, fakeAsync, flush, TestBed, tick } from "@angular/core/testing";

import { of } from "rxjs";

import { SearchApi } from "@api/search.api";
import { dispatchInputEvent, emitClickOnElementByDataTestId } from "@common/helpers/base-test.helpers.spec";
import { SharedTestModule } from "@common/modules/shared-test.module";
import AppValues from "@common/values/app.values";
import { NgbTypeaheadSelectItemEvent } from "@ng-bootstrap/ng-bootstrap";
import { Apollo } from "apollo-angular";
import { provideToastr } from "ngx-toastr";
import { SearchSectionComponent } from "src/app/dataset-view/additional-components/metadata-component/components/set-transform/components/search-section/search-section.component";
import { mockGetDatasetSchemaQuery } from "src/app/dataset-view/additional-components/metadata-component/components/set-transform/mock.data";
import { DatasetService } from "src/app/dataset-view/dataset.service";
import { DatasetAutocompleteItem, TypeNames } from "src/app/interface/search.interface";
import { mockDatasetBasicsDerivedFragment, mockDatasetInfo } from "src/app/search/mock.data";

describe("SearchSectionComponent", () => {
    let component: SearchSectionComponent;
    let fixture: ComponentFixture<SearchSectionComponent>;
    let searchApi: SearchApi;
    let datasetService: DatasetService;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            providers: [Apollo, provideToastr()],
            imports: [SharedTestModule, SearchSectionComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(SearchSectionComponent);
        component = fixture.componentInstance;
        component.inputDatasets = new Set<string>();
        component.inputsViewModel = [];
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
        expect(component.inputsViewModel.length).toBe(1);
        expect(requestDatasetSchemaSpy).toHaveBeenCalledTimes(1);
    });

    it("should check delete input dataset", () => {
        const deletedDatasetOwner = "test-account";
        const deletedDatasetName = "com.youtube.playlist.featuring-kamu-data.videos.stats";
        component.inputDatasets = new Set([
            '{"datasetRef":"did:odf:fed0176ed321fcd2fc471d4d1ab06662223be2c76b7e3d3f14c37413e0802e1dca3c1","alias":"kamu/github.stats"}',
            '{"datasetRef":"did:odf:fed01ae1c46fe64c9d50d741989b406b89b6c40f3810e1b7bcc0ed83edc050fba2d9d","alias":"test-account/com.youtube.playlist.featuring-kamu-data.videos.stats"}',
        ]);
        component.inputsViewModel = [
            { name: "kamu/github.stats", owner: "kamu" },
            { name: "com.youtube.playlist.featuring-kamu-data.videos.stats", owner: "test-account" },
        ];
        fixture.detectChanges();

        component.deleteInputDataset(deletedDatasetOwner, deletedDatasetName);

        expect(component.inputDatasets.size).toBe(1);
    });

    it("should check deleting with same dataset name, but different account name", () => {
        const deletedDatasetOwner = "test-account";
        const deletedDatasetName = "com.youtube.playlist.featuring-kamu-data.videos.stats";
        component.inputDatasets = new Set([
            '{"datasetRef":"did:odf:fed0176ed321fcd2fc471d4d1ab06662223be2c76b7e3d3f14c37413e0802e1dca3c1","alias":"kamu/com.youtube.playlist.featuring-kamu-data.videos.stats"}',
            '{"datasetRef":"did:odf:fed01ae1c46fe64c9d50d741989b406b89b6c40f3810e1b7bcc0ed83edc050fba2d9d","alias":"test-account/com.youtube.playlist.featuring-kamu-data.videos.stats"}',
        ]);
        component.inputsViewModel = [
            { name: "com.youtube.playlist.featuring-kamu-data.videos.stats", owner: "kamu" },
            { name: "com.youtube.playlist.featuring-kamu-data.videos.stats", owner: "test-account" },
        ];
        fixture.detectChanges();

        component.deleteInputDataset(deletedDatasetOwner, deletedDatasetName);

        expect(component.inputDatasets.size).toBe(1);
        expect(component.inputsViewModel.length).toBe(1);
    });
});
