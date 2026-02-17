/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { ComponentFixture, TestBed } from "@angular/core/testing";

import { SharedTestModule } from "@common/modules/shared-test.module";

import { StepTypePropertyComponent } from "src/app/dataset-block/metadata-block/components/event-details/components/common/step-type-property/step-type-property.component";

describe("StepTypePropertyComponent", () => {
    let component: StepTypePropertyComponent;
    let fixture: ComponentFixture<StepTypePropertyComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [SharedTestModule, StepTypePropertyComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(StepTypePropertyComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
