import { ChangeDetectionStrategy } from "@angular/core";
import { Apollo } from "apollo-angular";
import { ApolloTestingModule } from "apollo-angular/testing";
import { FormArray, FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule } from "@angular/forms";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { AddPollingSourceComponent } from "./add-polling-source.component";
import { NgbModal, NgbModalRef, NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { FinalYamlModalComponent } from "../final-yaml-modal/final-yaml-modal.component";
import { SetPollingSourceSection } from "src/app/shared/shared.types";
import { MonacoEditorModule } from "ngx-monaco-editor";
import { StepperNavigationComponent } from "../stepper-navigation/stepper-navigation.component";
import { BaseStepComponent } from "./steps/base-step/base-step.component";
import { PollingSourceFormComponentsModule } from "../form-components/polling-source-form-components.module";
import { of, from } from "rxjs";
import { mockDatasetHistoryResponse } from "src/app/search/mock.data";
import { DatasetKind, DatasetPageInfoFragment, MetadataBlockFragment } from "src/app/api/kamu.graphql.interface";
import { EditPollingSourceService } from "./edit-polling-source.service";
import { SharedTestModule } from "src/app/common/shared-test.module";
import { DatasetCommitService } from "../../../overview-component/services/dataset-commit.service";

describe("AddPollingSourceComponent", () => {
    let component: AddPollingSourceComponent;
    let fixture: ComponentFixture<AddPollingSourceComponent>;
    let modalService: NgbModal;
    let modalRef: NgbModalRef;
    let datasetCommitService: DatasetCommitService;
    let editService: EditPollingSourceService;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [AddPollingSourceComponent, StepperNavigationComponent, BaseStepComponent],
            imports: [
                ApolloTestingModule,
                ReactiveFormsModule,
                FormsModule,
                NgbModule,
                MonacoEditorModule.forRoot(),
                PollingSourceFormComponentsModule,
                SharedTestModule,
            ],
            providers: [FormBuilder, Apollo],
        })
            .overrideComponent(AddPollingSourceComponent, {
                set: { changeDetection: ChangeDetectionStrategy.Default },
            })
            .compileComponents();

        fixture = TestBed.createComponent(AddPollingSourceComponent);
        modalService = TestBed.inject(NgbModal);
        editService = TestBed.inject(EditPollingSourceService);

        datasetCommitService = TestBed.inject(DatasetCommitService);
        modalRef = modalService.open(FinalYamlModalComponent);
        component = fixture.componentInstance;
        component.showPreprocessStep = false;
        component.currentStep = SetPollingSourceSection.FETCH;
        component.history = {
            history: mockDatasetHistoryResponse.datasets.byOwnerAndName?.metadata.chain.blocks
                .nodes as MetadataBlockFragment[],
            pageInfo: mockDatasetHistoryResponse.datasets.byOwnerAndName?.metadata.chain.blocks
                .pageInfo as DatasetPageInfoFragment,
        };
        component.pollingSourceForm = new FormGroup({
            fetch: new FormGroup({
                kind: new FormControl("url"),
                url: new FormControl(""),
                order: new FormControl("NONE"),
                eventTime: new FormGroup({
                    kind: new FormControl("fromMetadata"),
                    timestampFormat: new FormControl(""),
                }),
                cache: new FormControl(false),
            }),
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
        });
        component.ngOnInit();
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
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
        expect(component.changedEventYamlByHash).toBeUndefined();
        datasetCommitService.errorCommitEventChanges(mockError);
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
        const mockEventYamlByHash = "test_tyaml";
        spyOn(editService, "getEventAsYaml").and.returnValue(of(mockEventYamlByHash));
        component.ngOnInit();
        expect(component.eventYamlByHash).toEqual(mockEventYamlByHash);
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

        datasetCommitService.errorCommitEventChanges(errorMessage);
        expect(component.errorMessage).toBe(errorMessage);
    });

    it("should check init dataset kind", () => {
        expect(component.datasetKind).toBeUndefined();
        editService.changeKindChanges(DatasetKind.Root);
        editService.onKindChanges.subscribe(() => {
            expect(component.datasetKind).toEqual(DatasetKind.Root);
        });
    });

    it("should check change showPreprocessStep property", () => {
        expect(component.showPreprocessStep).toEqual(false);
        component.onShowPreprcessStep(true);
        expect(component.showPreprocessStep).toEqual(true);
    });
});
