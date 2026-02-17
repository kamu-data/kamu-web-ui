/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { ComponentFixture, fakeAsync, flush, TestBed, tick } from "@angular/core/testing";

import { of } from "rxjs";

import { mockAccountDetailsWithEmail } from "@api/mock/auth.mock";
import { Apollo } from "apollo-angular";
import { provideToastr } from "ngx-toastr";
import { AccountEmailService } from "src/app/account/settings/tabs/emails-tab/account-email.service";
import { NavigationService } from "src/app/services/navigation.service";

import { EmailsTabComponent } from "./emails-tab.component";

describe("EmailsTabComponent", () => {
    let component: EmailsTabComponent;
    let fixture: ComponentFixture<EmailsTabComponent>;
    let accountEmailService: AccountEmailService;
    let navigationService: NavigationService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [Apollo, provideToastr()],
            imports: [EmailsTabComponent],
        });
        accountEmailService = TestBed.inject(AccountEmailService);
        fixture = TestBed.createComponent(EmailsTabComponent);
        navigationService = TestBed.inject(NavigationService);
        component = fixture.componentInstance;
        component.account = mockAccountDetailsWithEmail;
        spyOn(navigationService, "navigateToSettings");
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });

    it("should check reset error", () => {
        const resetChangeEmailErrorSpy = spyOn(accountEmailService, "resetChangeEmailError");
        component.changeEmail();
        expect(resetChangeEmailErrorSpy).toHaveBeenCalledTimes(1);
    });

    it("should check accountEmailChange emit value", fakeAsync(() => {
        const changeEmailAddressSpy = spyOn(accountEmailService, "changeEmailAddress").and.returnValue(of(true));
        component.changeEmailAddress();
        tick();
        expect(changeEmailAddressSpy).toHaveBeenCalledTimes(1);
        flush();
    }));
});
