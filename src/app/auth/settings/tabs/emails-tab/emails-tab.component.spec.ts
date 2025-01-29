import { ComponentFixture, TestBed } from "@angular/core/testing";
import { EmailsTabComponent } from "./emails-tab.component";
import { mockAccountDetailsWithEmail } from "src/app/api/mock/auth.mock";
import { ApolloTestingModule } from "apollo-angular/testing";
import { ToastrModule } from "ngx-toastr";
import { FormBuilder, ReactiveFormsModule } from "@angular/forms";
import { MatDividerModule } from "@angular/material/divider";
import { AccountEmailService } from "src/app/services/account-email.service";
import { of } from "rxjs";

describe("EmailsTabComponent", () => {
    let component: EmailsTabComponent;
    let fixture: ComponentFixture<EmailsTabComponent>;
    let accountEmailService: AccountEmailService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [EmailsTabComponent],
            providers: [FormBuilder],
            imports: [ApolloTestingModule, ToastrModule.forRoot(), ReactiveFormsModule, MatDividerModule],
        });
        accountEmailService = TestBed.inject(AccountEmailService);
        fixture = TestBed.createComponent(EmailsTabComponent);
        component = fixture.componentInstance;
        component.account = mockAccountDetailsWithEmail;
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

    it("should check accountEmailChange emit value", () => {
        const changeEmailAddressSpy = spyOn(accountEmailService, "changeEmailAddress").and.returnValue(of(true));
        const accountEmailChangeSpy = spyOn(component.accountEmailChange, "emit");
        component.changeEmailAddress();
        expect(changeEmailAddressSpy).toHaveBeenCalledTimes(1);
        expect(accountEmailChangeSpy).toHaveBeenCalledTimes(1);
    });
});
