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

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [GithubCallbackComponent],
            schemas: [CUSTOM_ELEMENTS_SCHEMA],
            providers: [
                {
                    provide: ActivatedRoute,
                    useValue: {
                        queryParams: of({ code: "11111111" }),
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

    it("should create", async () => {
        await expect(component).toBeTruthy();
    });

    it("should call fetchUserInfoAndTokenFromGithubCallackCode method", async () => {
        const navigateToHomeSpy = spyOn(navigationService, "navigateToHome");
        const fetchUserInfoAndTokenSpy = spyOn(
            authApiService,
            "fetchUserInfoAndTokenFromGithubCallackCode",
        ).and.returnValue(of(undefined));
        component.ngOnInit();
        await expect(fetchUserInfoAndTokenSpy).toHaveBeenCalled();
        await expect(navigateToHomeSpy).toHaveBeenCalled();
    });
});
