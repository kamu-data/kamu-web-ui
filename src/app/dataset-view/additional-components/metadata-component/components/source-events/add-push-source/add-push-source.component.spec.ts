/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { ComponentFixture, TestBed } from "@angular/core/testing";
import { AddPushSourceComponent } from "./add-push-source.component";
import { FormArray, FormControl, FormGroup } from "@angular/forms";
import { DatasetCommitService } from "../../../../overview-component/services/dataset-commit.service";
import { from, of } from "rxjs";
import { NgbModal, NgbModalRef } from "@ng-bootstrap/ng-bootstrap";
import { FinalYamlModalComponent } from "../../final-yaml-modal/final-yaml-modal.component";
import { ActivatedRoute } from "@angular/router";
import { mockDatasetInfo } from "src/app/search/mock.data";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { MergeKind, ReadKind } from "../add-polling-source/add-polling-source-form.types";
import { LoggedUserService } from "src/app/auth/logged-user.service";
import { mockAccountDetails } from "src/app/api/mock/auth.mock";
import { AddPushSourceSection } from "./add-push-source-form.types";
import { mockAddPushSourceYaml } from "../../set-transform/mock.data";
import { Apollo } from "apollo-angular";

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
    let loggedUserService: LoggedUserService;
    let modalService: NgbModal;
    let modalRef: NgbModalRef;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            providers: [...providersSection(mockAddPushSourceYaml), Apollo],
            imports: [BrowserAnimationsModule, AddPushSourceComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(AddPushSourceComponent);
        modalService = TestBed.inject(NgbModal);
        modalRef = modalService.open(FinalYamlModalComponent);
        datasetCommitService = TestBed.inject(DatasetCommitService);
        loggedUserService = TestBed.inject(LoggedUserService);
        component = fixture.componentInstance;
        component.eventYamlByHash = mockAddPushSourceYaml;
        component.queryParamName = "mockSourceName";
        component.datasetInfo = mockDatasetInfo;
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

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            providers: [providersSection(""), Apollo],
            imports: [BrowserAnimationsModule, AddPushSourceComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(AddPushSourceComponent);
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

        fixture.detectChanges();
    });

    it("should check add validator when query parameter name equal null", () => {
        const addValidatorSpy = spyOn(component.addPushSourceForm.controls.sourceName, "addValidators");
        component.ngOnInit();
        expect(addValidatorSpy).toHaveBeenCalledTimes(1);
    });
});
