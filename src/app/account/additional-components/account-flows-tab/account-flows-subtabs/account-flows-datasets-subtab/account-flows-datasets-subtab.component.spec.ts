/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { ComponentFixture, TestBed } from "@angular/core/testing";
import { AccountFlowsDatasetsSubtabComponent } from "./account-flows-datasets-subtab.component";

describe("AccountFlowsDatasetsSubtabComponent", () => {
    let component: AccountFlowsDatasetsSubtabComponent;
    let fixture: ComponentFixture<AccountFlowsDatasetsSubtabComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [AccountFlowsDatasetsSubtabComponent],
        });
        fixture = TestBed.createComponent(AccountFlowsDatasetsSubtabComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
