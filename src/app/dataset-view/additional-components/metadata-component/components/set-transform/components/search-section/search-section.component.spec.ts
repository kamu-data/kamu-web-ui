/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { TestbedHarnessEnvironment } from "@angular/cdk/testing/testbed";
import { ComponentFixture, fakeAsync, flush, TestBed, tick } from "@angular/core/testing";

import { of, Subject, throwError } from "rxjs";

import { NgbTypeaheadSelectItemEvent } from "@ng-bootstrap/ng-bootstrap";
import { Apollo } from "apollo-angular";
import { provideToastr } from "ngx-toastr";

import {
    dispatchInputEvent,
    emitClickOnElementByDataTestId,
    registerMatSvgIcons,
    setComponentInput,
} from "@common/helpers/base-test.helpers.spec";
import { SharedTestModule } from "@common/modules/shared-test.module";
import AppValues from "@common/values/app.values";
import { DatasetBasicsFragment, GetDatasetSchemaQuery } from "@api/kamu.graphql.interface";
import { SearchApi } from "@api/search.api";
import { DatasetAutocompleteItem, TypeNames } from "@interface/search.interface";

import { SearchSectionComponent } from "src/app/dataset-view/additional-components/metadata-component/components/set-transform/components/search-section/search-section.component";
import { SearchSectionHarness } from "src/app/dataset-view/additional-components/metadata-component/components/set-transform/components/search-section/search-section.harness";
import {
    mockGetDatasetSchemaQuery,
    mockParseSetTransformYamlType,
} from "src/app/dataset-view/additional-components/metadata-component/components/set-transform/mock.data";
import {
    transformInputForm,
    transformInputsFormArray,
} from "src/app/dataset-view/additional-components/metadata-component/components/set-transform/set-transform.helpers";
import {
    TransformInputsFormArray,
    TransformSelectedInput,
} from "src/app/dataset-view/additional-components/metadata-component/components/set-transform/set-transform.types";
import { DatasetService } from "src/app/dataset-view/dataset.service";
import { mockDatasetBasicsDerivedFragment, mockDatasetInfo } from "src/app/search/mock.data";

