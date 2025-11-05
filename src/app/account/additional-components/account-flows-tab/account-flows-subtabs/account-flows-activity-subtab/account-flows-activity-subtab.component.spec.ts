/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { ComponentFixture, TestBed } from "@angular/core/testing";
import { AccountFlowsActivitySubtabComponent } from "./account-flows-activity-subtab.component";

describe("AccountFlowsActivitySubtabComponent", () => {
    let component: AccountFlowsActivitySubtabComponent;
    let fixture: ComponentFixture<AccountFlowsActivitySubtabComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [AccountFlowsActivitySubtabComponent],
        });
        fixture = TestBed.createComponent(AccountFlowsActivitySubtabComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
