import { ComponentFixture, TestBed } from "@angular/core/testing";
import { SetTransformComponent } from "./set-transform.component";
import { Apollo, ApolloModule } from "apollo-angular";
import { ActivatedRoute } from "@angular/router";
import { ApolloTestingModule } from "apollo-angular/testing";
import { EditSetTransformService } from "./edit-set-transform..service";
import { of } from "rxjs";
import { MonacoEditorModule } from "ngx-monaco-editor-v2";
import {
    mockGetDatasetSchemaQuery,
    mockParseSetTransFormYamlType,
    mockSetTransformEventYaml,
    mockSetTransformEventYamlWithQuery,
} from "./mock.data";
import { DatasetService } from "src/app/dataset-view/dataset.service";
import { MatTreeModule, MatTreeNestedDataSource } from "@angular/material/tree";
import { DatasetNode } from "./set-transform.types";
import { DatasetCommitService } from "../../../overview-component/services/dataset-commit.service";
import { QueriesSectionComponent } from "./components/queries-section/queries-section.component";
import { EngineSectionComponent } from "./components/engine-section/engine-section.component";
import { SearchSectionComponent } from "./components/search-section/search-section.component";
import { MatIconModule } from "@angular/material/icon";
import { StepperNavigationComponent } from "../stepper-navigation/stepper-navigation.component";
import { NgbTypeaheadModule } from "@ng-bootstrap/ng-bootstrap";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { DatasetSubscriptionsService } from "src/app/dataset-view/dataset.subscriptions.service";
import { NavigationService } from "src/app/services/navigation.service";
import { DatasetNavigationParams } from "src/app/interface/navigation.interface";
import {
    mockDatasetBasicsRootFragment,
    mockFullPowerDatasetPermissionsFragment,
    mockDatasetBasicsDerivedFragment,
} from "src/app/search/mock.data";

describe("SetTransformComponent", () => {
    let component: SetTransformComponent;
    let fixture: ComponentFixture<SetTransformComponent>;

    let editService: EditSetTransformService;
    let datasetCommitService: DatasetCommitService;
    let datasetService: DatasetService;
    let datasetSubsService: DatasetSubscriptionsService;
    let navigationService: NavigationService;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [
                SetTransformComponent,
                EngineSectionComponent,
                QueriesSectionComponent,
                SearchSectionComponent,
                StepperNavigationComponent,
            ],
            imports: [
                ApolloModule,
                ApolloTestingModule,
                MonacoEditorModule.forRoot(),
                MatTreeModule,
                MatIconModule,
                NgbTypeaheadModule,
                FormsModule,
                ReactiveFormsModule,
            ],
            providers: [
                Apollo,
                {
                    provide: ActivatedRoute,
                    useValue: {
                        snapshot: {
                            paramMap: {
                                get: (key: string) => {
                                    switch (key) {
                                        case "accountName":
                                            return "accountName";
                                        case "datasetName":
                                            return "datasetName";
                                    }
                                },
                            },
                        },
                    },
                },
            ],
        }).compileComponents();

        navigationService = TestBed.inject(NavigationService);
        editService = TestBed.inject(EditSetTransformService);
        datasetCommitService = TestBed.inject(DatasetCommitService);
        datasetService = TestBed.inject(DatasetService);
        datasetSubsService = TestBed.inject(DatasetSubscriptionsService);

        fixture = TestBed.createComponent(SetTransformComponent);
        component = fixture.componentInstance;
        component.selectedEngine = "Spark";
        component.dataSource = new MatTreeNestedDataSource<DatasetNode>();
        component.inputDatasets = new Set<string>([
            '{"id":"did:odf:z4k88e8ctFydBwcEhtvaB9AuBL6L2kfGnNvS1LjPGLA51owXkxX","name":"account.tokens.portfolio.usd"}',
        ]);

        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });

    it("check dataset editability passes for derived dataset with full permissions", () => {
        const navigateToDatasetViewSpy = spyOn(navigationService, "navigateToDatasetView").and.stub();

        datasetService.datasetChanges(mockDatasetBasicsDerivedFragment);
        datasetSubsService.changePermissionsData(mockFullPowerDatasetPermissionsFragment);

        expect(navigateToDatasetViewSpy).not.toHaveBeenCalled();
    });

    it("check dataset editability fails without commit permission", () => {
        const navigateToDatasetViewSpy = spyOn(navigationService, "navigateToDatasetView").and.stub();

        datasetService.datasetChanges(mockDatasetBasicsDerivedFragment);
        datasetSubsService.changePermissionsData({
            permissions: {
                ...mockFullPowerDatasetPermissionsFragment.permissions,
                canCommit: false,
            },
        });

        expect(navigateToDatasetViewSpy).toHaveBeenCalledWith({
            accountName: mockDatasetBasicsDerivedFragment.owner.accountName,
            datasetName: mockDatasetBasicsDerivedFragment.name,
        } as DatasetNavigationParams);
    });

    it("check dataset editability fails upon root dataset", () => {
        const navigateToDatasetViewSpy = spyOn(navigationService, "navigateToDatasetView").and.stub();

        datasetService.datasetChanges(mockDatasetBasicsRootFragment);
        datasetSubsService.changePermissionsData(mockFullPowerDatasetPermissionsFragment);

        expect(navigateToDatasetViewSpy).toHaveBeenCalledWith({
            accountName: mockDatasetBasicsRootFragment.owner.accountName,
            datasetName: mockDatasetBasicsRootFragment.name,
        } as DatasetNavigationParams);
    });

    it("should check select engine", () => {
        const engine = "Flink";
        component.onSelectEngine(engine);

        expect(component.selectedEngine).toEqual(engine);
    });

    it("should check save event", () => {
        const commitEventToDatasetSpy = spyOn(datasetCommitService, "commitEventToDataset").and.returnValue(of());
        component.onSaveEvent();
        expect(commitEventToDatasetSpy).toHaveBeenCalledTimes(1);
    });

    it("should check init queries section with queries", () => {
        spyOn(editService, "getEventAsYaml").and.callFake(() => of(mockSetTransformEventYaml));
        spyOn(datasetService, "requestDatasetSchema").and.callFake(() => of(mockGetDatasetSchemaQuery));
        component.ngOnInit();

        expect(component.currentSetTransformEvent).toEqual(mockParseSetTransFormYamlType);
        expect(component.TREE_DATA.length).toBe(2);
    });

    it("should check init queries section with query", () => {
        spyOn(editService, "getEventAsYaml").and.callFake(() => of(mockSetTransformEventYamlWithQuery));
        spyOn(datasetService, "requestDatasetSchema").and.callFake(() => of(mockGetDatasetSchemaQuery));
        component.ngOnInit();

        expect(component.queries.length).toBe(1);
        expect(component.queries[0].query).not.toBeNull();
    });

    it("should check init queries section when event is null", () => {
        spyOn(editService, "getEventAsYaml").and.callFake(() => of(null));
        spyOn(datasetService, "requestDatasetSchema").and.callFake(() => of(mockGetDatasetSchemaQuery));
        component.ngOnInit();

        expect(component.queries.length).toBe(1);
        expect(component.queries[0].query).toBe("");
    });
});
