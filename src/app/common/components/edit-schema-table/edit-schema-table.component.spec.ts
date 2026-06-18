/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { ComponentFixture, TestBed } from "@angular/core/testing";

import { EditSchemaTableComponent } from "./edit-schema-table.component";

describe("EditSchemaTableComponent", () => {
    let component: EditSchemaTableComponent;
    let fixture: ComponentFixture<EditSchemaTableComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [EditSchemaTableComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(EditSchemaTableComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
