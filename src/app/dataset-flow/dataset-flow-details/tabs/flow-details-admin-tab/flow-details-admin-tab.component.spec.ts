/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { ComponentFixture, TestBed } from "@angular/core/testing";
import { FlowDetailsAdminTabComponent } from "./flow-details-admin-tab.component";

describe("FlowDetailsAdminTabComponent", () => {
    let component: FlowDetailsAdminTabComponent;
    let fixture: ComponentFixture<FlowDetailsAdminTabComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
    imports: [FlowDetailsAdminTabComponent],
});
        fixture = TestBed.createComponent(FlowDetailsAdminTabComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
