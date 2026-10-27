/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { provideHttpClient } from "@angular/common/http";
import { provideHttpClientTesting } from "@angular/common/http/testing";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { ActivatedRoute } from "@angular/router";

import { from, of } from "rxjs";

import { NgbModal, NgbModalRef } from "@ng-bootstrap/ng-bootstrap";
import { Apollo } from "apollo-angular";
import { ApolloTestingModule } from "apollo-angular/testing";

import { registerMatSvgIcons, setComponentInput } from "@common/helpers/base-test.helpers.spec";
import { mockAccountDetails } from "@api/mock/auth.mock";

import { LoggedUserService } from "src/app/auth/logged-user.service";
import { FinalYamlModalComponent } from "src/app/dataset-view/additional-components/metadata-component/components/final-yaml-modal/final-yaml-modal.component";
import {
    mockAddPushSourceYaml,
    mockAddPushSourceYamlWithPreprocess,
} from "src/app/dataset-view/additional-components/metadata-component/components/set-transform/mock.data";
import { AddPushSourceSection } from "src/app/dataset-view/additional-components/metadata-component/components/source-events/add-push-source/add-push-source-form.types";
import { AddPushSourceComponent } from "src/app/dataset-view/additional-components/metadata-component/components/source-events/add-push-source/add-push-source.component";
import { DatasetCommitService } from "src/app/dataset-view/additional-components/overview-component/services/dataset-commit.service";
import { mockDatasetInfo } from "src/app/search/mock.data";

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
            providers: [
                ...providersSection(mockAddPushSourceYaml),
                Apollo,
                provideHttpClient(),
                provideHttpClientTesting(),
            ],
            imports: [ApolloTestingModule, AddPushSourceComponent],
        }).compileComponents();

        registerMatSvgIcons();

        fixture = TestBed.createComponent(AddPushSourceComponent);
        modalService = TestBed.inject(NgbModal);
        modalRef = modalService.open(FinalYamlModalComponent);
        datasetCommitService = TestBed.inject(DatasetCommitService);
        loggedUserService = TestBed.inject(LoggedUserService);
        component = fixture.componentInstance;
        setComponentInput(fixture, "eventYamlByHash", mockAddPushSourceYaml);
        setComponentInput(fixture, "queryParamName", "mockSourceName");
        setComponentInput(fixture, "datasetInfo", mockDatasetInfo);
        vi.spyOn(loggedUserService, "currentlyLoggedInUser", "get").mockReturnValue(mockAccountDetails);
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });

    it("should check onSave method", () => {
        const commitEventToDatasetSpy = vi.spyOn(datasetCommitService, "commitEventToDataset").mockReturnValue(of());
        component.onSaveEvent();
        expect(commitEventToDatasetSpy).toHaveBeenCalledTimes(1);
    });

    it("should check eventYamlByHash is not null", () => {
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

    it("should check an existing preprocess step is shown when the editor opens", () => {
        fixture = TestBed.createComponent(AddPushSourceComponent);
        component = fixture.componentInstance;
        setComponentInput(fixture, "eventYamlByHash", mockAddPushSourceYamlWithPreprocess);
        setComponentInput(fixture, "queryParamName", "mockSourceName");
        setComponentInput(fixture, "datasetInfo", mockDatasetInfo);
        fixture.detectChanges();
        expect(component.showPreprocessStep).toEqual(true);
    });

    it("should check open edit modal", () => {
        const openModalSpy = vi.spyOn(modalService, "open").mockReturnValue(modalRef);
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
            providers: [providersSection(""), Apollo, provideHttpClient(), provideHttpClientTesting()],
            imports: [ApolloTestingModule, AddPushSourceComponent],
        }).compileComponents();

        registerMatSvgIcons();

        fixture = TestBed.createComponent(AddPushSourceComponent);
        component = fixture.componentInstance;
        setComponentInput(fixture, "queryParamName", "");
        setComponentInput(fixture, "eventYamlByHash", mockAddPushSourceYaml);
        setComponentInput(fixture, "datasetInfo", mockDatasetInfo);
    });

    it("should check add validator when query parameter name equal null", () => {
        const addValidatorSpy = vi
            .spyOn(component.addPushSourceForm.controls.sourceName, "addValidators")
            .mockImplementation(() => {});
        fixture.detectChanges();
        expect(addValidatorSpy).toHaveBeenCalledTimes(1);
    });
});
