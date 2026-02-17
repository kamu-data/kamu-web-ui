/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { ComponentFixture, TestBed } from "@angular/core/testing";

import { SharedTestModule } from "@common/modules/shared-test.module";

import { SimplePropertyComponent } from "./simple-property.component";

describe("SimplePropertyComponent", () => {
    let component: SimplePropertyComponent;
    let fixture: ComponentFixture<SimplePropertyComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [SharedTestModule, SimplePropertyComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(SimplePropertyComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
