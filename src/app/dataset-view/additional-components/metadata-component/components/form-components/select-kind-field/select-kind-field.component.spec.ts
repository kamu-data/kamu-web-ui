/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { ComponentFixture, TestBed } from "@angular/core/testing";
import { FormControl, FormGroup } from "@angular/forms";

import { emitClickOnElementByDataTestId } from "@common/helpers/base-test.helpers.spec";

import { SelectKindFieldComponent } from "src/app/dataset-view/additional-components/metadata-component/components/form-components/select-kind-field/select-kind-field.component";
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
        component.data = FETCH_STEP_RADIO_CONTROLS;
        component.form = new FormGroup({
            kind: new FormControl(FetchKind.URL),
        });
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });

    it("should check switch control", () => {
        expect(component.form.value).toEqual({ kind: FetchKind.URL });

        emitClickOnElementByDataTestId(fixture, `radio-${FetchKind.FILES_GLOB}-control`);
        expect(component.form.value).toEqual({ kind: FetchKind.FILES_GLOB });

        emitClickOnElementByDataTestId(fixture, `radio-${FetchKind.CONTAINER}-control`);
        expect(component.form.value).toEqual({ kind: FetchKind.CONTAINER });
    });
});
