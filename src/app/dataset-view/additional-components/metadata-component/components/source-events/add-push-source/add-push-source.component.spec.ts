/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { ComponentFixture, TestBed } from "@angular/core/testing";
import { AddPushSourceComponent } from "./add-push-source.component";
import { FormArray, FormControl, FormGroup, FormsModule, ReactiveFormsModule } from "@angular/forms";
import { ApolloModule } from "apollo-angular";
import { ApolloTestingModule } from "apollo-angular/testing";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { DatasetCommitService } from "../../../../overview-component/services/dataset-commit.service";
import { from, of } from "rxjs";
import { NgbModal, NgbModalRef } from "@ng-bootstrap/ng-bootstrap";
import { FinalYamlModalComponent } from "../../final-yaml-modal/final-yaml-modal.component";
import { EditorModule } from "src/app/editor/editor.module";
import { ActivatedRoute, RouterModule } from "@angular/router";
import { EditAddPushSourceService } from "./edit-add-push-source.service";
import { mockDatasetHistoryResponse, mockDatasetInfo } from "src/app/search/mock.data";
import { DatasetPageInfoFragment, MetadataBlockFragment } from "src/app/api/kamu.graphql.interface";
import { StepperNavigationComponent } from "../../stepper-navigation/stepper-navigation.component";
import { BaseStepComponent } from "../steps/base-step/base-step.component";
import { MatStepperModule } from "@angular/material/stepper";
import { PollingSourceFormComponentsModule } from "../../form-components/polling-source-form-components.module";
import { SourceNameStepComponent } from "../steps/source-name-step/source-name-step.component";
import { PreprocessStepComponent } from "../steps/preprocess-step/preprocess-step.component";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { NavigationService } from "src/app/services/navigation.service";
import { MergeKind, ReadKind } from "../add-polling-source/add-polling-source-form.types";
import { LoggedUserService } from "src/app/auth/logged-user.service";
import { mockAccountDetails } from "src/app/api/mock/auth.mock";
import { AddPushSourceSection } from "./add-push-source-form.types";
import { mockAddPushSourceYaml } from "../../set-transform/mock.data";

