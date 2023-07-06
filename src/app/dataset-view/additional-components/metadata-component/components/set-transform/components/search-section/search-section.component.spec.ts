import {
    ComponentFixture,
    TestBed,
    fakeAsync,
    flush,
    tick,
} from "@angular/core/testing";
import { SearchSectionComponent } from "./search-section.component";
import { Apollo, ApolloModule } from "apollo-angular";
import { ApolloTestingModule } from "apollo-angular/testing";
import { MatTreeModule, MatTreeNestedDataSource } from "@angular/material/tree";
import {
    NgbTypeaheadModule,
    NgbTypeaheadSelectItemEvent,
} from "@ng-bootstrap/ng-bootstrap";
import { MatIconModule } from "@angular/material/icon";
import { FormsModule } from "@angular/forms";
import { of } from "rxjs";
import AppValues from "src/app/common/app.values";
import {
    dispatchInputEvent,
    emitClickOnElementByDataTestId,
} from "src/app/common/base-test.helpers.spec";
import {
    DatasetAutocompleteItem,
    TypeNames,
} from "src/app/interface/search.interface";
import {
    mockDatasetBasicsFragment,
    mockDatasetInfo,
} from "src/app/search/mock.data";
import { SearchApi } from "src/app/api/search.api";
import { NavigationService } from "src/app/services/navigation.service";
import { DatasetService } from "src/app/dataset-view/dataset.service";
import { mockGetDatasetSchemaQuery } from "../../mock.data";
import { DatasetNode } from "../../set-transform.types";

describe("SearchSectionComponent", () => {
    let component: SearchSectionComponent;
    let fixture: ComponentFixture<SearchSectionComponent>;
    let searchApi: SearchApi;
    let navigationService: NavigationService;
    let datasetService: DatasetService;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [SearchSectionComponent],
            providers: [Apollo],
            imports: [
                ApolloModule,
                ApolloTestingModule,
                MatTreeModule,
                NgbTypeaheadModule,
                MatIconModule,
                FormsModule,
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(SearchSectionComponent);
        component = fixture.componentInstance;
        component.inputDatasets = new Set<string>();
        component.TREE_DATA = [];
        component.dataSource = new MatTreeNestedDataSource<DatasetNode>();
        searchApi = TestBed.inject(SearchApi);
        datasetService = TestBed.inject(DatasetService);
        navigationService = TestBed.inject(NavigationService);
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });

    it("should activate search API and update view", fakeAsync(() => {
        const MOCK_AUTOCOMPLETE_ITEM: DatasetAutocompleteItem = {
            __typename: TypeNames.datasetType,
            dataset: mockDatasetBasicsFragment,
        };
        const searchApiAutocompleteDatasetSearchSpy = spyOn(
            searchApi,
            "autocompleteDatasetSearch",
        ).and.callFake(() => of([MOCK_AUTOCOMPLETE_ITEM]));

        const SEARCH_QUERY = "query";
        dispatchInputEvent(fixture, "searchInputDatasets", SEARCH_QUERY);
        tick(AppValues.SHORT_DELAY_MS);

        expect(searchApiAutocompleteDatasetSearchSpy).toHaveBeenCalledWith(
            SEARCH_QUERY,
        );
        flush();
    }));

    it("should clear search input", () => {
        const SEARCH_QUERY = "query";
        dispatchInputEvent(fixture, "searchInputDatasets", SEARCH_QUERY);
        expect(component.searchDataset).toEqual(SEARCH_QUERY);

        emitClickOnElementByDataTestId(fixture, "clear-input");

        expect(component.searchDataset).toEqual("");
    });

    it("should navigate to dataset overview tab", () => {
        const datasetInfo = mockDatasetInfo;
        const navigateToDatasetViewSpy = spyOn(
            navigationService,
            "navigateToDatasetView",
        );

        component.navigateToDataset(
            datasetInfo.accountName,
            datasetInfo.datasetName,
        );

        expect(navigateToDatasetViewSpy).toHaveBeenCalledWith(datasetInfo);
    });

    it("should navigate to owner view", () => {
        const owner = "kamu";
        const navigateToOwnerViewSpy = spyOn(
            navigationService,
            "navigateToOwnerView",
        );

        component.navigateToOwner(owner);

        expect(navigateToOwnerViewSpy).toHaveBeenCalledWith(owner);
    });

    it("should check select input dataset", () => {
        const mockNgbTypeaheadSelectItemEvent = {
            item: {
                dataset: mockDatasetBasicsFragment,
                __typename: TypeNames.datasetType,
            },
        } as NgbTypeaheadSelectItemEvent;
        const requestDatasetSchemaSpy = spyOn(
            datasetService,
            "requestDatasetSchema",
        ).and.returnValue(of(mockGetDatasetSchemaQuery));

        component.onSelectItem(mockNgbTypeaheadSelectItemEvent);

        expect(component.inputDatasets.size).toBe(1);
        expect(component.TREE_DATA.length).toBe(1);
        expect(requestDatasetSchemaSpy).toHaveBeenCalledTimes(1);
    });

    it("should check delete input dataset", () => {
        const deletedName = "mockDataset1";
        component.inputDatasets = new Set([deletedName, "mockDataset2"]);
        component.TREE_DATA = [{ name: deletedName }, { name: "mockDataset2" }];
        fixture.detectChanges();

        component.deleteInputDataset(deletedName);

        expect(component.inputDatasets.size).toBe(1);
        expect(component.TREE_DATA.length).toBe(1);
    });
});
