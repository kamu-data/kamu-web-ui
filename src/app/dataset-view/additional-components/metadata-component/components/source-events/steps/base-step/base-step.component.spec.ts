/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { ComponentFixture, TestBed } from "@angular/core/testing";
import { FormArray, FormBuilder, FormControl, FormGroupDirective } from "@angular/forms";
import { BaseStepComponent } from "./base-step.component";
import {
    EventTimeSourceKind,
    FetchKind,
    SetPollingSourceSection,
} from "../../add-polling-source/add-polling-source-form.types";
import { FETCH_FORM_DATA } from "../data/fetch-form-data";
import { FETCH_STEP_RADIO_CONTROLS } from "../../add-polling-source/form-control.source";
import { emitClickOnElementByDataTestId } from "src/app/common/helpers/base-test.helpers.spec";
import { Apollo } from "apollo-angular";
import { SharedTestModule } from "src/app/common/modules/shared-test.module";

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
            imports: [SharedTestModule, BaseStepComponent],
            providers: [Apollo, { provide: FormGroupDirective, useValue: formGroupDirective }],
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
            kind: FetchKind.URL,
            url: "",
            eventTime: { kind: EventTimeSourceKind.FROM_METADATA },
            headers: [],
            cache: "",
        };
        const expectedFilesGlobForm = {
            kind: FetchKind.FILES_GLOB,
            path: "",
            eventTime: { kind: EventTimeSourceKind.FROM_METADATA },
            order: "NONE",
            cache: "",
        };
        const expectedContainerForm = {
            kind: FetchKind.CONTAINER,
            image: "",
            command: [],
            args: [],
            env: [],
            eventTime: { kind: EventTimeSourceKind.FROM_METADATA },
        };
        expect(component.sectionForm.value).toEqual(expectedUrlForm);

        emitClickOnElementByDataTestId(fixture, "radio-FilesGlob-control");
        fixture.detectChanges();
        expect(component.sectionForm.value).toEqual(expectedFilesGlobForm);

        emitClickOnElementByDataTestId(fixture, "radio-Container-control");
        fixture.detectChanges();
        expect(component.sectionForm.value).toEqual(expectedContainerForm);
    });
});
