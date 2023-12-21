import { ComponentFixture, TestBed } from "@angular/core/testing";
import { AddPushSourceComponent } from "./add-push-source.component";
import { FormArray, FormControl, FormGroup, ReactiveFormsModule } from "@angular/forms";
import { ApolloModule } from "apollo-angular";
import { ApolloTestingModule } from "apollo-angular/testing";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { SharedTestModule } from "src/app/common/shared-test.module";
import { DatasetCommitService } from "../../../overview-component/services/dataset-commit.service";
import { from, of } from "rxjs";
import { EditPollingSourceService } from "../add-polling-source/edit-polling-source.service";
import { AddPushSourceSection } from "src/app/shared/shared.types";
import { NgbModal, NgbModalRef } from "@ng-bootstrap/ng-bootstrap";
import { FinalYamlModalComponent } from "../final-yaml-modal/final-yaml-modal.component";
import { EditorModule } from "src/app/shared/editor/editor.module";

describe("AddPushSourceComponent", () => {
    let component: AddPushSourceComponent;
    let fixture: ComponentFixture<AddPushSourceComponent>;
    let datasetCommitService: DatasetCommitService;
    let editService: EditPollingSourceService;
    let modalService: NgbModal;
    let modalRef: NgbModalRef;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [AddPushSourceComponent],
            imports: [
                ReactiveFormsModule,
                ApolloModule,
                ApolloTestingModule,
                HttpClientTestingModule,
                SharedTestModule,
                EditorModule,
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(AddPushSourceComponent);
        modalService = TestBed.inject(NgbModal);
        modalRef = modalService.open(FinalYamlModalComponent);
        datasetCommitService = TestBed.inject(DatasetCommitService);
        editService = TestBed.inject(EditPollingSourceService);
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
        const mockEventYamlByHash = "test_tyaml";
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
