/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { ComponentFixture, TestBed } from "@angular/core/testing";
import { MatTreeNestedDataSource } from "@angular/material/tree";
import { ActivatedRoute } from "@angular/router";

import { of } from "rxjs";

import { mockAccountDetails } from "@api/mock/auth.mock";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { ApolloTestingModule } from "apollo-angular/testing";
import { provideToastr } from "ngx-toastr";
import { LoggedUserService } from "src/app/auth/logged-user.service";
import {
    mockGetDatasetSchemaQuery,
    mockParseSetTransformYamlType,
    mockSetTransformEventYaml,
} from "src/app/dataset-view/additional-components/metadata-component/components/set-transform/mock.data";
import { SetTransformComponent } from "src/app/dataset-view/additional-components/metadata-component/components/set-transform/set-transform.component";
import { DatasetNode } from "src/app/dataset-view/additional-components/metadata-component/components/set-transform/set-transform.types";
import { DatasetCommitService } from "src/app/dataset-view/additional-components/overview-component/services/dataset-commit.service";
import { DatasetViewTypeEnum } from "src/app/dataset-view/dataset-view.interface";
import { DatasetService } from "src/app/dataset-view/dataset.service";
import { DatasetSubscriptionsService } from "src/app/dataset-view/dataset.subscriptions.service";
import { DatasetNavigationParams } from "src/app/interface/navigation.interface";
import {
    mockDatasetBasicsDerivedFragment,
    mockDatasetBasicsRootFragment,
    mockDatasetInfo,
    mockFullPowerDatasetPermissionsFragment,
} from "src/app/search/mock.data";
import { NavigationService } from "src/app/services/navigation.service";

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
            imports: [ApolloTestingModule, SetTransformComponent],
            providers: [
                provideToastr(),
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
        expect(component.inputsViewModel.length).toBe(2);
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
