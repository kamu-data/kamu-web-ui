/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { ComponentFixture, TestBed } from "@angular/core/testing";
import { UnsupportedPropertyComponent } from "./unsupported-property.component";
import { SharedTestModule } from "src/app/common/modules/shared-test.module";

describe("UnsupportedPropertyComponent", () => {
    let component: UnsupportedPropertyComponent;
    let fixture: ComponentFixture<UnsupportedPropertyComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
    imports: [SharedTestModule, UnsupportedPropertyComponent],
}).compileComponents();

        fixture = TestBed.createComponent(UnsupportedPropertyComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
