/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { ChangeDetectionStrategy } from "@angular/core";
import { Apollo } from "apollo-angular";
import { ApolloTestingModule } from "apollo-angular/testing";
import { FormArray, FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule } from "@angular/forms";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { AddPollingSourceComponent } from "./add-polling-source.component";
import { NgbModal, NgbModalRef, NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { FinalYamlModalComponent } from "../../final-yaml-modal/final-yaml-modal.component";
import { StepperNavigationComponent } from "../../stepper-navigation/stepper-navigation.component";
import { BaseStepComponent } from "../steps/base-step/base-step.component";
import { PollingSourceFormComponentsModule } from "../../form-components/polling-source-form-components.module";
import { of, from } from "rxjs";
import {
    mockDatasetBasicsDerivedFragment,
    mockDatasetBasicsRootFragment,
    mockDatasetHistoryResponse,
    mockFullPowerDatasetPermissionsFragment,
} from "src/app/search/mock.data";
import { DatasetPageInfoFragment, MetadataBlockFragment } from "src/app/api/kamu.graphql.interface";
import { DatasetCommitService } from "../../../../overview-component/services/dataset-commit.service";
import { PrepareStepComponent } from "../steps/prepare-step/prepare-step.component";
import { MatStepperModule } from "@angular/material/stepper";
import { PreprocessStepComponent } from "../steps/preprocess-step/preprocess-step.component";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { DatasetSubscriptionsService } from "src/app/dataset-view/dataset.subscriptions.service";
import { DatasetService } from "src/app/dataset-view/dataset.service";
import { NavigationService } from "src/app/services/navigation.service";
import { DatasetNavigationParams } from "src/app/interface/navigation.interface";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { EditorModule } from "src/app/editor/editor.module";
import {
    EventTimeSourceKind,
    FetchKind,
    MergeKind,
    ReadKind,
    SetPollingSourceSection,
} from "./add-polling-source-form.types";
import { OdfDefaultValues } from "src/app/common/values/app-odf-default.values";
import { LoggedUserService } from "src/app/auth/logged-user.service";
import { mockAccountDetails } from "src/app/api/mock/auth.mock";
import { ActivatedRoute } from "@angular/router";
import { DatasetViewTypeEnum } from "src/app/dataset-view/dataset-view.interface";

describe("AddPollingSourceComponent", () => {
    let component: AddPollingSourceComponent;
    let fixture: ComponentFixture<AddPollingSourceComponent>;
    let modalService: NgbModal;
    let modalRef: NgbModalRef;

    let datasetCommitService: DatasetCommitService;
    let datasetService: DatasetService;
    let datasetSubsService: DatasetSubscriptionsService;
    let navigationService: NavigationService;
    let loggedUserService: LoggedUserService;

    const MOCK_EVENT_YAML = "test_tyaml";

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [
                AddPollingSourceComponent,
                StepperNavigationComponent,
                BaseStepComponent,
                PrepareStepComponent,
                PreprocessStepComponent,
            ],
            imports: [
                ApolloTestingModule,
                BrowserAnimationsModule,
                FormsModule,
                NgbModule,
                MatStepperModule,
                PollingSourceFormComponentsModule,
                ReactiveFormsModule,
                HttpClientTestingModule,
                EditorModule,
            ],
            providers: [
                FormBuilder,
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
        })
            .overrideComponent(AddPollingSourceComponent, {
                set: { changeDetection: ChangeDetectionStrategy.Default },
            })
            .compileComponents();

        fixture = TestBed.createComponent(AddPollingSourceComponent);
        modalService = TestBed.inject(NgbModal);
        datasetSubsService = TestBed.inject(DatasetSubscriptionsService);
        datasetCommitService = TestBed.inject(DatasetCommitService);
        datasetService = TestBed.inject(DatasetService);
        navigationService = TestBed.inject(NavigationService);
        loggedUserService = TestBed.inject(LoggedUserService);

        modalRef = modalService.open(FinalYamlModalComponent);
        component = fixture.componentInstance;
        component.showPreprocessStep = false;
        component.eventYamlByHash = MOCK_EVENT_YAML;
        component.currentStep = SetPollingSourceSection.FETCH;
        component.history = {
            history: mockDatasetHistoryResponse.datasets.byOwnerAndName?.metadata.chain.blocks
                .nodes as MetadataBlockFragment[],
            pageInfo: mockDatasetHistoryResponse.datasets.byOwnerAndName?.metadata.chain.blocks
                .pageInfo as DatasetPageInfoFragment,
        };
        component.pollingSourceForm = new FormGroup({
            fetch: new FormGroup({
                kind: new FormControl(FetchKind.URL),
                url: new FormControl(""),
                order: new FormControl("NONE"),
                eventTime: new FormGroup({
                    kind: new FormControl(EventTimeSourceKind.FROM_METADATA),
                    timestampFormat: new FormControl(""),
                }),
                cache: new FormControl(false),
                headers: new FormArray([]),
            }),
            read: new FormGroup({
                kind: new FormControl(ReadKind.CSV),
                schema: new FormArray([
                    new FormGroup({
                        name: new FormControl("id"),
                        type: new FormControl("BIGINT"),
                    }),
                ]),
                header: new FormControl(OdfDefaultValues.CSV_HEADER),
                encoding: new FormControl(OdfDefaultValues.CSV_ENCODING),
                separator: new FormControl(OdfDefaultValues.CSV_SEPARATOR),
                quote: new FormControl(OdfDefaultValues.CSV_QUOTE),
                escape: new FormControl(OdfDefaultValues.CSV_ESCAPE),
                nullValue: new FormControl(OdfDefaultValues.CSV_NULL_VALUE),
                dateFormat: new FormControl(OdfDefaultValues.CSV_DATE_FORMAT),
                timestampFormat: new FormControl(OdfDefaultValues.CSV_TIMESTAMP_FORMAT),
                inferSchema: new FormControl(OdfDefaultValues.CSV_INFER_SCHEMA),
            }),
            merge: new FormGroup({
                kind: new FormControl(MergeKind.APPEND),
            }),
            prepare: new FormArray([]),
        });
        spyOnProperty(loggedUserService, "currentlyLoggedInUser", "get").and.returnValue(mockAccountDetails);
        component.ngOnInit();
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });

    it("check dataset editability passes for root dataset with full permissions", () => {
        const navigateToDatasetViewSpy = spyOn(navigationService, "navigateToDatasetView").and.stub();
        const clonePermissions = structuredClone(mockFullPowerDatasetPermissionsFragment);
        clonePermissions.permissions.metadata.canCommit = true;
        datasetService.emitDatasetChanged(mockDatasetBasicsRootFragment);
        datasetSubsService.emitPermissionsChanged(clonePermissions);

        expect(navigateToDatasetViewSpy).not.toHaveBeenCalled();
    });

    it("check dataset editability fails without commit permission", () => {
        const navigateToDatasetViewSpy = spyOn(navigationService, "navigateToDatasetView").and.stub();

        datasetService.emitDatasetChanged(mockDatasetBasicsRootFragment);
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
            accountName: mockDatasetBasicsRootFragment.owner.accountName,
            datasetName: mockDatasetBasicsRootFragment.name,
            tab: DatasetViewTypeEnum.Overview,
        } as DatasetNavigationParams);
    });

    it("check dataset editability fails upon derived dataset", () => {
        const navigateToDatasetViewSpy = spyOn(navigationService, "navigateToDatasetView").and.stub();

        datasetService.emitDatasetChanged(mockDatasetBasicsDerivedFragment);
        datasetSubsService.emitPermissionsChanged(mockFullPowerDatasetPermissionsFragment);

        expect(navigateToDatasetViewSpy).toHaveBeenCalledWith({
            accountName: mockDatasetBasicsDerivedFragment.owner.accountName,
            datasetName: mockDatasetBasicsDerivedFragment.name,
            tab: DatasetViewTypeEnum.Overview,
        } as DatasetNavigationParams);
    });

    it("should check open edit modal", () => {
        component.ngOnInit();
        const openModalSpy = spyOn(modalService, "open").and.returnValue(modalRef);
        component.onEditYaml();
        expect(openModalSpy).toHaveBeenCalledTimes(1);
    });

    it("should check open edit modal after error", () => {
        const mockError = "Some error";
        expect(component.errorMessage).toBe("");
        expect(component.changedEventYamlByHash).toBeNull();
        datasetCommitService.emitCommitEventErrorOccurred(mockError);
        expect(component.errorMessage).toBe(mockError);

        component.onEditYaml();
        const modal = modalService.open(FinalYamlModalComponent, {
            size: "lg",
        });

        from(modal.result).subscribe(() => {
            expect(component.changedEventYamlByHash).toBeDefined();
        });
    });

    it("should check eventYamlByHash is not null", () => {
        component.ngOnInit();
        expect(component.eventYamlByHash).toEqual(MOCK_EVENT_YAML);
    });

    it("should check submit yaml", () => {
        component.ngOnInit();
        const submitYamlSpy = spyOn(datasetCommitService, "commitEventToDataset").and.returnValue(of());
        component.onSaveEvent();
        expect(submitYamlSpy).toHaveBeenCalledTimes(1);
    });

    it("should check change step", () => {
        component.changeStep(SetPollingSourceSection.READ);
        fixture.detectChanges();
        expect(component.currentStep).toBe(SetPollingSourceSection.READ);

        component.changeStep(SetPollingSourceSection.MERGE);
        fixture.detectChanges();
        expect(component.currentStep).toBe(SetPollingSourceSection.MERGE);
    });

    it("should check error message", () => {
        const errorMessage = "test error message";
        expect(component.errorMessage).toBe("");

        datasetCommitService.emitCommitEventErrorOccurred(errorMessage);
        expect(component.errorMessage).toBe(errorMessage);
    });

    it("should check change showPreprocessStep property", () => {
        expect(component.showPreprocessStep).toEqual(false);
        component.onShowPreprocessStep(true);
        expect(component.showPreprocessStep).toEqual(true);
    });
});
