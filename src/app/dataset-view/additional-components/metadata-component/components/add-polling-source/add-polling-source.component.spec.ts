import { CUSTOM_ELEMENTS_SCHEMA, ChangeDetectionStrategy } from "@angular/core";
import { Apollo } from "apollo-angular";
import { ApolloTestingModule } from "apollo-angular/testing";
import { FormBuilder, FormsModule, ReactiveFormsModule } from "@angular/forms";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { AddPollingSourceComponent } from "./add-polling-source.component";
import { ActivatedRoute } from "@angular/router";
import { NgbModal, NgbModalRef, NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { FinalYamlModalComponent } from "../final-yaml-modal/final-yaml-modal.component";
import { AppDatasetCreateService } from "src/app/dataset-create/dataset-create.service";
import { Observable } from "rxjs";
import { SetPollingSourceSection } from "src/app/shared/shared.types";

describe("AddPollingSourceComponent", () => {
    let component: AddPollingSourceComponent;
    let fixture: ComponentFixture<AddPollingSourceComponent>;
    let modalService: NgbModal;
    let modalRef: NgbModalRef;
    let createDatasetService: AppDatasetCreateService;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [AddPollingSourceComponent],
            imports: [
                ApolloTestingModule,
                ReactiveFormsModule,
                FormsModule,
                NgbModule,
            ],
            schemas: [CUSTOM_ELEMENTS_SCHEMA],
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
        createDatasetService = TestBed.inject(AppDatasetCreateService);
        modalRef = modalService.open(FinalYamlModalComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });

    it("should check open edit modal", () => {
        component.ngOnInit();
        const openModalSpy = spyOn(modalService, "open").and.returnValue(
            modalRef,
        );
        component.onEditYaml();
        expect(openModalSpy).toHaveBeenCalledTimes(1);
    });

    it("should check submit yaml", () => {
        component.ngOnInit();
        const submitYamlSpy = spyOn(
            createDatasetService,
            "commitEventToDataset",
        ).and.returnValue(new Observable());
        component.onSubmit();
        expect(submitYamlSpy).toHaveBeenCalledTimes(1);
    });

    it("should check change step", () => {
        component.ngOnInit();
        expect(component.currentStep).toBe(SetPollingSourceSection.FETCH);
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
        createDatasetService.errorCommitEventChanges(errorMessage);
        component.ngOnInit();
        expect(component.errorMessage).toBe(errorMessage);
    });
});
