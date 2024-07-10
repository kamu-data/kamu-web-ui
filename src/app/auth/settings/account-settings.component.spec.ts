import { mockAccountDetails } from "../../api/mock/auth.mock";
import { RouterTestingModule } from "@angular/router/testing";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { ActivatedRoute, NavigationEnd, Router, RouterEvent } from "@angular/router";
import { ApolloTestingModule } from "apollo-angular/testing";
import { AccountSettingsComponent } from "./account-settings.component";
import { AngularSvgIconModule } from "angular-svg-icon";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { LoggedUserService } from "../logged-user.service";
import { findElementByDataTestId, getElementByDataTestId } from "src/app/common/base-test.helpers.spec";
import { AccountSettingsTabs } from "./account-settings.constants";
import { Subject, of } from "rxjs";
import ProjectLinks from "src/app/project-links";
import { LoginService } from "../login/login.service";

describe("AccountSettingsComponent", () => {
    let component: AccountSettingsComponent;
    let fixture: ComponentFixture<AccountSettingsComponent>;
    let loggedUserService: LoggedUserService;
    let loginService: LoginService;
    let activatedRoute: ActivatedRoute;
    let router: Router;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [AccountSettingsComponent],
            imports: [
                ApolloTestingModule,
                RouterTestingModule,
                AngularSvgIconModule.forRoot(),
                HttpClientTestingModule,
            ],
        }).compileComponents();

        activatedRoute = TestBed.inject(ActivatedRoute);
        router = TestBed.inject(Router);

        loginService = TestBed.inject(LoginService);
        spyOnProperty(loginService, "accountChanges", "get").and.returnValue(of(mockAccountDetails));
        loggedUserService = TestBed.inject(LoggedUserService);

        fixture = TestBed.createComponent(AccountSettingsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    enum Elements {
        UserNameLink = "user-name-link",
    }

    it("should create", () => {
        expect(component).toBeTruthy();
    });

    it("should see logged user", () => {
        const userNameLinKElement: HTMLElement = getElementByDataTestId(fixture, Elements.UserNameLink);
        expect(userNameLinKElement.innerText).toEqual(
            `${mockAccountDetails.displayName} (${mockAccountDetails.accountName})`,
        );
    });

    it("should not show user data for logged off case", () => {
        loggedUserService.logout();
        fixture.detectChanges();

        expect(findElementByDataTestId(fixture, Elements.UserNameLink)).toBeFalsy();
    });

    it("should open profile tab by default", () => {
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
            (router.events as Subject<RouterEvent>).next(new NavigationEnd(1, "", ""));

            expect(component.activeTab).toEqual(tab);
        });
    });

    it("should open profile tab for a wrong tab", () => {
        activatedRoute.snapshot.params = {
            [ProjectLinks.URL_PARAM_CATEGORY]: "wrong",
        };
        (router.events as Subject<RouterEvent>).next(new NavigationEnd(1, "", ""));

        expect(component.activeTab).toEqual(AccountSettingsTabs.PROFILE);
    });
});
