/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { ComponentFixture, TestBed } from "@angular/core/testing";

import { SharedTestModule } from "@common/modules/shared-test.module";

import { UnsupportedPropertyComponent } from "src/app/dataset-block/metadata-block/components/event-details/components/common/unsupported-property/unsupported-property.component";

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
