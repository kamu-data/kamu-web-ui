/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { ComponentFixture, fakeAsync, flush, TestBed, tick } from "@angular/core/testing";
import { EmailsTabComponent } from "./emails-tab.component";
import { mockAccountDetailsWithEmail } from "src/app/api/mock/auth.mock";
import { ApolloTestingModule } from "apollo-angular/testing";
import { ToastrModule } from "ngx-toastr";
import { FormBuilder, ReactiveFormsModule } from "@angular/forms";
import { MatDividerModule } from "@angular/material/divider";
import { AccountEmailService } from "src/app/account/settings/tabs/emails-tab/account-email.service";
import { of } from "rxjs";
import { RouterTestingModule } from "@angular/router/testing";
import { routes } from "src/app/app-routing.module";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { NavigationService } from "src/app/services/navigation.service";
import { FormValidationErrorsModule } from "src/app/common/directives/form-validation-errors.module";

describe("EmailsTabComponent", () => {
    let component: EmailsTabComponent;
    let fixture: ComponentFixture<EmailsTabComponent>;
    let accountEmailService: AccountEmailService;
    let navigationService: NavigationService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [EmailsTabComponent],
            providers: [FormBuilder],
            imports: [
                ApolloTestingModule,
                ToastrModule.forRoot(),
                RouterTestingModule.withRoutes(routes),
                ReactiveFormsModule,
                MatDividerModule,
                HttpClientTestingModule,
                FormValidationErrorsModule,
            ],
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
