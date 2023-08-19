import { ComponentFixture, TestBed } from "@angular/core/testing";

import { LoginComponent } from "./login.component";
import { ReactiveFormsModule } from "@angular/forms";
import { Apollo } from "apollo-angular";
import { ApolloTestingModule } from "apollo-angular/testing";
import { AngularSvgIconModule } from "angular-svg-icon";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { AppConfigService } from "src/app/app-config.service";
import { LoginMethod } from "src/app/app-config.model";
import { SpinnerComponent } from "src/app/components/spinner/spinner/spinner.component";
import { LoginService } from "./login.service";
import {
    checkInputDisabled,
    checkVisible,
    emitClickOnElementByDataTestId,
    getElementByDataTestId,
    setFieldValue,
} from "src/app/common/base-test.helpers.spec";
import { TEST_LOGIN, TEST_PASSWORD } from "src/app/api/mock/auth.mock";
import { PasswordLoginCredentials } from "src/app/api/auth.api.model";

describe("LoginComponent", () => {
    let component: LoginComponent;
    let fixture: ComponentFixture<LoginComponent>;
    let appConfigService: AppConfigService;
    let loginService: LoginService;

    enum Elements {
        METHOD_SELECTION_BLOCK = "method-selection-block",
        GITHUB_SPINNER = "github-spinner",
        PASSWORD_METHOD_BLOCK = "password-method-block",

        SELECT_METHOD_GITHUB = "select-method-github",
        SELECT_METHOD_PASSWORD = "select-method-password",

        INPUT_LOGIN = "input-login",
        INPUT_PASSWORD = "input-password",
        SUBMIT_PASSWORD = "submit-password",

        INPUT_LOGIN_ERROR_REQUIRED = "input-login-error-required",
        INPUT_PASSWORD_ERROR_REQUIRED = "input-password-error-required",
        PASSWORD_METHOD_ERROR = "password-method-error",
    }

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [LoginComponent, SpinnerComponent],
            providers: [Apollo],
            imports: [
                ApolloTestingModule,
                ReactiveFormsModule,
                AngularSvgIconModule.forRoot(),
                HttpClientTestingModule,
            ],
        }).compileComponents();

        loginService = TestBed.inject(LoginService);
    });

    function createFixture() {
        fixture = TestBed.createComponent(LoginComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    }

    describe("Main test suite", () => {
        beforeEach(() => {
            appConfigService = TestBed.inject(AppConfigService);
            spyOnProperty(appConfigService, "featureFlags", "get").and.returnValue({
                enableLogout: true,
            });
            spyOnProperty(loginService, "loginMethods", "get").and.returnValue([
                LoginMethod.GITHUB,
                LoginMethod.PASSWORD,
            ]);

            createFixture();
        });

        it("should create", () => {
            expect(component).toBeTruthy();
        });

        it("should not select any method with 2 login methods allowed", () => {
            expect(component.selectedLoginMethod).toBeUndefined();

            checkVisible(fixture, Elements.METHOD_SELECTION_BLOCK, true);
            checkVisible(fixture, Elements.GITHUB_SPINNER, false);
            checkVisible(fixture, Elements.PASSWORD_METHOD_BLOCK, false);
        });

        it("select Github method should redirect to Github endpoint and show spinner", () => {
            const spyGotoGithub = spyOn(LoginService, "gotoGithub").and.stub();

            emitClickOnElementByDataTestId(fixture, Elements.SELECT_METHOD_GITHUB);
            fixture.detectChanges();

            checkVisible(fixture, Elements.METHOD_SELECTION_BLOCK, false);
            checkVisible(fixture, Elements.GITHUB_SPINNER, true);
            checkVisible(fixture, Elements.PASSWORD_METHOD_BLOCK, false);

            expect(spyGotoGithub).toHaveBeenCalledTimes(1);
        });

        it("Select password method should switch on the password block and disable selection", () => {
            emitClickOnElementByDataTestId(fixture, Elements.SELECT_METHOD_PASSWORD);
            fixture.detectChanges();

            checkVisible(fixture, Elements.METHOD_SELECTION_BLOCK, false);
            checkVisible(fixture, Elements.GITHUB_SPINNER, false);
            checkVisible(fixture, Elements.PASSWORD_METHOD_BLOCK, true);
        });

        describe("Password login method", () => {
            beforeEach(() => {
                emitClickOnElementByDataTestId(fixture, Elements.SELECT_METHOD_PASSWORD);
                fixture.detectChanges();
            });

            it("Submit good password login form", () => {
                const loginServicePasswordSubmit = spyOn(loginService, "passwordLogin").and.stub();

                setFieldValue(fixture, Elements.INPUT_LOGIN, TEST_LOGIN);
                setFieldValue(fixture, Elements.INPUT_PASSWORD, TEST_PASSWORD);
                fixture.detectChanges();

                checkInputDisabled(fixture, Elements.SUBMIT_PASSWORD, false);
                expect(component.passwordLoginForm.valid).toBeTrue();

                emitClickOnElementByDataTestId(fixture, Elements.SUBMIT_PASSWORD);

                expect(loginServicePasswordSubmit).toHaveBeenCalledOnceWith({
                    login: TEST_LOGIN,
                    password: TEST_PASSWORD,
                } as PasswordLoginCredentials);
            });

            it("Missing login or password leads to disable submit", () => {
                checkInputDisabled(fixture, Elements.SUBMIT_PASSWORD, true);
                expect(component.passwordLoginForm.valid).toBeFalse();

                setFieldValue(fixture, Elements.INPUT_LOGIN, TEST_LOGIN);
                fixture.detectChanges();

                checkInputDisabled(fixture, Elements.SUBMIT_PASSWORD, true);
                expect(component.passwordLoginForm.valid).toBeFalse();

                setFieldValue(fixture, Elements.INPUT_PASSWORD, TEST_PASSWORD);
                fixture.detectChanges();

                checkInputDisabled(fixture, Elements.SUBMIT_PASSWORD, false);
                expect(component.passwordLoginForm.valid).toBeTrue();
            });

            [
                [Elements.INPUT_LOGIN, Elements.INPUT_LOGIN_ERROR_REQUIRED],
                [Elements.INPUT_PASSWORD, Elements.INPUT_PASSWORD_ERROR_REQUIRED],
            ].forEach(([inputElementName, inputErrorElementName]: Elements[]) => {
                it(`Test touching element '${Elements.INPUT_LOGIN}' creates required error`, () => {
                    checkVisible(fixture, inputErrorElementName, false);

                    setFieldValue(fixture, inputElementName, "");
                    fixture.detectChanges();

                    checkVisible(fixture, inputErrorElementName, true);
                });
            });

            it("Service emits an error during password login", () => {
                checkVisible(fixture, Elements.PASSWORD_METHOD_ERROR, false);

                const errorMessage = "Bad credentials";
                loginService.emitPasswordLoginError(errorMessage);
                fixture.detectChanges();

                checkVisible(fixture, Elements.PASSWORD_METHOD_ERROR, true);
            });

            [Elements.INPUT_LOGIN, Elements.INPUT_PASSWORD].forEach((inputElemenName: Elements) => {
                it(`Error is cleared after touching input ${inputElemenName}`, () => {
                    const errorMessage = "Bad credentials";
                    loginService.emitPasswordLoginError(errorMessage);
                    fixture.detectChanges();

                    checkVisible(fixture, Elements.PASSWORD_METHOD_ERROR, true);

                    const inputElement: HTMLInputElement = getElementByDataTestId(
                        fixture,
                        inputElemenName,
                    ) as HTMLInputElement;
                    inputElement.dispatchEvent(new KeyboardEvent("keyup", { key: " " }));

                    fixture.detectChanges();

                    checkVisible(fixture, Elements.PASSWORD_METHOD_ERROR, false);
                });
            });
        });
    });

    [LoginMethod.GITHUB, LoginMethod.PASSWORD].forEach((loginMethod: LoginMethod) => {
        describe("One-method-config", () => {
            let spyGotoGithub: jasmine.Spy;

            beforeEach(() => {
                appConfigService = TestBed.inject(AppConfigService);
                spyOnProperty(appConfigService, "featureFlags", "get").and.returnValue({
                    enableLogout: true,
                });
                spyOnProperty(loginService, "loginMethods", "get").and.returnValue([loginMethod]);

                spyGotoGithub = spyOn(LoginService, "gotoGithub").and.stub();

                createFixture();
            });

            it("should auto-select the only available method", () => {
                expect(component.selectedLoginMethod).toEqual(loginMethod);

                switch (loginMethod) {
                    case LoginMethod.GITHUB:
                        expect(spyGotoGithub).toHaveBeenCalledTimes(1);
                        break;

                    case LoginMethod.PASSWORD:
                        expect(spyGotoGithub).not.toHaveBeenCalled();
                        break;
                }
            });
        });
    });

    describe("Zero-method-config", () => {
        beforeEach(() => {
            appConfigService = TestBed.inject(AppConfigService);
            spyOnProperty(appConfigService, "featureFlags", "get").and.returnValue({
                enableLogout: true,
            });
            spyOnProperty(loginService, "loginMethods", "get").and.returnValue([]);
        });

        it("component should throw error", () => {
            expect(() => createFixture()).toThrow(new Error(LoginComponent.ERROR_ZERO_METHODS_IN_CONFIG));
        });
    });
});
