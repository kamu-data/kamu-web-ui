/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { TestbedHarnessEnvironment } from "@angular/cdk/testing/testbed";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { FormControl, FormGroup } from "@angular/forms";

import { setComponentInput } from "@common/helpers/base-test.helpers.spec";

import { SelectKindFieldComponent } from "src/app/dataset-view/additional-components/metadata-component/components/form-components/select-kind-field/select-kind-field.component";
import { SelectKindFieldHarness } from "src/app/dataset-view/additional-components/metadata-component/components/form-components/select-kind-field/select-kind-field.harness";
import { FetchKind } from "src/app/dataset-view/additional-components/metadata-component/components/source-events/add-polling-source/add-polling-source-form.types";
import { FETCH_STEP_RADIO_CONTROLS } from "src/app/dataset-view/additional-components/metadata-component/components/source-events/add-polling-source/form-control.source";

describe("SelectKindFieldComponent", () => {
    let component: SelectKindFieldComponent;
    let fixture: ComponentFixture<SelectKindFieldComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [SelectKindFieldComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(SelectKindFieldComponent);
        component = fixture.componentInstance;
        setComponentInput(fixture, "data", FETCH_STEP_RADIO_CONTROLS);
        setComponentInput(
            fixture,
            "form",
            new FormGroup({
                kind: new FormControl(FetchKind.URL),
            }),
        );
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });

    it("should write the picked kind into the form", async () => {
        const harness = await TestbedHarnessEnvironment.harnessForFixture(fixture, SelectKindFieldHarness);
        expect(component.form.value).toEqual({ kind: FetchKind.URL });
        expect(await harness.isKindSelected(FetchKind.URL)).toBe(true);

        await harness.selectKind(FetchKind.FILES_GLOB);
        expect(component.form.value).toEqual({ kind: FetchKind.FILES_GLOB });

        await harness.selectKind(FetchKind.CONTAINER);
        expect(component.form.value).toEqual({ kind: FetchKind.CONTAINER });
        expect(await harness.isKindSelected(FetchKind.FILES_GLOB)).toBe(false);
    });
});
