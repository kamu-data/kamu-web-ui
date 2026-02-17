/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { ComponentFixture, TestBed } from "@angular/core/testing";
import { FormArray, FormControl, FormGroup } from "@angular/forms";

import { RxwebValidators } from "@rxweb/reactive-form-validators";
import { dispatchInputEvent, emitClickOnElementByDataTestId } from "src/app/common/helpers/base-test.helpers.spec";
import { SharedTestModule } from "src/app/common/modules/shared-test.module";

import { SchemaFieldComponent, SchemaType } from "./schema-field.component";

describe("SchemaFieldComponent", () => {
    let component: SchemaFieldComponent;
    let fixture: ComponentFixture<SchemaFieldComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [SharedTestModule, SchemaFieldComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(SchemaFieldComponent);
        component = fixture.componentInstance;
        component.form = new FormGroup({
            schema: new FormArray([
                new FormGroup({
                    name: new FormControl("id", [RxwebValidators.unique(), RxwebValidators.required()]),
                    type: new FormControl("BIGINT", [RxwebValidators.required()]),
                }),
            ]),
        });
        component.controlName = "schema";
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });

    it("should check add row to form array", () => {
        const item: SchemaType = { name: "id", type: "BIGINT" };
        component.focus$.next(item);
        expect(component.items.length).toBe(1);
        emitClickOnElementByDataTestId(fixture, "add-row-button");
        expect(component.items.length).toBe(2);
    });

    it("should check delete row to form array", () => {
        expect(component.items.length).toBe(1);
        emitClickOnElementByDataTestId(fixture, "delete-row-button-0");
        expect(component.items.length).toBe(0);
    });

    it("should check unique validation message", () => {
        component.addRow();
        fixture.detectChanges();
        dispatchInputEvent(fixture, "name-control-1", "id");
        expect(component.nameControlError(1)).toBe("Name is not unique");
    });

    it("should check required validation message", () => {
        component.addRow();
        fixture.detectChanges();
        dispatchInputEvent(fixture, "name-control-1", "");
        expect(component.nameControlError(1)).toBe("Name is required");
    });

    it("should check swap row", () => {
        component.addRow();
        fixture.detectChanges();
        dispatchInputEvent(fixture, "name-control-1", "name");
        dispatchInputEvent(fixture, "type-control-1", "STRING");
        expect(component.items.controls[0].get("name")?.value).toBe("id");

        emitClickOnElementByDataTestId(fixture, "move-down-button-0");
        fixture.detectChanges();
        expect(component.items.controls[0].get("name")?.value).toBe("name");

        emitClickOnElementByDataTestId(fixture, "move-up-button-1");
        fixture.detectChanges();
        expect(component.items.controls[0].get("name")?.value).toBe("id");
    });

    it("should check swap method not work", () => {
        emitClickOnElementByDataTestId(fixture, "move-down-button-0");
        fixture.detectChanges();
        expect(component.items.controls[0].get("name")?.value).toBe("id");

        emitClickOnElementByDataTestId(fixture, "move-up-button-0");
        fixture.detectChanges();
        expect(component.items.controls[0].get("name")?.value).toBe("id");
    });

    it("should check pattern validation message", () => {
        component.addRow();
        fixture.detectChanges();
        dispatchInputEvent(fixture, "name-control-1", "&");
        expect(component.nameControlError(1)).toBe("Incorrect character");
    });
});
