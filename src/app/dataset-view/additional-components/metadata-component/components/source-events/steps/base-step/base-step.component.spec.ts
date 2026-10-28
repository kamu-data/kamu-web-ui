/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { HarnessLoader } from "@angular/cdk/testing";
import { TestbedHarnessEnvironment } from "@angular/cdk/testing/testbed";
import { DestroyRef } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { FormControl, FormGroup } from "@angular/forms";

import { Apollo } from "apollo-angular";

import { setComponentInput } from "@common/helpers/base-test.helpers.spec";
import { SharedTestModule } from "@common/modules/shared-test.module";

import { CacheFieldHarness } from "src/app/dataset-view/additional-components/metadata-component/components/form-components/cache-field/cache-field.harness";
import { InputFieldHarness } from "src/app/dataset-view/additional-components/metadata-component/components/form-components/input-field/input-field.harness";
import { SelectKindFieldHarness } from "src/app/dataset-view/additional-components/metadata-component/components/form-components/select-kind-field/select-kind-field.harness";
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
    let loader: HarnessLoader;

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
        loader = TestbedHarnessEnvironment.loader(fixture);
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });

    async function selectKind(kind: FetchKind): Promise<void> {
        const kindField = await loader.getHarness(SelectKindFieldHarness);
        await kindField.selectKind(kind);
    }

    it("should switch the fetch step's controls with its kind", async () => {
        expect(fetchForm.getRawValue()).toEqual({
            kind: FetchKind.URL,
            url: "",
            eventTime: { kind: EventTimeSourceKind.FROM_METADATA, pattern: "", timestampFormat: "" },
            headers: [],
            cache: false,
        });

        await selectKind(FetchKind.FILES_GLOB);
        expect(fetchForm.getRawValue()).toEqual({
            kind: FetchKind.FILES_GLOB,
            path: "",
            eventTime: { kind: EventTimeSourceKind.FROM_METADATA, pattern: "", timestampFormat: "" },
            order: SourceOrder.NONE,
            cache: false,
        });

        await selectKind(FetchKind.CONTAINER);
        expect(fetchForm.getRawValue()).toEqual({
            kind: FetchKind.CONTAINER,
            image: "",
            command: [],
            args: [],
            env: [],
            eventTime: { kind: EventTimeSourceKind.FROM_METADATA, pattern: "", timestampFormat: "" },
        });
    });

    it("should render the fields of the selected kind with the section's test ids", async () => {
        expect(await loader.getHarnessOrNull(InputFieldHarness.with({ dataTestId: "fetch-url" }))).not.toBeNull();

        await selectKind(FetchKind.FILES_GLOB);

        expect(await loader.getHarnessOrNull(InputFieldHarness.with({ dataTestId: "fetch-url" }))).toBeNull();
        expect(await loader.getHarnessOrNull(InputFieldHarness.with({ dataTestId: "fetch-path" }))).not.toBeNull();
    });

    it("should bind a field the new kind shares by name to that kind's control", async () => {
        await selectKind(FetchKind.FILES_GLOB);

        const cacheField = await loader.getHarness(CacheFieldHarness);
        await cacheField.toggle();

        expect(await cacheField.isChecked()).toBe(true);
        expect(fetchForm.getRawValue().cache).toBe(true);
    });
});
