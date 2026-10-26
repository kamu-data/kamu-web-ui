/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { ComponentFixture, TestBed } from "@angular/core/testing";
import { FormGroupDirective } from "@angular/forms";

import { Apollo } from "apollo-angular";

import { emitClickOnElementByDataTestId, setComponentInput } from "@common/helpers/base-test.helpers.spec";
import { SharedTestModule } from "@common/modules/shared-test.module";

import {
    EventTimeSourceKind,
    FetchKind,
    SetPollingSourceSection,
} from "src/app/dataset-view/additional-components/metadata-component/components/source-events/add-polling-source/add-polling-source-form.types";
import { FETCH_STEP_RADIO_CONTROLS } from "src/app/dataset-view/additional-components/metadata-component/components/source-events/add-polling-source/form-control.source";
import { BaseStepComponent } from "src/app/dataset-view/additional-components/metadata-component/components/source-events/steps/base-step/base-step.component";
import { createSourceEventFormGroupDirective } from "src/app/dataset-view/additional-components/metadata-component/components/source-events/steps/base-step/base-step.mock";
import { FETCH_FORM_DATA } from "src/app/dataset-view/additional-components/metadata-component/components/source-events/steps/data/fetch-form-data";

describe("BaseStepComponent", () => {
    let component: BaseStepComponent;
    let fixture: ComponentFixture<BaseStepComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [SharedTestModule, BaseStepComponent],
            providers: [Apollo, { provide: FormGroupDirective, useFactory: createSourceEventFormGroupDirective }],
        }).compileComponents();

        fixture = TestBed.createComponent(BaseStepComponent);
        component = fixture.componentInstance;
        setComponentInput(fixture, "defaultKind", FetchKind.URL);
        setComponentInput(fixture, "sectionFormData", FETCH_FORM_DATA);
        setComponentInput(fixture, "sectionStepRadioData", FETCH_STEP_RADIO_CONTROLS);
        setComponentInput(fixture, "sectionName", SetPollingSourceSection.FETCH);
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
