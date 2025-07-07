/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { ComponentFixture, TestBed } from "@angular/core/testing";
import { TopicsFieldComponent } from "./topics-field.component";
import { FormArray, FormGroup } from "@angular/forms";
import { SharedTestModule } from "src/app/common/modules/shared-test.module";

describe("TopicsFieldComponent", () => {
    let component: TopicsFieldComponent;
    let fixture: ComponentFixture<TopicsFieldComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [SharedTestModule, TopicsFieldComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(TopicsFieldComponent);
        component = fixture.componentInstance;
        component.controlName = "topics";
        component.buttonText = "Add new topics";
        component.form = new FormGroup({
            [component.controlName]: new FormArray([]),
        });
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });

    it("should check add item", () => {
        component.addItem();
        expect(component.items.length).toEqual(1);
    });

    it("should check remove item", () => {
        component.addItem();
        component.removeItem(0);
        expect(component.items.length).toEqual(0);
    });
});
