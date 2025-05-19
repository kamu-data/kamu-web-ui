/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { ComponentFixture, TestBed } from "@angular/core/testing";
import { AccountTabComponent } from "./account-tab.component";

describe("AccountTabComponent", () => {
    let component: AccountTabComponent;
    let fixture: ComponentFixture<AccountTabComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [AccountTabComponent],
        });
        fixture = TestBed.createComponent(AccountTabComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
