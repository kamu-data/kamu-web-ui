/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { ComponentFixture, TestBed } from "@angular/core/testing";

import { SetLicenseEventComponent } from "src/app/dataset-block/metadata-block/components/event-details/components/set-license-event/set-license-event.component";
import { mockSetLicense } from "src/app/dataset-block/metadata-block/components/event-details/mock.events";

import { SharedTestModule } from "@common/modules/shared-test.module";

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
