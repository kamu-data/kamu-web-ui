/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { ComponentFixture, fakeAsync, flush, TestBed, tick } from "@angular/core/testing";

import { of, throwError } from "rxjs";

import { NgbTypeaheadSelectItemEvent } from "@ng-bootstrap/ng-bootstrap";
import { Apollo } from "apollo-angular";
import { provideToastr } from "ngx-toastr";

import { dispatchInputEvent, emitClickOnElementByDataTestId } from "@common/helpers/base-test.helpers.spec";
import { SharedTestModule } from "@common/modules/shared-test.module";
import AppValues from "@common/values/app.values";
import { SearchApi } from "@api/search.api";
import { DatasetInfo } from "@interface/navigation.interface";
import { DatasetAutocompleteItem, TypeNames } from "@interface/search.interface";

import { SearchSectionComponent } from "src/app/dataset-view/additional-components/metadata-component/components/set-transform/components/search-section/search-section.component";
import { mockGetDatasetSchemaQuery } from "src/app/dataset-view/additional-components/metadata-component/components/set-transform/mock.data";
import { unavailableDatasetNode } from "src/app/dataset-view/additional-components/metadata-component/components/set-transform/set-transform.helpers";
import { DatasetNode } from "src/app/dataset-view/additional-components/metadata-component/components/set-transform/set-transform.types";
import { DatasetService } from "src/app/dataset-view/dataset.service";
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
        fixture.componentRef.setInput("inputDatasets", new Set<string>());
        fixture.componentRef.setInput("inputsViewModel", [] satisfies DatasetNode[]);
        fixture.componentRef.setInput("datasetInfo", mockDatasetInfo);
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

    it("should hide the edited dataset and added inputs from search results when aliases have no account prefix", fakeAsync(() => {
        const editedDataset = { ...mockDatasetBasicsDerivedFragment, id: "edited", name: "derived", alias: "derived" };
        const addedDataset = { ...mockDatasetBasicsDerivedFragment, id: "added", name: "cities", alias: "cities" };
        const otherDataset = { ...mockDatasetBasicsDerivedFragment, id: "other", name: "cities-2", alias: "cities-2" };
        fixture.componentRef.setInput("datasetInfo", {
            accountName: editedDataset.owner.accountName,
            datasetName: editedDataset.name,
        } satisfies DatasetInfo);
        fixture.componentRef.setInput("inputsViewModel", [
            { name: "cities", owner: addedDataset.owner.accountName, alias: "cities" },
        ] satisfies DatasetNode[]);
        spyOn(searchApi, "autocompleteDatasetSearch").and.returnValue(
            of(
                [editedDataset, addedDataset, otherDataset].map((dataset) => ({
                    __typename: TypeNames.datasetType,
                    dummy: false,
                    dataset,
                })),
            ),
        );

        let results: DatasetAutocompleteItem[] = [];
        component.search(of("cit")).subscribe((items) => (results = items));
        tick(AppValues.SHORT_DELAY_MS);

        expect(results.map((item) => item.dataset.alias)).toEqual(["cities-2"]);
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
        expect(component.inputsViewModel[0].alias).toEqual(mockDatasetBasicsDerivedFragment.alias);
        expect(requestDatasetSchemaSpy).toHaveBeenCalledTimes(1);
    });

    it("should list a selected input as unavailable when its schema fails to load", () => {
        const mockNgbTypeaheadSelectItemEvent = {
            item: {
                dataset: mockDatasetBasicsDerivedFragment,
                __typename: TypeNames.datasetType,
            },
        } as NgbTypeaheadSelectItemEvent;
        spyOn(datasetService, "requestDatasetSchema").and.returnValue(throwError(() => new Error("fail")));

        component.onSelectItem(mockNgbTypeaheadSelectItemEvent);

        expect(component.inputDatasets.size).toBe(1);
        expect(component.inputsViewModel).toEqual([unavailableDatasetNode(mockDatasetBasicsDerivedFragment.alias)]);
    });

    it("should check delete input dataset", () => {
        const deletedAlias = "test-account/com.youtube.playlist.featuring-kamu-data.videos.stats";
        fixture.componentRef.setInput(
            "inputDatasets",
            new Set([
                '{"datasetRef":"did:odf:fed0176ed321fcd2fc471d4d1ab06662223be2c76b7e3d3f14c37413e0802e1dca3c1","alias":"kamu/github.stats"}',
                `{"datasetRef":"did:odf:fed01ae1c46fe64c9d50d741989b406b89b6c40f3810e1b7bcc0ed83edc050fba2d9d","alias":"${deletedAlias}"}`,
            ]),
        );
        fixture.componentRef.setInput("inputsViewModel", [
            { name: "github.stats", owner: "kamu", alias: "kamu/github.stats" },
            {
                name: "com.youtube.playlist.featuring-kamu-data.videos.stats",
                owner: "test-account",
                alias: deletedAlias,
            },
        ] satisfies DatasetNode[]);
        fixture.detectChanges();

        component.deleteInputDataset(deletedAlias);

        expect(component.inputDatasets.size).toBe(1);
    });

    it("should check deleting with same dataset name, but different account name", () => {
        const deletedAlias = "test-account/com.youtube.playlist.featuring-kamu-data.videos.stats";
        fixture.componentRef.setInput(
            "inputDatasets",
            new Set([
                '{"datasetRef":"did:odf:fed0176ed321fcd2fc471d4d1ab06662223be2c76b7e3d3f14c37413e0802e1dca3c1","alias":"kamu/com.youtube.playlist.featuring-kamu-data.videos.stats"}',
                `{"datasetRef":"did:odf:fed01ae1c46fe64c9d50d741989b406b89b6c40f3810e1b7bcc0ed83edc050fba2d9d","alias":"${deletedAlias}"}`,
            ]),
        );
        fixture.componentRef.setInput("inputsViewModel", [
            {
                name: "com.youtube.playlist.featuring-kamu-data.videos.stats",
                owner: "kamu",
                alias: "kamu/com.youtube.playlist.featuring-kamu-data.videos.stats",
            },
            {
                name: "com.youtube.playlist.featuring-kamu-data.videos.stats",
                owner: "test-account",
                alias: deletedAlias,
            },
        ] satisfies DatasetNode[]);
        fixture.detectChanges();

        component.deleteInputDataset(deletedAlias);

        expect(component.inputDatasets.size).toBe(1);
        expect(component.inputsViewModel.length).toBe(1);
    });

    it("should keep an input whose alias starts with the deleted alias", () => {
        const keptInput =
            '{"datasetRef":"did:odf:fed01ae1c46fe64c9d50d741989b406b89b6c40f3810e1b7bcc0ed83edc050fba2d9d","alias":"kamu/cities-2"}';
        fixture.componentRef.setInput(
            "inputDatasets",
            new Set([
                '{"datasetRef":"did:odf:fed0176ed321fcd2fc471d4d1ab06662223be2c76b7e3d3f14c37413e0802e1dca3c1","alias":"kamu/cities"}',
                keptInput,
            ]),
        );
        fixture.componentRef.setInput("inputsViewModel", [
            { name: "cities", owner: "kamu", alias: "kamu/cities" },
            { name: "cities-2", owner: "kamu", alias: "kamu/cities-2" },
        ] satisfies DatasetNode[]);
        fixture.detectChanges();

        component.deleteInputDataset("kamu/cities");

        expect(Array.from(component.inputDatasets)).toEqual([keptInput]);
        expect(component.inputsViewModel).toEqual([{ name: "cities-2", owner: "kamu", alias: "kamu/cities-2" }]);
    });

    it("should delete an input whose alias has no account prefix", () => {
        const keptInput =
            '{"datasetRef":"did:odf:fed01ae1c46fe64c9d50d741989b406b89b6c40f3810e1b7bcc0ed83edc050fba2d9d","alias":"account.transactions"}';
        fixture.componentRef.setInput(
            "inputDatasets",
            new Set([
                '{"datasetRef":"did:odf:fed0176ed321fcd2fc471d4d1ab06662223be2c76b7e3d3f14c37413e0802e1dca3c1","alias":"account.tokens.transfers"}',
                keptInput,
            ]),
        );
        fixture.componentRef.setInput("inputsViewModel", [
            { name: "account.tokens.transfers", owner: "kamu", alias: "account.tokens.transfers" },
            { name: "account.transactions", owner: "kamu", alias: "account.transactions" },
        ] satisfies DatasetNode[]);
        fixture.detectChanges();

        component.deleteInputDataset("account.tokens.transfers");

        expect(Array.from(component.inputDatasets)).toEqual([keptInput]);
        expect(component.inputsViewModel.map((item) => item.alias)).toEqual(["account.transactions"]);
    });
});
