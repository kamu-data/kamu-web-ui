/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { ComponentFixture, TestBed } from "@angular/core/testing";
import { SimplePropertyComponent } from "./simple-property.component";
import { SharedTestModule } from "src/app/common/modules/shared-test.module";

describe("SimplePropertyComponent", () => {
    let component: SimplePropertyComponent;
    let fixture: ComponentFixture<SimplePropertyComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [SimplePropertyComponent],
            imports: [SharedTestModule],
        }).compileComponents();

        fixture = TestBed.createComponent(SimplePropertyComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
