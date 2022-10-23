import { NavigationService } from "src/app/services/navigation.service";
import { Apollo } from "apollo-angular";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { ActivatedRoute } from "@angular/router";
import { of } from "rxjs";
import { AuthApi } from "src/app/api/auth.api";
import { GithubCallbackComponent } from "./github.callback";
import { CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";

describe("GithubCallbackComponent", () => {
    let component: GithubCallbackComponent;
    let fixture: ComponentFixture<GithubCallbackComponent>;
    let authApiService: AuthApi;
    let navigationService: NavigationService;

    const GITHUB_TEST_CODE = "11111111";

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [GithubCallbackComponent],
            schemas: [CUSTOM_ELEMENTS_SCHEMA],
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

    it("should call fetchUserInfoAndTokenFromGithubCallackCode method", () => {
        const navigateToHomeSpy = spyOn(navigationService, "navigateToHome");
        const fetchUserInfoAndTokenSpy = spyOn(
            authApiService,
            "fetchUserInfoAndTokenFromGithubCallackCode",
        ).and.returnValue(of(undefined));
        component.ngOnInit();

        expect(fetchUserInfoAndTokenSpy).toHaveBeenCalledWith(GITHUB_TEST_CODE);
        expect(navigateToHomeSpy).toHaveBeenCalledWith();
    });
});
