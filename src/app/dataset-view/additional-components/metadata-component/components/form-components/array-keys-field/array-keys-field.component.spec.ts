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

import { ArrayKeysFieldComponent } from "./array-keys-field.component";

describe("ArrayKeysFieldComponent", () => {
    let component: ArrayKeysFieldComponent;
    let fixture: ComponentFixture<ArrayKeysFieldComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [SharedTestModule, ArrayKeysFieldComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(ArrayKeysFieldComponent);
        component = fixture.componentInstance;
        component.form = new FormGroup({ primaryKey: new FormArray([]) });
        component.controlName = "primaryKey";
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });

    it("should check add key and remove key", () => {
        expect(component.items.length).toBe(0);

        emitClickOnElementByDataTestId(fixture, "add-key-button");
        fixture.detectChanges();
        expect(component.items.length).toBe(1);

        emitClickOnElementByDataTestId(fixture, "remove-key-button");
        fixture.detectChanges();
        expect(component.items.length).toBe(0);
    });
});
