import { TestBed } from "@angular/core/testing";
import { ApolloTestingModule } from "apollo-angular/testing";
import { AuthApi } from "../api/auth.api";

import { AuthenticationGuard } from "./authentication.guard";

describe("AuthenticationGuard", () => {
    let guard: AuthenticationGuard;
    let authApi: AuthApi;
    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [ApolloTestingModule],
        });
        guard = TestBed.inject(AuthenticationGuard);
        authApi = TestBed.inject(AuthApi);
    });

    it("should be created", () => {
        expect(guard).toBeTruthy();
    });

    [true, false].forEach((expectation: boolean) => {
        it(`should check canActive method when user is${expectation ? "" : "not"} authentiсation`, () => {
            const isAuthenticatedSpy = spyOnProperty(authApi, "isAuthenticated", "get").and.returnValue(expectation);
            const result = guard.canActivate();
            expect(result).toEqual(expectation);
            expect(isAuthenticatedSpy).toHaveBeenCalledWith();
        });
    });
});
