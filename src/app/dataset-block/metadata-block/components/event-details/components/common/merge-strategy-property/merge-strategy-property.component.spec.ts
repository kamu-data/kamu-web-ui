/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { ComponentFixture, TestBed } from "@angular/core/testing";
import { MergeStrategyPropertyComponent } from "./merge-strategy-property.component";
import { SharedTestModule } from "src/app/common/modules/shared-test.module";

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
