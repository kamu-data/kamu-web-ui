/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { NavigationService } from "src/app/services/navigation.service";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { PageNotFoundComponent } from "./page-not-found.component";
import { LoggedUserService } from "src/app/auth/logged-user.service";
import { emitClickOnElementByDataTestId } from "../../helpers/base-test.helpers.spec";
import { Apollo } from "apollo-angular";

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
