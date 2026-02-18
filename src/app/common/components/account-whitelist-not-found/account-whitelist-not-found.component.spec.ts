/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { ComponentFixture, TestBed } from "@angular/core/testing";

import { AccountWhitelistNotFoundComponent } from "@common/components/account-whitelist-not-found/account-whitelist-not-found.component";

describe("AccountWhitelistNotFoundComponent", () => {
    let component: AccountWhitelistNotFoundComponent;
    let fixture: ComponentFixture<AccountWhitelistNotFoundComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [AccountWhitelistNotFoundComponent],
        });
        fixture = TestBed.createComponent(AccountWhitelistNotFoundComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
