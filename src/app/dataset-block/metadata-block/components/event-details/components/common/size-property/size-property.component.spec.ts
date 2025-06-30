/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { DisplaySizeModule } from "src/app/common/pipes/display-size.module";
import { ComponentFixture, TestBed } from "@angular/core/testing";

import { SizePropertyComponent } from "./size-property.component";
import { SharedTestModule } from "src/app/common/modules/shared-test.module";

describe("SizePropertyComponent", () => {
    let component: SizePropertyComponent;
    let fixture: ComponentFixture<SizePropertyComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
    imports: [DisplaySizeModule, SharedTestModule, SizePropertyComponent],
}).compileComponents();

        fixture = TestBed.createComponent(SizePropertyComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
