/* eslint-disable @typescript-eslint/unbound-method */
import { CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import {
    FormBuilder,
    FormGroupDirective,
    ReactiveFormsModule,
} from "@angular/forms";
import { BaseStepComponent } from "./base-step.component";
import { FetchKind } from "../../add-polling-source-form.types";
import { FETCH_FORM_DATA } from "../data/fetch-form-data";
import { FETCH_STEP_RADIO_CONTROLS } from "../../form-control.source";
import { SetPollingSourceSection } from "src/app/shared/shared.types";

describe("BaseStepComponent", () => {
    let component: BaseStepComponent;
    let fixture: ComponentFixture<BaseStepComponent>;
    const fb = new FormBuilder();
    const formGroupDirective = new FormGroupDirective([], []);
    formGroupDirective.form = fb.group({
        fetch: fb.group({}),
    });

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [BaseStepComponent],
            schemas: [CUSTOM_ELEMENTS_SCHEMA],
            imports: [ReactiveFormsModule],
            providers: [
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
        component.groupName = SetPollingSourceSection.FETCH;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