const providersSection = (name: string) => {
    return [
        {
            provide: ActivatedRoute,
            useValue: {
                data: of({ addPushSourceData: name }),
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
    ];
};

describe("AddPushSourceComponent with query parameter name", () => {
    let component: AddPushSourceComponent;
    let fixture: ComponentFixture<AddPushSourceComponent>;
    let datasetCommitService: DatasetCommitService;
    let editService: EditAddPushSourceService;
    let navigationService: NavigationService;
    let loggedUserService: LoggedUserService;
    let modalService: NgbModal;
    let modalRef: NgbModalRef;
    const datasetHistoryResponse = mockDatasetHistoryResponse.datasets.byOwnerAndName?.metadata.chain.blocks;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [
                AddPushSourceComponent,
                SourceNameStepComponent,
                StepperNavigationComponent,
                BaseStepComponent,
                PreprocessStepComponent,
            ],
            providers: providersSection(mockAddPushSourceYaml),
            imports: [
                ReactiveFormsModule,
                ApolloModule,
                ApolloTestingModule,
                HttpClientTestingModule,
                EditorModule,
                FormsModule,
                BrowserAnimationsModule,
                MatStepperModule,
                PollingSourceFormComponentsModule,
                RouterModule,
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(AddPushSourceComponent);
        modalService = TestBed.inject(NgbModal);
        modalRef = modalService.open(FinalYamlModalComponent);
        datasetCommitService = TestBed.inject(DatasetCommitService);
        editService = TestBed.inject(EditAddPushSourceService);
        navigationService = TestBed.inject(NavigationService);
        loggedUserService = TestBed.inject(LoggedUserService);
        component = fixture.componentInstance;
        component.eventYamlByHash = mockAddPushSourceYaml;
        component.queryParamName = "mockSourceName";
        component.datasetInfo = mockDatasetInfo;
        editService.history = {
            history: datasetHistoryResponse?.nodes as MetadataBlockFragment[],
            pageInfo: datasetHistoryResponse?.pageInfo as DatasetPageInfoFragment,
        };
        component.addPushSourceForm = new FormGroup({
            sourceName: new FormControl(""),
            read: new FormGroup({
                kind: new FormControl(ReadKind.CSV),
                schema: new FormArray([
                    new FormGroup({
                        name: new FormControl("id"),
                        type: new FormControl("BIGINT"),
                    }),
                ]),
            }),
            merge: new FormGroup({
                kind: new FormControl(MergeKind.APPEND),
            }),
            prepare: new FormArray([]),
        });
        spyOnProperty(loggedUserService, "currentlyLoggedInUser", "get").and.returnValue(mockAccountDetails);
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });

    it("should check onSave method", () => {
        const commitEventToDatasetSpy = spyOn(datasetCommitService, "commitEventToDataset").and.returnValue(of());
        component.onSaveEvent();
        expect(commitEventToDatasetSpy).toHaveBeenCalledTimes(1);
    });

    it("should check eventYamlByHash is not null", () => {
        component.ngOnInit();
        expect(component.eventYamlByHash).toEqual(mockAddPushSourceYaml);
    });

    it("should check navigate to PageNotFoundComponent ", () => {
        editService.history = {
            // Deleted "AddPushSource" event from history
            history: (datasetHistoryResponse?.nodes as MetadataBlockFragment[]).splice(5, 1),
            pageInfo: datasetHistoryResponse?.pageInfo as DatasetPageInfoFragment,
        };
        const navigateToPageNotFoundSpy = spyOn(navigationService, "navigateToPageNotFound");
        const mockEventYamlByHash =
            "kind: MetadataBlock\nversion: 2\ncontent:\n  systemTime: 2023-12-28T09:41:56.469218218Z\n  prevBlockHash: zW1jaUXuf1HLoKvdQhYNq1e3x6KCFrY7UCqXsgVMfJBJF77\n  sequenceNumber: 1\n  event:\n    kind: AddPushSource\n    sourceName: mockSource\n    read:\n      kind: Csv\n      schema:\n      - id INT\n      separator: ','\n      encoding: utf8\n      quote: '\"'\n      escape: \\\n      dateFormat: rfc3339\n      timestampFormat: rfc3339\n    merge:\n      kind: Append\n";
        spyOn(editService, "getEventAsYaml").and.returnValue(of(mockEventYamlByHash));
        component.ngOnInit();
        expect(navigateToPageNotFoundSpy).toHaveBeenCalledWith();
    });

    it("should check change step", () => {
        component.changeStep(AddPushSourceSection.READ);
        fixture.detectChanges();
        expect(component.currentStep).toBe(AddPushSourceSection.READ);

        component.changeStep(AddPushSourceSection.MERGE);
        fixture.detectChanges();
        expect(component.currentStep).toBe(AddPushSourceSection.MERGE);
    });

    it("should check change showPreprocessStep property", () => {
        expect(component.showPreprocessStep).toEqual(false);
        component.onShowPreprocessStep(true);
        expect(component.showPreprocessStep).toEqual(true);
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
        datasetCommitService.emitCommitEventErrorOccurred(mockError);

        component.onEditYaml();
        const modal = modalService.open(FinalYamlModalComponent, {
            size: "lg",
        });

        from(modal.result).subscribe(() => {
            expect(component.changedEventYamlByHash).toBeDefined();
        });
    });
});

describe("AddPushSourceComponent without query parameter name", () => {
    let component: AddPushSourceComponent;
    let fixture: ComponentFixture<AddPushSourceComponent>;
    let editService: EditAddPushSourceService;
    const datasetHistoryResponse = mockDatasetHistoryResponse.datasets.byOwnerAndName?.metadata.chain.blocks;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [
                AddPushSourceComponent,
                SourceNameStepComponent,
                StepperNavigationComponent,
                BaseStepComponent,
                PreprocessStepComponent,
            ],
            providers: providersSection(""),
            imports: [
                ReactiveFormsModule,
                ApolloModule,
                ApolloTestingModule,
                HttpClientTestingModule,
                EditorModule,
                FormsModule,
                BrowserAnimationsModule,
                MatStepperModule,
                PollingSourceFormComponentsModule,
                RouterModule,
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(AddPushSourceComponent);
        editService = TestBed.inject(EditAddPushSourceService);
        component = fixture.componentInstance;
        component.queryParamName = "";
        component.eventYamlByHash = mockAddPushSourceYaml;
        component.datasetInfo = mockDatasetInfo;
        component.addPushSourceForm = new FormGroup({
            sourceName: new FormControl("mockName"),
            read: new FormGroup({
                kind: new FormControl(ReadKind.CSV),
                schema: new FormArray([
                    new FormGroup({
                        name: new FormControl("id"),
                        type: new FormControl("BIGINT"),
                    }),
                ]),
            }),
            merge: new FormGroup({
                kind: new FormControl(MergeKind.APPEND),
            }),
            prepare: new FormArray([]),
        });
        editService.history = {
            history: datasetHistoryResponse?.nodes as MetadataBlockFragment[],
            pageInfo: datasetHistoryResponse?.pageInfo as DatasetPageInfoFragment,
        };
        fixture.detectChanges();
    });

    it("should check add validator when query parameter name equal null", () => {
        const addValidatorSpy = spyOn(component.addPushSourceForm.controls.sourceName, "addValidators");
        component.ngOnInit();
        expect(addValidatorSpy).toHaveBeenCalledTimes(1);
    });
});
