/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { ComponentFixture, TestBed } from "@angular/core/testing";

import { Apollo } from "apollo-angular";

import { PageNotFoundComponent } from "@common/components/page-not-found/page-not-found.component";
import { requireValue } from "@common/helpers/app.helpers";
import { emitClickOnElementByDataTestId } from "@common/helpers/base-test.helpers.spec";

import { LoggedUserService } from "src/app/auth/logged-user.service";
import { NavigationService } from "src/app/services/navigation.service";

describe("PageNotFoundComponent", () => {
    let component: PageNotFoundComponent;
    let fixture: ComponentFixture<PageNotFoundComponent>;
    let navigationService: NavigationService;
    let loggedUserService: LoggedUserService;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [PageNotFoundComponent],
            providers: [Apollo],
        }).compileComponents();

        fixture = TestBed.createComponent(PageNotFoundComponent);
        navigationService = TestBed.inject(NavigationService);
        loggedUserService = TestBed.inject(LoggedUserService);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });

    it("should redirect to home page", () => {
        const navigateToHomeSpy = vi.spyOn(navigationService, "navigateToHome").mockReturnValue();
        component.navigateToHome();
        expect(navigateToHomeSpy).toHaveBeenCalledWith();
    });

    it("should navigate to login page", () => {
        vi.spyOn(loggedUserService, "isAuthenticated", "get").mockReturnValue(false);
        const navigateToHomeSpy = vi.spyOn(navigationService, "navigateToLogin").mockReturnValue();
        emitClickOnElementByDataTestId(fixture, "navigate-to-login-btn");
        expect(navigateToHomeSpy).toHaveBeenCalledTimes(1);
        expect(requireValue(navigateToHomeSpy.mock.lastCall ?? null).length).toEqual(1);
    });
});
