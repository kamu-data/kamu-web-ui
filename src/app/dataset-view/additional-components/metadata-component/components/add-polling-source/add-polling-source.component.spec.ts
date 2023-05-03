import { ChangeDetectionStrategy } from "@angular/core";
import { Apollo } from "apollo-angular";
import { ApolloTestingModule } from "apollo-angular/testing";
import { FormBuilder, FormsModule, ReactiveFormsModule } from "@angular/forms";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { AddPollingSourceComponent } from "./add-polling-source.component";
import { NgbModal, NgbModalRef, NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { FinalYamlModalComponent } from "../final-yaml-modal/final-yaml-modal.component";
import { AppDatasetCreateService } from "src/app/dataset-create/dataset-create.service";
import { SetPollingSourceSection } from "src/app/shared/shared.types";
import { MonacoEditorModule } from "ngx-monaco-editor";
import { StepperNavigationComponent } from "../stepper-navigation/stepper-navigation.component";
import { BaseStepComponent } from "./steps/base-step/base-step.component";
import { PollingSourceFormComponentsModule } from "../form-components/polling-source-form-components.module";
import { snapshotParamMapMock } from "src/app/common/base-test.helpers.spec";
import { of } from "rxjs";

describe("AddPollingSourceComponent", () => {
    let component: AddPollingSourceComponent;
    let fixture: ComponentFixture<AddPollingSourceComponent>;
    let modalService: NgbModal;
    let modalRef: NgbModalRef;
    let createDatasetService: AppDatasetCreateService;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [
                AddPollingSourceComponent,
                StepperNavigationComponent,
                BaseStepComponent,
            ],
            imports: [
                ApolloTestingModule,
                ReactiveFormsModule,
                FormsModule,
                NgbModule,
                MonacoEditorModule.forRoot(),
                PollingSourceFormComponentsModule,
            ],
            providers: [FormBuilder, Apollo, snapshotParamMapMock],
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
        component.currentStep = SetPollingSourceSection.FETCH;
        component.ngOnInit();
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
        ).and.returnValue(of());
        component.onSubmit();
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

        createDatasetService.errorCommitEventChanges(errorMessage);
        expect(component.errorMessage).toBe(errorMessage);
    });
});
