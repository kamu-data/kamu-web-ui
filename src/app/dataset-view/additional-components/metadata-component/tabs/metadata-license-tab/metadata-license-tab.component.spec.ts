/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { ComponentFixture, TestBed } from "@angular/core/testing";
import { MetadataLicenseTabComponent } from "./metadata-license-tab.component";

describe("MetadataLicenseTabComponent", () => {
    let component: MetadataLicenseTabComponent;
    let fixture: ComponentFixture<MetadataLicenseTabComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [MetadataLicenseTabComponent],
        });
        fixture = TestBed.createComponent(MetadataLicenseTabComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
