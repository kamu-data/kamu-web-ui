/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { DestroyRef } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { FormControl, FormGroup } from "@angular/forms";

import { Apollo } from "apollo-angular";

import {
    emitClickOnElementByDataTestId,
    getElementByDataTestId,
    setComponentInput,
} from "@common/helpers/base-test.helpers.spec";
import { SharedTestModule } from "@common/modules/shared-test.module";

import {
    EventTimeSourceKind,
    FetchKind,
    SetPollingSourceSection,
} from "src/app/dataset-view/additional-components/metadata-component/components/source-events/add-polling-source/add-polling-source-form.types";
import { FETCH_STEP_RADIO_CONTROLS } from "src/app/dataset-view/additional-components/metadata-component/components/source-events/add-polling-source/form-control.source";
import { SourceOrder } from "src/app/dataset-view/additional-components/metadata-component/components/source-events/add-polling-source/process-form.service.types";
import { FetchControls } from "src/app/dataset-view/additional-components/metadata-component/components/source-events/source-event-controls.types";
import { SourceSection } from "src/app/dataset-view/additional-components/metadata-component/components/source-events/source-section";
import { BaseStepComponent } from "src/app/dataset-view/additional-components/metadata-component/components/source-events/steps/base-step/base-step.component";
import { FETCH_FORM_DATA } from "src/app/dataset-view/additional-components/metadata-component/components/source-events/steps/data/fetch-form-data";

describe("BaseStepComponent", () => {
    let component: BaseStepComponent;
    let fixture: ComponentFixture<BaseStepComponent>;
    let fetchForm: FormGroup<FetchControls>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [SharedTestModule, BaseStepComponent],
            providers: [Apollo],
        }).compileComponents();

        fixture = TestBed.createComponent(BaseStepComponent);
        component = fixture.componentInstance;
        fetchForm = new FormGroup<FetchControls>({ kind: new FormControl(FetchKind.URL, { nonNullable: true }) });
        const section = new SourceSection(
            fetchForm,
            fetchForm.controls.kind,
            FETCH_FORM_DATA,
            TestBed.inject(DestroyRef),
            ["eventTime"],
        );
        setComponentInput(fixture, "section", section);
        setComponentInput(fixture, "sectionStepRadioData", FETCH_STEP_RADIO_CONTROLS);
        setComponentInput(fixture, "sectionName", SetPollingSourceSection.FETCH);
        setComponentInput(fixture, "description", "Determines where data is sourced from");
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });

    it("should switch the fetch step's controls with its kind", () => {
        expect(fetchForm.getRawValue()).toEqual({
            kind: FetchKind.URL,
            url: "",
            eventTime: { kind: EventTimeSourceKind.FROM_METADATA },
            headers: [],
            cache: false,
        });

        emitClickOnElementByDataTestId(fixture, "radio-FilesGlob-control");
        fixture.detectChanges();
        expect(fetchForm.getRawValue()).toEqual({
            kind: FetchKind.FILES_GLOB,
            path: "",
            eventTime: { kind: EventTimeSourceKind.FROM_METADATA },
            order: SourceOrder.NONE,
            cache: false,
        });

        emitClickOnElementByDataTestId(fixture, "radio-Container-control");
        fixture.detectChanges();
        expect(fetchForm.getRawValue()).toEqual({
            kind: FetchKind.CONTAINER,
            image: "",
            command: [],
            args: [],
            env: [],
            eventTime: { kind: EventTimeSourceKind.FROM_METADATA },
        });
    });

    it("should bind a field the new kind shares by name to that kind's control", () => {
        emitClickOnElementByDataTestId(fixture, "radio-FilesGlob-control");
        fixture.detectChanges();

        emitClickOnElementByDataTestId(fixture, "cache-control");
        fixture.detectChanges();

        expect(getElementByDataTestId(fixture, "cache-control", HTMLInputElement).checked).toBe(true);
        expect(fetchForm.getRawValue().cache).toBe(true);
    });
});
