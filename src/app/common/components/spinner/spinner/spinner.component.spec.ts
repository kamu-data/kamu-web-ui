/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { ComponentFixture, TestBed } from "@angular/core/testing";

import { SpinnerComponent } from "@common/components/spinner/spinner/spinner.component";

describe("SpinnerComponent", () => {
    let component: SpinnerComponent;
    let fixture: ComponentFixture<SpinnerComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [SpinnerComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(SpinnerComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
