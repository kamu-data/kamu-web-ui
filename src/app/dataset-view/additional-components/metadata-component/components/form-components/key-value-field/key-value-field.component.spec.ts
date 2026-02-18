/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { ComponentFixture, TestBed } from "@angular/core/testing";
import { FormArray, FormGroup } from "@angular/forms";

import { emitClickOnElementByDataTestId } from "@common/helpers/base-test.helpers.spec";
import { SharedTestModule } from "@common/modules/shared-test.module";

import { KeyValueFieldComponent } from "src/app/dataset-view/additional-components/metadata-component/components/form-components/key-value-field/key-value-field.component";

describe("KeyValueFieldComponent", () => {
    let component: KeyValueFieldComponent;
    let fixture: ComponentFixture<KeyValueFieldComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [SharedTestModule, KeyValueFieldComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(KeyValueFieldComponent);
        component = fixture.componentInstance;
        component.controlName = "primaryKey";
        component.buttonText = "Add key";
        component.form = new FormGroup({
            [component.controlName]: new FormArray([]),
        });
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });

    it("should check add new item to array", () => {
        expect(component.items.length).toBe(0);
        emitClickOnElementByDataTestId(fixture, "add-button");
        fixture.detectChanges();
        expect(component.items.length).toBe(1);
    });

    it("should check delete item from array", () => {
        emitClickOnElementByDataTestId(fixture, "add-button");
        fixture.detectChanges();
        emitClickOnElementByDataTestId(fixture, "item-0");
        fixture.detectChanges();
        expect(component.items.length).toBe(0);
    });
});
