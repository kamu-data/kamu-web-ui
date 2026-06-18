/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { ComponentFixture, TestBed } from "@angular/core/testing";

import { TypeEditorComponent } from "./type-editor.component";

describe("TypeEditorComponent", () => {
    let component: TypeEditorComponent;
    let fixture: ComponentFixture<TypeEditorComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [TypeEditorComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(TypeEditorComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
