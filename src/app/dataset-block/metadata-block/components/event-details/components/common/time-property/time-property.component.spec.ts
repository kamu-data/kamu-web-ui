/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { ComponentFixture, TestBed } from "@angular/core/testing";

import { TimePropertyComponent } from "src/app/dataset-block/metadata-block/components/event-details/components/common/time-property/time-property.component";

import { SharedTestModule } from "@common/modules/shared-test.module";

describe("TimePropertyComponent", () => {
    let component: TimePropertyComponent;
    let fixture: ComponentFixture<TimePropertyComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [SharedTestModule, TimePropertyComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(TimePropertyComponent);
        component = fixture.componentInstance;
        component.data = new Date("2021-10-03 12:00:00").toISOString();
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
