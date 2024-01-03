import { ComponentFixture, TestBed } from "@angular/core/testing";
import { FormArray, FormBuilder, FormControl, FormGroupDirective, ReactiveFormsModule } from "@angular/forms";
import { BaseStepComponent } from "./base-step.component";
import { FetchKind } from "../../add-polling-source/add-polling-source-form.types";
import { FETCH_FORM_DATA } from "../data/fetch-form-data";
import { FETCH_STEP_RADIO_CONTROLS } from "../../add-polling-source/form-control.source";
import { SetPollingSourceSection } from "src/app/shared/shared.types";
import { TooltipIconComponent } from "src/app/dataset-block/metadata-block/components/tooltip-icon/tooltip-icon.component";
import { NgbTooltipModule } from "@ng-bootstrap/ng-bootstrap";
import { PollingSourceFormComponentsModule } from "../../../form-components/polling-source-form-components.module";
import { emitClickOnElementByDataTestId } from "src/app/common/base-test.helpers.spec";
import { Apollo } from "apollo-angular";
import { DatasetApi } from "src/app/api/dataset.api";
import { SharedTestModule } from "src/app/common/shared-test.module";

const fb = new FormBuilder();
export const formGroupDirective = new FormGroupDirective([], []);
formGroupDirective.form = fb.group({
    fetch: fb.group({
        kind: new FormControl(FetchKind.URL),
    }),
    prepare: new FormArray([]),
});

describe("BaseStepComponent", () => {
    let component: BaseStepComponent;
    let fixture: ComponentFixture<BaseStepComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [BaseStepComponent, TooltipIconComponent],
            imports: [ReactiveFormsModule, NgbTooltipModule, PollingSourceFormComponentsModule, SharedTestModule],
            providers: [
                Apollo,
                DatasetApi,
                FormGroupDirective,
                FormBuilder,
                { provide: FormGroupDirective, useValue: formGroupDirective },
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(BaseStepComponent);
        component = fixture.componentInstance;
        component.defaultKind = FetchKind.URL;
        component.sectionFormData = FETCH_FORM_DATA;
        component.sectionStepRadioData = FETCH_STEP_RADIO_CONTROLS;
        component.sectionName = SetPollingSourceSection.FETCH;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });

    it("should check update fetch step form", () => {
        const expectedUrlForm = {
            kind: "url",
            url: "",
            eventTime: { kind: "fromMetadata" },
            headers: [],
            cache: "",
        };
        const expectedFilesGlobForm = {
            kind: "filesGlob",
            path: "",
            eventTime: { kind: "fromMetadata" },
            order: "NONE",
            cache: "",
        };
        const expectedContainerForm = {
            kind: "container",
            image: "",
            command: [],
            args: [],
            env: [],
            eventTime: { kind: "fromMetadata" },
        };
        expect(component.sectionForm.value).toEqual(expectedUrlForm);

        emitClickOnElementByDataTestId(fixture, "radio-filesGlob-control");
        fixture.detectChanges();
        expect(component.sectionForm.value).toEqual(expectedFilesGlobForm);

        emitClickOnElementByDataTestId(fixture, "radio-container-control");
        fixture.detectChanges();
        expect(component.sectionForm.value).toEqual(expectedContainerForm);
    });
});
