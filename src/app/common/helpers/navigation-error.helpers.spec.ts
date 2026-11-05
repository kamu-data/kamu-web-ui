/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { Location } from "@angular/common";
import { provideLocationMocks } from "@angular/common/testing";
import { Component, ErrorHandler } from "@angular/core";
import { TestBed } from "@angular/core/testing";
import { NavigationError, provideRouter, RedirectCommand, Router, withNavigationErrorHandler } from "@angular/router";
import { RouterTestingHarness } from "@angular/router/testing";

import { throwError } from "rxjs";

import { Mock } from "vitest";

import { PageLoadFailedComponent } from "@common/components/page-load-failed/page-load-failed.component";
import { expectRedirectTo, stubMethod } from "@common/helpers/base-test.helpers.spec";
import { pageLoadFailedOnInitialNavigation } from "@common/helpers/navigation-error.helpers";
import { AccountNotFoundError, DatasetNotFoundError } from "@common/values/errors";
import { MaybeUndefined } from "@interface/app.types";

import ProjectLinks from "src/app/project-links";

describe("pageLoadFailedOnInitialNavigation", () => {
    let router: Router;
    let handleErrorSpy: Mock<ErrorHandler["handleError"]>;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        router = TestBed.inject(Router);
        handleErrorSpy = stubMethod(TestBed.inject(ErrorHandler), "handleError");
    });

    function handle(error: unknown): MaybeUndefined<RedirectCommand> {
        const navigationError = new NavigationError(1, "/kamu/dataset", error);
        return TestBed.runInInjectionContext(() => pageLoadFailedOnInitialNavigation(navigationError));
    }

    it("should report the error and show the page-load-failed view when the first page fails", () => {
        const error = new Error("Server unreachable");

        const redirect = handle(error);

        expectRedirectTo(redirect, `/${ProjectLinks.URL_PAGE_LOAD_FAILED}`);
        expect(redirect?.navigationBehaviorOptions?.skipLocationChange).toBe(true);
        expect(handleErrorSpy).toHaveBeenCalledWith(error);
    });

    it("should leave a failed later navigation to the router", () => {
        router.navigated = true;

        expect(handle(new Error("Server unreachable"))).toBeUndefined();
        expect(handleErrorSpy).not.toHaveBeenCalled();
    });

    [
        { name: "a missing dataset", error: new DatasetNotFoundError() },
        { name: "a missing account", error: new AccountNotFoundError() },
    ].forEach(({ name, error }) => {
        it(`should leave ${name} to the error handler, which shows page not found`, () => {
            expect(handle(error)).toBeUndefined();
            expect(handleErrorSpy).not.toHaveBeenCalled();
        });
    });
});

describe("pageLoadFailedOnInitialNavigation in the router", () => {
    const FAILING_PATH = "failing";
    const WORKING_PATH = "working";

    @Component({ template: "" })
    class EmptyPageComponent {}

    let router: Router;
    let location: Location;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                provideRouter(
                    [
                        { path: WORKING_PATH, component: EmptyPageComponent },
                        {
                            path: FAILING_PATH,
                            component: EmptyPageComponent,
                            resolve: { data: () => throwError(() => new Error("Server unreachable")) },
                        },
                        { path: ProjectLinks.URL_PAGE_LOAD_FAILED, component: PageLoadFailedComponent },
                    ],
                    withNavigationErrorHandler(pageLoadFailedOnInitialNavigation),
                ),
                provideLocationMocks(),
            ],
        });
        stubMethod(TestBed.inject(ErrorHandler), "handleError");
        router = TestBed.inject(Router);
        location = TestBed.inject(Location);
    });

    it("should show the page-load-failed view and keep the requested URL when the first page fails", async () => {
        // The app starts from the URL the browser opened
        location.go(`/${FAILING_PATH}`);
        const harness = await RouterTestingHarness.create();

        router.initialNavigation();
        await harness.fixture.whenStable();

        expect(router.url).toEqual(`/${ProjectLinks.URL_PAGE_LOAD_FAILED}`);
        expect(location.path()).toEqual(`/${FAILING_PATH}`);
    });

    it("should stay on the current page when a later navigation fails", async () => {
        const harness = await RouterTestingHarness.create(`/${WORKING_PATH}`);

        await expect(harness.navigateByUrl(`/${FAILING_PATH}`)).rejects.toThrow("Server unreachable");

        expect(router.url).toEqual(`/${WORKING_PATH}`);
    });
});
