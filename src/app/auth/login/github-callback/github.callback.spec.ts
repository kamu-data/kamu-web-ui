import { NavigationService } from "src/app/services/navigation.service";
import { Apollo } from "apollo-angular";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { ActivatedRoute } from "@angular/router";
import { of } from "rxjs";
import { AuthApi } from "src/app/api/auth.api";
import { GithubCallbackComponent } from "./github.callback";
import { GithubLoginCredentials } from "src/app/api/auth.api.model";
import { TEST_ACCESS_TOKEN_GITHUB, mockGithubLoginResponse } from "src/app/api/mock/auth.mock";
import { HttpClientTestingModule, HttpTestingController } from "@angular/common/http/testing";
import { LoginCallbackResponse } from "../login.component.model";
import { LocalStorageService } from "src/app/services/local-storage.service";

describe("GithubCallbackComponent", () => {
    let component: GithubCallbackComponent;
    let fixture: ComponentFixture<GithubCallbackComponent>;
    let authApiService: AuthApi;
    let navigationService: NavigationService;
    let localStorageService: LocalStorageService;
    let httpController: HttpTestingController;

    let navigateToHomeSpy: jasmine.Spy;

    const GITHUB_TEST_CODE = "11111111";

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            declarations: [GithubCallbackComponent],
            providers: [
                {
                    provide: ActivatedRoute,
                    useValue: {
                        queryParams: of({ code: GITHUB_TEST_CODE }),
                    },
                },
                AuthApi,
                Apollo,
            ],
        }).compileComponents();

        navigationService = TestBed.inject(NavigationService);
        navigateToHomeSpy = spyOn(navigationService, "navigateToHome").and.stub();

        localStorageService = TestBed.inject(LocalStorageService);
        localStorageService.reset();

        fixture = TestBed.createComponent(GithubCallbackComponent);
        component = fixture.componentInstance;
        authApiService = TestBed.inject(AuthApi);
        httpController = TestBed.inject(HttpTestingController);

        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });

    it("should call fetchAccountAndTokenFromGithubCallbackCode method in normal mode", () => {
        navigateToHomeSpy.calls.reset();
        const callbackUrlSpy = spyOnProperty(localStorageService, "loginCallbackUrl", "get").and.returnValue(null);

        const fetchAccountAndTokenSpy = spyOn(
            authApiService,
            "fetchAccountAndTokenFromGithubCallbackCode",
        ).and.returnValue(of(mockGithubLoginResponse.auth.login));

        component.ngOnInit();

        expect(fetchAccountAndTokenSpy).toHaveBeenCalledWith({ code: GITHUB_TEST_CODE } as GithubLoginCredentials);
        expect(navigateToHomeSpy).toHaveBeenCalledWith();
        expect(callbackUrlSpy).toHaveBeenCalledTimes(1);
    });

    it("should call fetchAccountAndTokenFromGithubCallbackCode method with callback URL", () => {
        const SOME_CALLBACK_URL = "http://www.example.com";
        const callbackUrlSpy = spyOnProperty(localStorageService, "loginCallbackUrl", "get").and.returnValue(
            SOME_CALLBACK_URL,
        );
        const callbackUrlSetSpy = spyOn(localStorageService, "setLoginCallbackUrl");

        const navigateToReturnToCliSpy = spyOn(navigationService, "navigateToReturnToCli").and.stub();
        const fetchAccountAndTokenSpy = spyOn(
            authApiService,
            "fetchAccountAndTokenFromGithubCallbackCode",
        ).and.returnValue(of(mockGithubLoginResponse.auth.login));

        component.ngOnInit();

        const callbackUrlRequest = httpController.expectOne({
            method: "POST",
            url: SOME_CALLBACK_URL,
        });

        expect(callbackUrlRequest.request.body).toEqual({
            accessToken: TEST_ACCESS_TOKEN_GITHUB,
            backendUrl: "http://localhost:8080",
        } as LoginCallbackResponse);
        callbackUrlRequest.flush({});

        expect(fetchAccountAndTokenSpy).toHaveBeenCalledWith({ code: GITHUB_TEST_CODE } as GithubLoginCredentials);
        expect(navigateToReturnToCliSpy).toHaveBeenCalledTimes(1);
        expect(callbackUrlSpy).toHaveBeenCalledTimes(1);
        expect(callbackUrlSetSpy).toHaveBeenCalledOnceWith(null);
    });
});
