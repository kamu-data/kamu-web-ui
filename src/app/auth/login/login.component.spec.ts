import { ComponentFixture, TestBed } from "@angular/core/testing";
import { LoginComponent } from "./login.component";
import { ReactiveFormsModule } from "@angular/forms";
import { Apollo } from "apollo-angular";
import { ApolloTestingModule } from "apollo-angular/testing";
import { AngularSvgIconModule } from "angular-svg-icon";
import { HttpClientTestingModule, HttpTestingController } from "@angular/common/http/testing";
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
import {
    TEST_ACCESS_TOKEN_PASSWORD,
    TEST_LOGIN,
    TEST_PASSWORD,
    mockPasswordLoginResponse,
} from "src/app/api/mock/auth.mock";
import { PasswordLoginCredentials } from "src/app/api/auth.api.model";
import { BehaviorSubject, of } from "rxjs";
import { LoginCallbackResponse, LoginPageQueryParams } from "./login.component.model";
import { ActivatedRoute } from "@angular/router";
import { AuthApi } from "src/app/api/auth.api";
import { NavigationService } from "src/app/services/navigation.service";
import { LocalStorageService } from "src/app/services/local-storage.service";

describe("LoginComponent", () => {
    let component: LoginComponent;
    let fixture: ComponentFixture<LoginComponent>;
    let appConfigService: AppConfigService;
    let loginService: LoginService;
    let navigationService: NavigationService;
    let localStorageService: LocalStorageService;
    let authApi: AuthApi;
    let httpController: HttpTestingController;
    const MOCK_FEATURE_FLAGS = {
        enableLogout: true,
        enableScheduling: true,
        enableDatasetEnvVarsManagment: true,
        enableTermsOfService: true,
    };

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

    const mockQueryParams: BehaviorSubject<LoginPageQueryParams> = new BehaviorSubject<LoginPageQueryParams>({});

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [LoginComponent, SpinnerComponent],
            providers: [
                Apollo,
                {
                    provide: ActivatedRoute,
                    useValue: {
                        queryParams: mockQueryParams.asObservable(),
                    },
                },
            ],
            imports: [
                ApolloTestingModule,
                ReactiveFormsModule,
                AngularSvgIconModule.forRoot(),
                HttpClientTestingModule,
            ],
        }).compileComponents();

        localStorageService = TestBed.inject(LocalStorageService);
        localStorageService.reset();

        loginService = TestBed.inject(LoginService);
        navigationService = TestBed.inject(NavigationService);

        authApi = TestBed.inject(AuthApi);
        httpController = TestBed.inject(HttpTestingController);
    });

    function createFixture() {
        fixture = TestBed.createComponent(LoginComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    }

    describe("Main test suite", () => {
        beforeEach(() => {
            appConfigService = TestBed.inject(AppConfigService);
            spyOnProperty(appConfigService, "featureFlags", "get").and.returnValue(MOCK_FEATURE_FLAGS);
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
            const spyGotoGithub = spyOn(loginService, "gotoGithub").and.stub();

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
                loginService.emitPasswordLoginErrorOccurred(errorMessage);
                fixture.detectChanges();

                checkVisible(fixture, Elements.PASSWORD_METHOD_ERROR, true);
            });

            [Elements.INPUT_LOGIN, Elements.INPUT_PASSWORD].forEach((inputElementName: Elements) => {
                it(`Error is cleared after touching input ${inputElementName}`, () => {
                    const errorMessage = "Bad credentials";
                    loginService.emitPasswordLoginErrorOccurred(errorMessage);
                    fixture.detectChanges();

                    checkVisible(fixture, Elements.PASSWORD_METHOD_ERROR, true);

                    const inputElement: HTMLInputElement = getElementByDataTestId(
                        fixture,
                        inputElementName,
                    ) as HTMLInputElement;
                    inputElement.dispatchEvent(new KeyboardEvent("keyup", { key: " " }));

                    fixture.detectChanges();

                    checkVisible(fixture, Elements.PASSWORD_METHOD_ERROR, false);
                });
            });
        });

        it("login callback setup in localStorage via query parameter", () => {
            const SOME_CALLBACK_URL = "http://example.com/some-callback";
            mockQueryParams.next({ callbackUrl: SOME_CALLBACK_URL } as LoginPageQueryParams);
            fixture.detectChanges();

            const authApiSpy = spyOn(authApi, "fetchAccountAndTokenFromPasswordLogin").and.returnValue(
                of(mockPasswordLoginResponse.auth.login),
            );
            const navigationSpy = spyOn(navigationService, "navigateToReturnToCli").and.stub();

            const credentials: PasswordLoginCredentials = { login: TEST_LOGIN, password: TEST_PASSWORD };
            loginService.passwordLogin(credentials);

            expect(authApiSpy).toHaveBeenCalledOnceWith(credentials);

            const callbackUrlRequest = httpController.expectOne({
                method: "POST",
                url: SOME_CALLBACK_URL,
            });
            expect(callbackUrlRequest.request.body).toEqual({
                accessToken: TEST_ACCESS_TOKEN_PASSWORD,
                backendUrl: "http://localhost:8080",
            } as LoginCallbackResponse);
            callbackUrlRequest.flush({});

            expect(navigationSpy).toHaveBeenCalledTimes(1);
        });
    });

    [LoginMethod.GITHUB, LoginMethod.PASSWORD].forEach((loginMethod: LoginMethod) => {
        describe("One-method-config", () => {
            let spyGotoGithub: jasmine.Spy;

            beforeEach(() => {
                appConfigService = TestBed.inject(AppConfigService);
                spyOnProperty(appConfigService, "featureFlags", "get").and.returnValue(MOCK_FEATURE_FLAGS);
                spyOnProperty(loginService, "loginMethods", "get").and.returnValue([loginMethod]);

                spyGotoGithub = spyOn(loginService, "gotoGithub").and.stub();

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
            spyOnProperty(appConfigService, "featureFlags", "get").and.returnValue(MOCK_FEATURE_FLAGS);
            spyOnProperty(loginService, "loginMethods", "get").and.returnValue([]);
        });

        it("component should throw error", () => {
            expect(() => createFixture()).toThrow(new Error(LoginComponent.ERROR_ZERO_METHODS_IN_CONFIG));
        });
    });
});
