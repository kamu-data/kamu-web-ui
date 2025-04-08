/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { ComponentFixture, TestBed, fakeAsync, flush, tick } from "@angular/core/testing";
import { Location } from "@angular/common";
import { Router } from "@angular/router";
import { RouterTestingModule } from "@angular/router/testing";
import { routes } from "./app-routing.module";
import ProjectLinks from "./project-links";
import { promiseWithCatch } from "./common/helpers/app.helpers";
import { ApolloTestingModule } from "apollo-angular/testing";
import { NO_ERRORS_SCHEMA } from "@angular/core";
import { LoggedUserService } from "./auth/logged-user.service";
import { PageNotFoundComponent } from "./common/components/page-not-found/page-not-found.component";
import { LoginComponent } from "./auth/login/login.component";
import { LoginService } from "./auth/login/login.service";
import { LoginMethod } from "./app-config.model";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { accountSettingsAccessTokensResolver } from "./common/resolvers/account-settings-access-tokens.resolver";
import { ToastrModule } from "ngx-toastr";
import { mockAccountDetails } from "./api/mock/auth.mock";
import { of } from "rxjs";
import { AccessTokenConnection } from "./api/kamu.graphql.interface";
import { mockListAccessTokensQuery } from "./api/mock/access-token.mock";
import { searchResolver } from "./common/resolvers/search.resolver";
import { mockDatasetSearchResult } from "./search/mock.data";

describe("Router", () => {
    let router: Router;
    let fixture: ComponentFixture<PageNotFoundComponent>; // any component is fine, we are testing router
    let location: Location;
    let loggedUserService: LoggedUserService;
    let loginService: LoginService;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [
                RouterTestingModule.withRoutes(routes),
                ApolloTestingModule,
                HttpClientTestingModule,
                ToastrModule.forRoot(),
            ],
            declarations: [PageNotFoundComponent, LoginComponent],
            schemas: [NO_ERRORS_SCHEMA],
            providers: [
                {
                    provide: accountSettingsAccessTokensResolver,
                    useValue: {
                        resolve: () => of(mockListAccessTokensQuery.auth.listAccessTokens as AccessTokenConnection),
                    },
                },
                {
                    provide: searchResolver,
                    useValue: {
                        resolve: () => of(mockDatasetSearchResult),
                    },
                },
            ],
        }).compileComponents();

        router = TestBed.inject(Router);
        location = TestBed.inject(Location);
        loggedUserService = TestBed.inject(LoggedUserService);
        loginService = TestBed.inject(LoginService);

        fixture = TestBed.createComponent(PageNotFoundComponent);
        router.initialNavigation();
        fixture.detectChanges();
    });

    it("navigate to home redirects you to default URL", fakeAsync(() => {
        promiseWithCatch(router.navigate([""]));
        tick();

        expect(location.path()).toBe("/" + ProjectLinks.DEFAULT_URL);
        flush();
    }));

    [
        ProjectLinks.URL_GITHUB_CALLBACK,
        ProjectLinks.URL_SEARCH,
        `myaccount/mydataset`,
        ProjectLinks.URL_PAGE_NOT_FOUND,
    ].forEach((url: string) => {
        it(`Route to ${url} lands on the component without Login`, fakeAsync(() => {
            promiseWithCatch(router.navigate([url]));
            tick();

            expect(location.path()).toBe("/" + url);
            flush();
        }));
    });

    [ProjectLinks.URL_DATASET_CREATE, ProjectLinks.URL_SETTINGS].forEach((url: string) => {
        it(`Route to ${url} fails without a login and moves to Home`, fakeAsync(() => {
            promiseWithCatch(router.navigate([url]));
            tick();

            expect(location.path()).toBe("/" + ProjectLinks.DEFAULT_URL);
            flush();
        }));

        it(`Route to ${url} lands on the component with active login`, fakeAsync(() => {
            spyOnProperty(loggedUserService, "isAuthenticated", "get").and.returnValue(true);
            spyOnProperty(loggedUserService, "currentlyLoggedInUser", "get").and.returnValue(mockAccountDetails);
            promiseWithCatch(router.navigate([url]));
            tick();
            if (url === ProjectLinks.URL_SETTINGS) {
                expect(location.path()).toBe("/" + url + "/access-tokens");
            } else {
                expect(location.path()).toBe("/" + url);
            }
            flush();
        }));

        it("should navigate to QueryExplainer component", async () => {
            await router.navigate([ProjectLinks.URL_QUERY_EXPLAINER]);
            expect(router.url).toBe("/" + ProjectLinks.URL_QUERY_EXPLAINER);
        });

        it("should navigate to GlobalQuery component", async () => {
            await router.navigate([ProjectLinks.URL_QUERY]);
            expect(router.url).toBe("/" + ProjectLinks.URL_QUERY);
        });
    });

    describe("#login routes", () => {
        it("login redirects to default page when not allowed in configuration", fakeAsync(() => {
            spyOnProperty(loginService, "loginMethods", "get").and.returnValue([]);

            promiseWithCatch(router.navigate([ProjectLinks.URL_LOGIN]));
            tick();

            expect(location.path()).toBe("/" + ProjectLinks.URL_SEARCH);
            flush();
        }));

        it("login redirects to default page when user is already logged", fakeAsync(() => {
            spyOnProperty(loggedUserService, "isAuthenticated", "get").and.returnValue(true);

            promiseWithCatch(router.navigate([ProjectLinks.URL_LOGIN]));
            tick();

            expect(location.path()).toBe("/" + ProjectLinks.URL_SEARCH);
            flush();
        }));

        it("login opens Login component when allowed and not logged in", fakeAsync(() => {
            spyOnProperty(loginService, "loginMethods", "get").and.returnValue([LoginMethod.PASSWORD]);
            spyOnProperty(loggedUserService, "isAuthenticated", "get").and.returnValue(false);

            promiseWithCatch(router.navigate([ProjectLinks.URL_LOGIN]));
            tick();

            expect(location.path()).toBe("/" + ProjectLinks.URL_LOGIN);
            flush();
        }));
    });
});
