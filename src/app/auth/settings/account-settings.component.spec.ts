import { mockAccountDetails, mockAccountDetailsWithEmail } from "../../api/mock/auth.mock";
import { RouterTestingModule } from "@angular/router/testing";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { ActivatedRoute, Router } from "@angular/router";
import { ApolloTestingModule } from "apollo-angular/testing";
import { AccountSettingsComponent } from "./account-settings.component";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { LoggedUserService } from "../logged-user.service";
import {
    findElementByDataTestId,
    getElementByDataTestId,
    registerMatSvgIcons,
} from "src/app/common/helpers/base-test.helpers.spec";
import { AccountSettingsTabs } from "./account-settings.constants";
import { of } from "rxjs";
import ProjectLinks from "src/app/project-links";
import { LoginService } from "../login/login.service";
import { MatIconModule } from "@angular/material/icon";
import { ToastrModule } from "ngx-toastr";
import { AccountEmailService } from "src/app/auth/settings/tabs/emails-tab/account-email.service";

describe("AccountSettingsComponent", () => {
    let component: AccountSettingsComponent;
    let fixture: ComponentFixture<AccountSettingsComponent>;
    let loggedUserService: LoggedUserService;
    let loginService: LoginService;
    let activatedRoute: ActivatedRoute;
    let accountEmailService: AccountEmailService;
    let router: Router;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [AccountSettingsComponent],
            imports: [
                ApolloTestingModule,
                ToastrModule.forRoot(),
                RouterTestingModule,
                HttpClientTestingModule,
                MatIconModule,
            ],
        }).compileComponents();

        registerMatSvgIcons();

        activatedRoute = TestBed.inject(ActivatedRoute);
        router = TestBed.inject(Router);
        accountEmailService = TestBed.inject(AccountEmailService);

        loginService = TestBed.inject(LoginService);
        spyOn(accountEmailService, "fetchAccountWithEmail").and.returnValue(of(mockAccountDetailsWithEmail));
        spyOnProperty(loginService, "accountChanges", "get").and.returnValue(of(mockAccountDetails));
        loggedUserService = TestBed.inject(LoggedUserService);

        fixture = TestBed.createComponent(AccountSettingsComponent);
        component = fixture.componentInstance;
    });

    enum Elements {
        UserNameLink = "user-name-link",
    }

    it("should create", () => {
        expect(component).toBeTruthy();
    });

    it("should see logged user", () => {
        fixture.detectChanges();
        const userNameLinKElement: HTMLElement = getElementByDataTestId(fixture, Elements.UserNameLink);
        expect(userNameLinKElement.innerText).toEqual(
            `${mockAccountDetails.displayName} (${mockAccountDetails.accountName})`,
        );
    });

    it("should not show user data for logged off case", () => {
        loggedUserService.terminateSession();
        fixture.detectChanges();

        expect(findElementByDataTestId(fixture, Elements.UserNameLink)).toBeFalsy();
    });

    it("should open profile tab by default", () => {
        fixture.detectChanges();
        expect(component.activeTab).toEqual(AccountSettingsTabs.PROFILE);
    });

    [
        AccountSettingsTabs.ACCESSIBILITY,
        AccountSettingsTabs.ACCOUNT,
        AccountSettingsTabs.APPEARANCE,
        AccountSettingsTabs.BILLING,
        AccountSettingsTabs.EMAILS,
        AccountSettingsTabs.NOTIFICATIONS,
        AccountSettingsTabs.ORGANIZATIONS,
        AccountSettingsTabs.PROFILE,
        AccountSettingsTabs.SECURITY,
    ].forEach((tab: AccountSettingsTabs) => {
        it(`should activate ${tab} tab`, () => {
            activatedRoute.snapshot.params = {
                [ProjectLinks.URL_PARAM_CATEGORY]: tab,
            };
            component.ngOnInit();
            expect(component.activeTab).toEqual(tab);
        });
    });

    it("should open profile tab for a wrong tab", async () => {
        activatedRoute.snapshot.params = {
            [ProjectLinks.URL_PARAM_CATEGORY]: "wrong",
        };
        await router.navigate(["/"]);
        expect(component.activeTab).toEqual(AccountSettingsTabs.PROFILE);
    });
});
