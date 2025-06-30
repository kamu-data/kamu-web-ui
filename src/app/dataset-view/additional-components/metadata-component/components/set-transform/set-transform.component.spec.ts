/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { ComponentFixture, TestBed } from "@angular/core/testing";
import { SetTransformComponent } from "./set-transform.component";
import { Apollo, ApolloModule } from "apollo-angular";
import { ActivatedRoute, RouterModule } from "@angular/router";
import { ApolloTestingModule } from "apollo-angular/testing";
import { of } from "rxjs";
import { mockGetDatasetSchemaQuery, mockParseSetTransformYamlType, mockSetTransformEventYaml } from "./mock.data";
import { DatasetService } from "src/app/dataset-view/dataset.service";
import { MatTreeModule, MatTreeNestedDataSource } from "@angular/material/tree";
import { DatasetNode } from "./set-transform.types";
import { DatasetCommitService } from "../../../overview-component/services/dataset-commit.service";
import { QueriesSectionComponent } from "./components/queries-section/queries-section.component";
import { EngineSectionComponent } from "./components/engine-section/engine-section.component";
import { SearchSectionComponent } from "./components/search-section/search-section.component";
import { MatIconModule } from "@angular/material/icon";
import { StepperNavigationComponent } from "../stepper-navigation/stepper-navigation.component";
import { NgbModal, NgbTypeaheadModule } from "@ng-bootstrap/ng-bootstrap";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { DatasetSubscriptionsService } from "src/app/dataset-view/dataset.subscriptions.service";
import { NavigationService } from "src/app/services/navigation.service";
import { DatasetNavigationParams } from "src/app/interface/navigation.interface";
import {
    mockDatasetBasicsRootFragment,
    mockFullPowerDatasetPermissionsFragment,
    mockDatasetBasicsDerivedFragment,
    mockDatasetInfo,
} from "src/app/search/mock.data";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { EditorModule } from "../../../../../editor/editor.module";
import { LoggedUserService } from "src/app/auth/logged-user.service";
import { mockAccountDetails } from "src/app/api/mock/auth.mock";
import { DatasetViewTypeEnum } from "src/app/dataset-view/dataset-view.interface";

describe("SetTransformComponent", () => {
    let component: SetTransformComponent;
    let fixture: ComponentFixture<SetTransformComponent>;

    let datasetCommitService: DatasetCommitService;
    let datasetService: DatasetService;
    let datasetSubsService: DatasetSubscriptionsService;
    let navigationService: NavigationService;
    let loggedUserService: LoggedUserService;
    let modalService: NgbModal;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
    imports: [
        ApolloModule,
        ApolloTestingModule,
        MatTreeModule,
        MatIconModule,
        NgbTypeaheadModule,
        FormsModule,
        HttpClientTestingModule,
        ReactiveFormsModule,
        RouterModule,
        EditorModule,
        SetTransformComponent,
        EngineSectionComponent,
        QueriesSectionComponent,
        SearchSectionComponent,
        StepperNavigationComponent,
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
        datasetCommitService = TestBed.inject(DatasetCommitService);
        datasetService = TestBed.inject(DatasetService);
        datasetSubsService = TestBed.inject(DatasetSubscriptionsService);
        loggedUserService = TestBed.inject(LoggedUserService);
        modalService = TestBed.inject(NgbModal);

        fixture = TestBed.createComponent(SetTransformComponent);
        component = fixture.componentInstance;
        component.selectedEngine = "Spark";
        component.eventYamlByHash = mockSetTransformEventYaml;
        component.datasetInfo = mockDatasetInfo;
        component.dataSource = new MatTreeNestedDataSource<DatasetNode>();
        component.inputDatasets = new Set<string>([
            '{"id":"did:odf:z4k88e8ctFydBwcEhtvaB9AuBL6L2kfGnNvS1LjPGLA51owXkxX","name":"account.tokens.portfolio.usd"}',
        ]);
        spyOnProperty(loggedUserService, "currentlyLoggedInUser", "get").and.returnValue(mockAccountDetails);
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });

    it("check dataset editability passes for derived dataset with full permissions", () => {
        const navigateToDatasetViewSpy = spyOn(navigationService, "navigateToDatasetView").and.stub();
        const clonePermissions = structuredClone(mockFullPowerDatasetPermissionsFragment);
        clonePermissions.permissions.metadata.canCommit = true;
        datasetService.emitDatasetChanged(mockDatasetBasicsDerivedFragment);
        datasetSubsService.emitPermissionsChanged(clonePermissions);

        expect(navigateToDatasetViewSpy).not.toHaveBeenCalled();
    });

    it("check dataset editability fails without commit permission", () => {
        const navigateToDatasetViewSpy = spyOn(navigationService, "navigateToDatasetView").and.stub();

        datasetService.emitDatasetChanged(mockDatasetBasicsDerivedFragment);
        datasetSubsService.emitPermissionsChanged({
            permissions: {
                ...mockFullPowerDatasetPermissionsFragment.permissions,
                ...{
                    metadata: {
                        canCommit: false,
                    },
                },
            },
        });

        expect(navigateToDatasetViewSpy).toHaveBeenCalledWith({
            accountName: mockDatasetBasicsDerivedFragment.owner.accountName,
            datasetName: mockDatasetBasicsDerivedFragment.name,
            tab: DatasetViewTypeEnum.Overview,
        } as DatasetNavigationParams);
    });

    it("check dataset editability fails upon root dataset", () => {
        const navigateToDatasetViewSpy = spyOn(navigationService, "navigateToDatasetView").and.stub();

        datasetService.emitDatasetChanged(mockDatasetBasicsRootFragment);
        datasetSubsService.emitPermissionsChanged(mockFullPowerDatasetPermissionsFragment);

        expect(navigateToDatasetViewSpy).toHaveBeenCalledWith({
            accountName: mockDatasetBasicsRootFragment.owner.accountName,
            datasetName: mockDatasetBasicsRootFragment.name,
            tab: DatasetViewTypeEnum.Overview,
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
        spyOn(datasetService, "requestDatasetSchema").and.callFake(() => of(mockGetDatasetSchemaQuery));
        component.ngOnInit();
        expect(component.currentSetTransformEvent).toEqual(mockParseSetTransformYamlType);
        expect(component.TREE_DATA.length).toBe(2);
    });

    it("should check init queries section when event is not null", () => {
        spyOn(datasetService, "requestDatasetSchema").and.callFake(() => of(mockGetDatasetSchemaQuery));
        component.ngOnInit();

        expect(component.queries.length).toBe(4);
        expect(component.queries[0].query).toBeDefined();
    });

    it("should check init default queries section when event is  null", () => {
        component.eventYamlByHash = "";
        component.ngOnInit();

        expect(component.queries.length).toBe(5);
    });

    it("should check edit yaml", () => {
        component.eventYamlByHash = "";
        component.ngOnInit();

        expect(component.queries.length).toBe(5);
    });

    it("should check open modal window to edit event", () => {
        const modalServiceOpenSpy = spyOn(modalService, "open").and.callThrough();
        component.onEditYaml();
        expect(modalServiceOpenSpy).toHaveBeenCalledTimes(1);
    });
});
