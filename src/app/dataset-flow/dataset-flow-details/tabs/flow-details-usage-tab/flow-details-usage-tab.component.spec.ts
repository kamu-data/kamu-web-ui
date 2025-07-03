/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { ComponentFixture, TestBed } from "@angular/core/testing";
import { FlowDetailsUsageTabComponent } from "./flow-details-usage-tab.component";

describe("FlowDetailsUsageTabComponent", () => {
    let component: FlowDetailsUsageTabComponent;
    let fixture: ComponentFixture<FlowDetailsUsageTabComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [FlowDetailsUsageTabComponent],
        });
        fixture = TestBed.createComponent(FlowDetailsUsageTabComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
