import { TestBed } from "@angular/core/testing";
import { ApolloTestingModule } from "apollo-angular/testing";

import { LoginGuard } from "./login.guard";
import ProjectLinks from "src/app/project-links";
import { LoginMethod } from "src/app/app-config.model";
import { ActivatedRouteSnapshot, RouterStateSnapshot } from "@angular/router";
import { LoginService } from "../login/login.service";

describe("LoginGuard", () => {
    let guard: LoginGuard;
    let loginService: LoginService;
    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [ApolloTestingModule],
        });
        guard = TestBed.inject(LoginGuard);
        loginService = TestBed.inject(LoginService);
    });

    it("should be created", () => {
        expect(guard).toBeTruthy();
    });

    interface TestCase {
        route: string;
        loginMethods: LoginMethod[];
        expectedResult: boolean;
    }

    [
        {
            route: ProjectLinks.URL_LOGIN,
            loginMethods: [LoginMethod.PASSWORD],
            expectedResult: true,
        },
        {
            route: ProjectLinks.URL_LOGIN,
            loginMethods: [],
            expectedResult: false,
        },
        {
            route: ProjectLinks.URL_SEARCH,
            loginMethods: [LoginMethod.PASSWORD],
            expectedResult: true,
        },
        {
            route: ProjectLinks.URL_SEARCH,
            loginMethods: [],
            expectedResult: true,
        },
    ].forEach((testCase: TestCase) => {
        it(`should check route ${testCase.route} with login ${
            testCase.loginMethods.length > 0 ? "enabled" : "disabled"
        }`, () => {
            spyOnProperty(loginService, "loginMethods", "get").and.returnValue(testCase.loginMethods);
            const result = guard.canActivate(new ActivatedRouteSnapshot(), {
                url: "/" + testCase.route,
            } as RouterStateSnapshot);
            expect(result).toEqual(testCase.expectedResult);
        });
    });
});
