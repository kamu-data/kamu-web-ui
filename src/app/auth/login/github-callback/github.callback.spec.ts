/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { provideHttpClient } from "@angular/common/http";
import { provideHttpClientTesting } from "@angular/common/http/testing";
import { ComponentFixture, TestBed } from "@angular/core/testing";

import { Apollo } from "apollo-angular";
import type { Mock } from "vitest";

import { setComponentInput } from "@common/helpers/base-test.helpers.spec";
import { SharedTestModule } from "@common/modules/shared-test.module";
import { AuthApi } from "@api/auth.api";

import { GithubCallbackComponent } from "src/app/auth/login/github-callback/github.callback";
import { LoginService } from "src/app/auth/login/login.service";
import { NavigationService } from "src/app/services/navigation.service";
import { SessionStorageService } from "src/app/services/session-storage.service";

describe("GithubCallbackComponent", () => {
    let component: GithubCallbackComponent;
    let fixture: ComponentFixture<GithubCallbackComponent>;
    let navigationService: NavigationService;
    let loginService: LoginService;
    let sessionStorageService: SessionStorageService;

    let navigateToHomeSpy: Mock;
    let navigateToLoginSpy: Mock;
    let githubLoginSpy: Mock;

    const GITHUB_TEST_CODE = "11111111";
    const TEST_STATE = "0123456789abcdef0123456789abcdef";
    const TEST_REDIRECT_URL = "/kamu/dataset?tab=flows&page=2";

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [SharedTestModule, GithubCallbackComponent],
            providers: [AuthApi, Apollo, provideHttpClient(), provideHttpClientTesting()],
        }).compileComponents();

        navigationService = TestBed.inject(NavigationService);
        navigateToHomeSpy = vi.spyOn(navigationService, "navigateToHome").mockImplementation(() => {});
        navigateToLoginSpy = vi.spyOn(navigationService, "navigateToLogin").mockImplementation(() => {});

        sessionStorageService = TestBed.inject(SessionStorageService);
        sessionStorageService.reset();

        loginService = TestBed.inject(LoginService);
        githubLoginSpy = vi.spyOn(loginService, "githubLogin").mockImplementation(() => {});

        fixture = TestBed.createComponent(GithubCallbackComponent);
        component = fixture.componentInstance;
    });

    afterEach(() => {
        sessionStorageService.reset();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });

    it("should sign in with the code when state matches the pending sign-in", () => {
        sessionStorageService.setGithubLoginState({ state: TEST_STATE, redirectUrl: TEST_REDIRECT_URL });
        setCallbackParams({ code: GITHUB_TEST_CODE, state: TEST_STATE });

        expect(githubLoginSpy).toHaveBeenCalledTimes(1);

        expect(githubLoginSpy).toHaveBeenCalledWith({ code: GITHUB_TEST_CODE }, TEST_REDIRECT_URL);
        expect(navigateToLoginSpy).not.toHaveBeenCalled();
        expect(sessionStorageService.takeGithubLoginState()).toBeNull();
    });

    [
        { description: "state does not match the pending sign-in", pendingState: TEST_STATE, state: "forged" },
        { description: "state is missing", pendingState: TEST_STATE, state: undefined },
        { description: "both states are empty", pendingState: "", state: "" },
        { description: "this tab started no sign-in", pendingState: null, state: TEST_STATE },
    ].forEach(({ description, pendingState, state }) => {
        it(`should not sign in with the code when ${description}`, () => {
            if (pendingState !== null) {
                sessionStorageService.setGithubLoginState({ state: pendingState, redirectUrl: null });
            }
            setCallbackParams({ code: GITHUB_TEST_CODE, state });

            expect(githubLoginSpy).not.toHaveBeenCalled();
            expect(navigateToHomeSpy).toHaveBeenCalledTimes(1);
        });
    });

    it("should return to the login page with the redirect URL when sign-in on GitHub was cancelled", () => {
        sessionStorageService.setGithubLoginState({ state: TEST_STATE, redirectUrl: TEST_REDIRECT_URL });
        setCallbackParams({ state: TEST_STATE });

        expect(githubLoginSpy).not.toHaveBeenCalled();
        expect(navigateToLoginSpy).toHaveBeenCalledTimes(1);
        expect(navigateToLoginSpy).toHaveBeenCalledWith(TEST_REDIRECT_URL);
    });

    it("should go home without a code or a pending sign-in", () => {
        setCallbackParams({});

        expect(githubLoginSpy).not.toHaveBeenCalled();
        expect(navigateToHomeSpy).toHaveBeenCalledTimes(1);
    });

    function setCallbackParams(params: { code?: string; state?: string }): void {
        setComponentInput(fixture, "code", params.code);
        setComponentInput(fixture, "state", params.state);
        fixture.detectChanges();
    }
});
