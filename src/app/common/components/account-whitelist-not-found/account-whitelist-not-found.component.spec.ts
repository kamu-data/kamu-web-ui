/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { ComponentFixture, TestBed } from "@angular/core/testing";

import { AccountWhitelistNotFoundComponent } from "@common/components/account-whitelist-not-found/account-whitelist-not-found.component";
import { checkVisible, getElementByDataTestId } from "@common/helpers/base-test.helpers.spec";
import { MaybeUndefined } from "@interface/app.types";

import { AppConfigService } from "src/app/app-config.service";

describe("AccountWhitelistNotFoundComponent", () => {
    let component: AccountWhitelistNotFoundComponent;
    let fixture: ComponentFixture<AccountWhitelistNotFoundComponent>;

    function createComponent(supportEmail: MaybeUndefined<string>): void {
        spyOnProperty(TestBed.inject(AppConfigService), "supportEmail", "get").and.returnValue(supportEmail);
        fixture = TestBed.createComponent(AccountWhitelistNotFoundComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    }

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [AccountWhitelistNotFoundComponent],
        });
    });

    it("should create", () => {
        createComponent("support@example.com");
        expect(component).toBeTruthy();
    });

    it("should link to the configured support email", () => {
        createComponent("support@example.com");
        expect(getElementByDataTestId(fixture, "whitelist-support-link").getAttribute("href")).toEqual(
            "mailto:support@example.com",
        );
    });

    it("should not offer a contact link without a support email", () => {
        createComponent(undefined);
        checkVisible(fixture, "whitelist-support-link", false);
    });
});
