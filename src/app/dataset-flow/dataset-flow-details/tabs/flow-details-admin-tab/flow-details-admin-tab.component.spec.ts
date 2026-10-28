/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { ComponentFixture, TestBed } from "@angular/core/testing";

import { getElementByDataTestId } from "@common/helpers/base-test.helpers.spec";

import { FlowDetailsAdminTabComponent } from "src/app/dataset-flow/dataset-flow-details/tabs/flow-details-admin-tab/flow-details-admin-tab.component";

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

    it("should name the Admin tab in its placeholder", () => {
        expect(getElementByDataTestId(fixture, "admin-tab-placeholder").textContent).toBe("Admin tab coming soon");
    });
});
