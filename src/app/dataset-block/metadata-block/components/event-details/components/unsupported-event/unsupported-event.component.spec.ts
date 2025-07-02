/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { ComponentFixture, TestBed } from "@angular/core/testing";
import { UnsupportedEventComponent } from "./unsupported-event.component";
import { MatIconModule } from "@angular/material/icon";
import { SharedTestModule } from "src/app/common/modules/shared-test.module";

describe("UnsupportedEventComponent", () => {
    let component: UnsupportedEventComponent;
    let fixture: ComponentFixture<UnsupportedEventComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [MatIconModule, SharedTestModule, UnsupportedEventComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(UnsupportedEventComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
