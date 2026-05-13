/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { ComponentFixture, TestBed } from "@angular/core/testing";

import { OdfSchemaPropertyComponent } from "./odf-schema-property.component";

describe("OdfSchemaPropertyComponent", () => {
    let component: OdfSchemaPropertyComponent;
    let fixture: ComponentFixture<OdfSchemaPropertyComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [OdfSchemaPropertyComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(OdfSchemaPropertyComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