describe("SearchSectionComponent", () => {
    const [firstInput, secondInput] = mockParseSetTransformYamlType.inputs;
    const LOADED_DATASET = `${mockGetDatasetSchemaQuery.datasets.byId?.owner.accountName}/${mockGetDatasetSchemaQuery.datasets.byId?.name}`;

    let component: SearchSectionComponent;
    let fixture: ComponentFixture<SearchSectionComponent>;
    let searchApi: SearchApi;
    let datasetService: DatasetService;
    let inputsForm: TransformInputsFormArray;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            providers: [Apollo, provideToastr()],
            imports: [SharedTestModule, SearchSectionComponent],
        }).compileComponents();

        searchApi = TestBed.inject(SearchApi);
        datasetService = TestBed.inject(DatasetService);
        registerMatSvgIcons();
    });

    function createComponent(inputs: TransformSelectedInput[]): void {
        inputsForm = transformInputsFormArray(inputs);
        fixture = TestBed.createComponent(SearchSectionComponent);
        component = fixture.componentInstance;
        setComponentInput(fixture, "inputsForm", inputsForm);
        setComponentInput(fixture, "datasetInfo", mockDatasetInfo);
        fixture.detectChanges();
    }

    function getHarness(): Promise<SearchSectionHarness> {
        return TestbedHarnessEnvironment.harnessForFixture(fixture, SearchSectionHarness);
    }

    function autocompleteItem(dataset: DatasetBasicsFragment): DatasetAutocompleteItem {
        return { __typename: TypeNames.datasetType, dummy: false, dataset };
    }

    function selectEvent(dataset: DatasetBasicsFragment): NgbTypeaheadSelectItemEvent<DatasetAutocompleteItem> {
        return { item: autocompleteItem(dataset), preventDefault: () => undefined };
    }

    describe("searching", () => {
        beforeEach(() => createComponent([]));

        it("should activate search API and update view", fakeAsync(() => {
            const searchApiAutocompleteDatasetSearchSpy = vi
                .spyOn(searchApi, "autocompleteDatasetSearch")
                .mockImplementation(() => of([autocompleteItem(mockDatasetBasicsDerivedFragment)]));

            const SEARCH_QUERY = "query";
            dispatchInputEvent(fixture, "searchInputDatasets", SEARCH_QUERY);
            tick(AppValues.SHORT_DELAY_MS);

            expect(searchApiAutocompleteDatasetSearchSpy).toHaveBeenCalledWith(SEARCH_QUERY);
            flush();
        }));

        it("should hide the edited dataset and the inputs' datasets from search results", fakeAsync(() => {
            const editedDataset = { ...mockDatasetBasicsDerivedFragment, id: "edited", name: "derived" };
            const addedDataset = { ...mockDatasetBasicsDerivedFragment, id: "added", name: "cities" };
            const otherDataset = { ...mockDatasetBasicsDerivedFragment, id: "other", name: "cities-2" };
            setComponentInput(fixture, "datasetInfo", {
                accountName: editedDataset.owner.accountName,
                datasetName: editedDataset.name,
            });
            // The input is renamed, so only its dataset id still ties it to the search result
            inputsForm.push(transformInputForm({ datasetRef: "added", alias: "renamed" }));
            vi.spyOn(searchApi, "autocompleteDatasetSearch").mockReturnValue(
                of([editedDataset, addedDataset, otherDataset].map(autocompleteItem)),
            );

            let results: DatasetAutocompleteItem[] = [];
            component.search(of("cit")).subscribe((items) => (results = items));
            tick(AppValues.SHORT_DELAY_MS);

            expect(results.map((item) => item.dataset.id)).toEqual(["other"]);
        }));

        it("should offer no suggestions for a failed search and still search the next term", fakeAsync(() => {
            const MOCK_AUTOCOMPLETE_ITEM = autocompleteItem({
                ...mockDatasetBasicsDerivedFragment,
                id: "other",
                name: "cities-2",
                alias: "cities-2",
            });
            const autocompleteDatasetSearchSpy = vi.spyOn(searchApi, "autocompleteDatasetSearch");
            autocompleteDatasetSearchSpy.mockReturnValueOnce(throwError(() => new Error("Server unreachable")));
            autocompleteDatasetSearchSpy.mockReturnValue(of([MOCK_AUTOCOMPLETE_ITEM]));
            const text$ = new Subject<string>();
            const results: DatasetAutocompleteItem[][] = [];
            component.search(text$).subscribe((items) => results.push(items));

            text$.next("fail");
            tick(AppValues.SHORT_DELAY_MS);
            expect(results).toEqual([[]]);

            text$.next("cit");
            tick(AppValues.SHORT_DELAY_MS);
            expect(results).toEqual([[], [MOCK_AUTOCOMPLETE_ITEM]]);
        }));

        it("should clear search input", () => {
            const SEARCH_QUERY = "query";
            dispatchInputEvent(fixture, "searchInputDatasets", SEARCH_QUERY);
            expect(component.searchDataset).toEqual(SEARCH_QUERY);

            emitClickOnElementByDataTestId(fixture, "clear-input");

            expect(component.searchDataset).toEqual("");
        });
    });

    describe("adding an input", () => {
        beforeEach(() => createComponent([]));

        it("should add the selected dataset under its alias and show its schema's dataset", async () => {
            const requestDatasetSchemaSpy = vi
                .spyOn(datasetService, "requestDatasetSchema")
                .mockReturnValue(of(mockGetDatasetSchemaQuery));

            component.onSelectItem(selectEvent(mockDatasetBasicsDerivedFragment));
            const harness = await getHarness();

            expect(inputsForm.getRawValue()).toEqual([
                { datasetRef: mockDatasetBasicsDerivedFragment.id, alias: mockDatasetBasicsDerivedFragment.alias },
            ]);
            expect(requestDatasetSchemaSpy).toHaveBeenCalledExactlyOnceWith(mockDatasetBasicsDerivedFragment.id);
            expect(await harness.getAliases()).toEqual([mockDatasetBasicsDerivedFragment.alias]);
            expect(await harness.getInputDatasets()).toEqual([LOADED_DATASET]);
        });

        it("should not add the same dataset twice", () => {
            vi.spyOn(datasetService, "requestDatasetSchema").mockReturnValue(of(mockGetDatasetSchemaQuery));

            component.onSelectItem(selectEvent(mockDatasetBasicsDerivedFragment));
            component.onSelectItem(selectEvent(mockDatasetBasicsDerivedFragment));

            expect(inputsForm.length).toBe(1);
        });

        it("should list a selected input as unavailable when its schema fails to load", async () => {
            vi.spyOn(datasetService, "requestDatasetSchema").mockReturnValue(throwError(() => new Error("fail")));

            component.onSelectItem(selectEvent(mockDatasetBasicsDerivedFragment));
            const harness = await getHarness();

            expect(inputsForm.length).toBe(1);
            expect(await harness.getInputDatasets()).toEqual([AppValues.SET_TRANSFORM_UNAVAILABLE_INPUT_LABEL]);
        });
    });

    describe("with inputs from the event", () => {
        let schemaResponses: Record<string, Subject<GetDatasetSchemaQuery>>;

        beforeEach(() => {
            schemaResponses = {
                [firstInput.datasetRef]: new Subject<GetDatasetSchemaQuery>(),
                [secondInput.datasetRef]: new Subject<GetDatasetSchemaQuery>(),
            };
            vi.spyOn(datasetService, "requestDatasetSchema").mockImplementation((datasetRef: string) =>
                schemaResponses[datasetRef].asObservable(),
            );
            createComponent([firstInput, secondInput]);
        });

        it("should show each input's alias in the event's order while its dataset loads", async () => {
            const harness = await getHarness();

            expect(await harness.getAliases()).toEqual([firstInput.alias, secondInput.alias]);
            expect(await harness.getInputDatasets()).toEqual(["Loading...", "Loading..."]);
        });

        it("should show each input's dataset once it loads, and a failed one as unavailable", async () => {
            schemaResponses[secondInput.datasetRef].next(mockGetDatasetSchemaQuery);
            schemaResponses[firstInput.datasetRef].error(new Error("request failed"));
            const harness = await getHarness();

            expect(await harness.getInputDatasets()).toEqual([
                AppValues.SET_TRANSFORM_UNAVAILABLE_INPUT_LABEL,
                LOADED_DATASET,
            ]);
        });

        it("should keep the alias the user types", async () => {
            const harness = await getHarness();

            await harness.setAlias(1, "transactions");

            expect(inputsForm.getRawValue()).toEqual([firstInput, { ...secondInput, alias: "transactions" }]);
            expect(await harness.getAliasError(1)).toBeNull();
            expect(await harness.getAliasesError()).toBeNull();
        });

        it("should trim the alias when the field is left", async () => {
            const harness = await getHarness();

            await harness.setAlias(0, "  tokens  ");

            expect(inputsForm.controls[0].controls.alias.value).toEqual("tokens");
        });

        it("should require an alias", async () => {
            const harness = await getHarness();

            await harness.setAlias(0, "");

            expect(await harness.getAliasError(0)).toEqual("Query alias is required");
            expect(inputsForm.valid).toBe(false);
        });

        it("should reject an alias of spaces only", async () => {
            const harness = await getHarness();

            await harness.setAlias(0, "   ");

            expect(await harness.getAliasError(0)).toEqual("Query alias is required");
            expect(inputsForm.valid).toBe(false);
        });

        it("should reject two inputs with the same alias", async () => {
            const harness = await getHarness();

            await harness.setAlias(1, firstInput.alias);

            expect(await harness.getAliasesError()).toEqual(`Input list contains "${firstInput.alias}" more than once`);
            expect(inputsForm.valid).toBe(false);
        });

        it("should delete only the chosen input and clear the duplicate it caused", async () => {
            const harness = await getHarness();
            await harness.setAlias(1, firstInput.alias);

            await harness.deleteInput(0);

            expect(inputsForm.getRawValue()).toEqual([{ ...secondInput, alias: firstInput.alias }]);
            expect(await harness.getAliasesError()).toBeNull();
            expect(inputsForm.valid).toBe(true);
        });
    });
});
