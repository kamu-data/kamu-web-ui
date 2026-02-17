/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { ComponentFixture, TestBed } from "@angular/core/testing";

import { SharedTestModule } from "@common/modules/shared-test.module";

import { SeparatorPropertyComponent } from "./separator-property.component";

describe("SeparatorPropertyComponent", () => {
    let component: SeparatorPropertyComponent;
    let fixture: ComponentFixture<SeparatorPropertyComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [SharedTestModule, SeparatorPropertyComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(SeparatorPropertyComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
