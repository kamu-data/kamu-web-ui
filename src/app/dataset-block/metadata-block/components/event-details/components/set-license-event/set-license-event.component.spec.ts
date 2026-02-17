/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { ComponentFixture, TestBed } from "@angular/core/testing";

import { SharedTestModule } from "src/app/common/modules/shared-test.module";

import { mockSetLicense } from "../../mock.events";
import { SetLicenseEventComponent } from "./set-license-event.component";

describe("SetLicenseEventComponent", () => {
    let component: SetLicenseEventComponent;
    let fixture: ComponentFixture<SetLicenseEventComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [SharedTestModule, SetLicenseEventComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(SetLicenseEventComponent);
        component = fixture.componentInstance;
        component.event = mockSetLicense;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
