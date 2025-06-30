/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { NavigationService } from "src/app/services/navigation.service";
import { Apollo } from "apollo-angular";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { AuthApi } from "src/app/api/auth.api";
import { GithubCallbackComponent } from "./github.callback";
import { GithubLoginCredentials } from "src/app/api/auth.api.model";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { LoginService } from "../login.service";
import { SharedTestModule } from "src/app/common/modules/shared-test.module";

describe("GithubCallbackComponent", () => {
    let component: GithubCallbackComponent;
    let fixture: ComponentFixture<GithubCallbackComponent>;
    let navigationService: NavigationService;
    let loginService: LoginService;

    let navigateToHomeSpy: jasmine.Spy;
    let githubLoginSpy: jasmine.Spy;

    const GITHUB_TEST_CODE = "11111111";

    beforeEach(async () => {
        await TestBed.configureTestingModule({
    imports: [HttpClientTestingModule, SharedTestModule, GithubCallbackComponent],
    providers: [AuthApi, Apollo],
}).compileComponents();

        navigationService = TestBed.inject(NavigationService);
        navigateToHomeSpy = spyOn(navigationService, "navigateToHome").and.stub();

        loginService = TestBed.inject(LoginService);
        githubLoginSpy = spyOn(loginService, "githubLogin");

        fixture = TestBed.createComponent(GithubCallbackComponent);
        component = fixture.componentInstance;
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });

    it("should call githubLogin method", () => {
        component.code = GITHUB_TEST_CODE;
        fixture.detectChanges();

        expect(githubLoginSpy).toHaveBeenCalledWith({ code: GITHUB_TEST_CODE } as GithubLoginCredentials);
    });

    it("should don't call githubLogin method", () => {
        component.code = "";
        fixture.detectChanges();

        expect(githubLoginSpy).toHaveBeenCalledTimes(0);
        expect(navigateToHomeSpy).toHaveBeenCalledTimes(1);
    });
});
