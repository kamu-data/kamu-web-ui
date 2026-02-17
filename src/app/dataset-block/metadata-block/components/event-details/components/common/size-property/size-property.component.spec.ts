/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { ComponentFixture, TestBed } from "@angular/core/testing";

import { SharedTestModule } from "src/app/common/modules/shared-test.module";

import { SizePropertyComponent } from "./size-property.component";

describe("SizePropertyComponent", () => {
    let component: SizePropertyComponent;
    let fixture: ComponentFixture<SizePropertyComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [SharedTestModule, SizePropertyComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(SizePropertyComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
