import { ComponentFixture, TestBed } from "@angular/core/testing";
import { AddPushSourceComponent } from "./add-push-source.component";
import { FormArray, FormControl, FormGroup, ReactiveFormsModule } from "@angular/forms";
import { ApolloModule } from "apollo-angular";
import { ApolloTestingModule } from "apollo-angular/testing";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { DatasetCommitService } from "../../../overview-component/services/dataset-commit.service";
import { from, of } from "rxjs";
import { AddPushSourceSection } from "src/app/shared/shared.types";
import { NgbModal, NgbModalRef } from "@ng-bootstrap/ng-bootstrap";
import { FinalYamlModalComponent } from "../final-yaml-modal/final-yaml-modal.component";
import { EditorModule } from "src/app/shared/editor/editor.module";
import { ActivatedRoute, Router } from "@angular/router";
import { EditAddPushSourceService } from "./edit-add-push-source.service";
import { RouterTestingModule } from "@angular/router/testing";
import { PageNotFoundComponent } from "src/app/components/page-not-found/page-not-found.component";
import ProjectLinks from "src/app/project-links";

describe("AddPushSourceComponent", () => {
    let component: AddPushSourceComponent;
    let fixture: ComponentFixture<AddPushSourceComponent>;
    let datasetCommitService: DatasetCommitService;
    let editService: EditAddPushSourceService;
    let modalService: NgbModal;
    let modalRef: NgbModalRef;
    let router: Router;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [AddPushSourceComponent],
            providers: [
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
                            queryParamMap: {
                                get: (key: string) => {
                                    switch (key) {
                                        case "name":
                                            return "mockName";
                                    }
                                },
                            },
                        },
                    },
                },
            ],
            imports: [
                ReactiveFormsModule,
                ApolloModule,
                ApolloTestingModule,
                HttpClientTestingModule,
                EditorModule,
                RouterTestingModule.withRoutes([
                    {
                        path: ProjectLinks.URL_PAGE_NOT_FOUND,
                        component: PageNotFoundComponent,
                    },
                ]),
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(AddPushSourceComponent);
        router = TestBed.inject(Router);
        modalService = TestBed.inject(NgbModal);
        modalRef = modalService.open(FinalYamlModalComponent);
        datasetCommitService = TestBed.inject(DatasetCommitService);
        editService = TestBed.inject(EditAddPushSourceService);
        fixture.ngZone?.run(() => {
            router.initialNavigation();
        });
        component = fixture.componentInstance;
        component.addPushSourceForm = new FormGroup({
            read: new FormGroup({
                kind: new FormControl("csv"),
                schema: new FormArray([
                    new FormGroup({
                        name: new FormControl("id"),
                        type: new FormControl("BIGINT"),
                    }),
                ]),
            }),
            merge: new FormGroup({
                kind: new FormControl("append"),
            }),
            prepare: new FormArray([]),
        });
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
        const mockEventYamlByHash =
            "kind: MetadataBlock\nversion: 2\ncontent:\n  systemTime: 2023-12-28T09:41:56.469218218Z\n  prevBlockHash: zW1jaUXuf1HLoKvdQhYNq1e3x6KCFrY7UCqXsgVMfJBJF77\n  sequenceNumber: 1\n  event:\n    kind: addPushSource\n    sourceName: mockSource\n    read:\n      kind: csv\n      schema:\n      - id INT\n      separator: ','\n      encoding: utf8\n      quote: '\"'\n      escape: \\\n      enforceSchema: true\n      nanValue: NaN\n      positiveInf: Inf\n      negativeInf: -Inf\n      dateFormat: rfc3339\n      timestampFormat: rfc3339\n    merge:\n      kind: append\n";
        spyOn(editService, "getEventAsYaml").and.returnValue(of(mockEventYamlByHash));
        component.ngOnInit();
        expect(component.eventYamlByHash).toEqual(mockEventYamlByHash);
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
        component.onShowPreprcessStep(true);
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
});
