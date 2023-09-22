import { NavigationService } from "src/app/services/navigation.service";
import { Apollo } from "apollo-angular";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { ActivatedRoute } from "@angular/router";
import { of } from "rxjs";
import { AuthApi } from "src/app/api/auth.api";
import { GithubCallbackComponent } from "./github.callback";
import { GithubLoginCredentials } from "src/app/api/auth.api.model";
import { mockGithubLoginResponse } from "src/app/api/mock/auth.mock";

describe("GithubCallbackComponent", () => {
    let component: GithubCallbackComponent;
    let fixture: ComponentFixture<GithubCallbackComponent>;
    let authApiService: AuthApi;
    let navigationService: NavigationService;
    const GITHUB_TEST_CODE = "11111111";

    beforeEach(async () => {
        await TestBed.configureTestingModule({
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

        fixture = TestBed.createComponent(GithubCallbackComponent);
        component = fixture.componentInstance;
        authApiService = TestBed.inject(AuthApi);
        navigationService = TestBed.inject(NavigationService);
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });

    it("should call fetchAccountAndTokenFromGithubCallackCode method", () => {
        const navigateToHomeSpy = spyOn(navigationService, "navigateToHome");
        const fetchAccountAndTokenSpy = spyOn(
            authApiService,
            "fetchAccountAndTokenFromGithubCallackCode",
        ).and.returnValue(of(mockGithubLoginResponse.auth.login));
        component.ngOnInit();

        expect(fetchAccountAndTokenSpy).toHaveBeenCalledWith({ code: GITHUB_TEST_CODE } as GithubLoginCredentials);
        expect(navigateToHomeSpy).toHaveBeenCalledWith();
    });
});
