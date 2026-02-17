/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { ComponentFixture, TestBed } from "@angular/core/testing";

import { Apollo } from "apollo-angular";
import { LoggedUserService } from "src/app/auth/logged-user.service";
import { NavigationService } from "src/app/services/navigation.service";

import { PageNotFoundComponent } from "@common/components/page-not-found/page-not-found.component";
import { emitClickOnElementByDataTestId } from "@common/helpers/base-test.helpers.spec";

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
        const navigateToHomeSpy = spyOn(navigationService, "navigateToHome").and.returnValue();
        component.navigateToHome();
        expect(navigateToHomeSpy).toHaveBeenCalledWith();
    });

    it("should navigate to login page", () => {
        spyOnProperty(loggedUserService, "isAuthenticated", "get").and.returnValue(false);
        const navigateToHomeSpy = spyOn(navigationService, "navigateToLogin").and.returnValue();
        emitClickOnElementByDataTestId(fixture, "navigate-to-login-btn");
        expect(navigateToHomeSpy).toHaveBeenCalledTimes(1);
        expect(navigateToHomeSpy.calls.mostRecent().args.length).toEqual(1);
    });
});
