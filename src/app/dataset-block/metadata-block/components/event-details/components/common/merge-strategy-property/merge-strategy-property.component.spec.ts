/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { ComponentFixture, TestBed } from "@angular/core/testing";

import { SharedTestModule } from "@common/modules/shared-test.module";

import { MergeStrategyPropertyComponent } from "src/app/dataset-block/metadata-block/components/event-details/components/common/merge-strategy-property/merge-strategy-property.component";

describe("MergeStrategyPropertyComponent", () => {
    let component: MergeStrategyPropertyComponent;
    let fixture: ComponentFixture<MergeStrategyPropertyComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [SharedTestModule, MergeStrategyPropertyComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(MergeStrategyPropertyComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
