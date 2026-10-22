/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { Location } from "@angular/common";
import { provideHttpClient } from "@angular/common/http";
import { provideHttpClientTesting } from "@angular/common/http/testing";
import { provideLocationMocks } from "@angular/common/testing";
import { NO_ERRORS_SCHEMA, Provider } from "@angular/core";
import { ComponentFixture, fakeAsync, flush, TestBed, tick } from "@angular/core/testing";
import { Router, ROUTES } from "@angular/router";

import { of } from "rxjs";

import { Apollo } from "apollo-angular";
import { ApolloTestingModule } from "apollo-angular/testing";
import { provideToastr } from "ngx-toastr";

import { PageNotFoundComponent } from "@common/components/page-not-found/page-not-found.component";
import { promiseWithCatch } from "@common/helpers/app.helpers";
import { AccessTokenConnection, AccountProvider } from "@api/kamu.graphql.interface";
import { mockListAccessTokensQuery } from "@api/mock/access-token.mock";
import { mockAccountDetails } from "@api/mock/auth.mock";
import { MaybeUndefined } from "@interface/app.types";

import { accountSettingsAccessTokensResolverFn } from "src/app/account/settings/tabs/access-tokens-tab/resolver/account-settings-access-tokens.resolver";
import { AppConfigService } from "src/app/app-config.service";
import { provideCatchAllRoute, provideConditionalGuardedRoutes, PUBLIC_ROUTES } from "src/app/app-routing";
import { LoggedUserService } from "src/app/auth/logged-user.service";
import { LoginMethodsService } from "src/app/auth/login-methods.service";
import { LoginComponent } from "src/app/auth/login/login.component";
import {
    mockMetadataDerivedUpdate,
    mockOverviewDataUpdate,
    mockOverviewDataUpdateNullable,
} from "src/app/dataset-view/additional-components/data-tabs.mock";
import { datasetOverviewTabResolverFn } from "src/app/dataset-view/additional-components/overview-component/resolver/dataset-overview-tab.resolver";
import { OverviewUpdate } from "src/app/dataset-view/dataset.subscriptions.interface";
import { datasetViewResolverFn } from "src/app/dataset-view/resolvers/dataset-view.resolver";
import ProjectLinks from "src/app/project-links";
import {
    mockDatasetBasicsDerivedFragment,
    mockDatasetSearchResult,
    mockFullPowerDatasetPermissionsFragment,
} from "src/app/search/mock.data";
import { searchResolverFn } from "src/app/search/resolver/search.resolver";

describe("Router", () => {
    let router: Router;
    let fixture: ComponentFixture<PageNotFoundComponent>; // any component is fine, we are testing router
    let location: Location;
    let loggedUserService: LoggedUserService;
    let loginMethodsService: LoginMethodsService;

    async function configureRouter(allowAnonymous: boolean, extraProviders: Provider[] = []): Promise<void> {
        await TestBed.configureTestingModule({
            schemas: [NO_ERRORS_SCHEMA],
            imports: [ApolloTestingModule, PageNotFoundComponent, LoginComponent],
            providers: [
                Apollo,
                {
                    provide: AppConfigService,
                    useValue: {
                        allowAnonymous,
                    },
                },
                {
                    provide: ROUTES,
                    multi: true,
                    useValue: PUBLIC_ROUTES,
                },
                provideConditionalGuardedRoutes(),
                provideCatchAllRoute(),
                provideToastr(),
                {
                    provide: accountSettingsAccessTokensResolverFn,
                    useValue: {
                        resolve: () =>
                            of(
                                mockListAccessTokensQuery.accounts.byId?.accessTokens
                                    .listAccessTokens as AccessTokenConnection,
                            ),
                    },
                },
                {
                    provide: searchResolverFn,
                    useValue: {
                        resolve: () => of(mockDatasetSearchResult),
                    },
                },
                {
                    provide: datasetViewResolverFn,
                    useValue: {
                        resolve: () =>
                            of({
                                datasetBasics: mockDatasetBasicsDerivedFragment,
                                datasetPermissions: mockFullPowerDatasetPermissionsFragment,
                            }),
                    },
                },
                {
                    provide: datasetOverviewTabResolverFn,
                    useValue: {
                        resolve: () =>
                            of({
                                datasetBasics: mockDatasetBasicsDerivedFragment,
                                datasetPermissions: mockFullPowerDatasetPermissionsFragment,
                                overviewUpdate: {
                                    schema: mockMetadataDerivedUpdate.schema,
                                    content: mockOverviewDataUpdate.content,
                                    overview: structuredClone(mockOverviewDataUpdateNullable.overview),
                                    size: mockOverviewDataUpdate.size,
                                } as OverviewUpdate,
                            }),
                    },
                },
                provideHttpClient(),
                provideHttpClientTesting(),
                ...extraProviders,
            ],
        }).compileComponents();

        router = TestBed.inject(Router);
        location = TestBed.inject(Location);
        loggedUserService = TestBed.inject(LoggedUserService);
        loginMethodsService = TestBed.inject(LoginMethodsService);

        fixture = TestBed.createComponent(PageNotFoundComponent);
        router.initialNavigation();
        fixture.detectChanges();
    }

    describe("with anonymous access allowed", () => {
        beforeEach(async () => {
            await configureRouter(true);
        });

        it("navigate to home redirects you to default URL", fakeAsync(() => {
            promiseWithCatch(router.navigate([""]));
            tick();

            expect(location.path()).toBe("/" + ProjectLinks.DEFAULT_URL);
            flush();
        }));

        [ProjectLinks.URL_GITHUB_CALLBACK, ProjectLinks.URL_SEARCH, ProjectLinks.URL_PAGE_NOT_FOUND].forEach(
            (url: string) => {
                it(`Route to ${url} lands on the component without Login`, fakeAsync(() => {
                    promiseWithCatch(router.navigate([url]));
                    tick();

                    expect(location.path()).toBe("/" + url);
                    flush();
                }));
            },
        );

        [ProjectLinks.URL_DATASET_CREATE].forEach((url: string) => {
            it(`Route to ${url} fails without a login and moves to Home`, fakeAsync(() => {
                promiseWithCatch(router.navigate([url]));
                tick();

                expect(location.path()).toBe("/" + ProjectLinks.DEFAULT_URL);
                flush();
            }));

            // A real await, because fakeAsync's tick() cannot wait for the lazy chunk of a loadComponent route
            it(`Route to ${url} lands on the component with active login`, async () => {
                spyOnProperty(loggedUserService, "isAuthenticated", "get").and.returnValue(true);
                spyOnProperty(loggedUserService, "currentlyLoggedInUser", "get").and.returnValue(mockAccountDetails);
                await router.navigate([url]);
                if (url === ProjectLinks.URL_SETTINGS) {
                    expect(location.path()).toBe("/" + url + "/access-tokens");
                } else {
                    expect(location.path()).toBe("/" + url);
                }
            });
        });

        it("should navigate to QueryExplainer component", async () => {
            await router.navigate([ProjectLinks.URL_QUERY_EXPLAINER]);
            expect(router.url).toBe("/" + ProjectLinks.URL_QUERY_EXPLAINER);
        });

        it("should navigate to GlobalQuery component", async () => {
            await router.navigate([ProjectLinks.URL_QUERY]);
            expect(router.url).toBe("/" + ProjectLinks.URL_QUERY);
        });

        // A real await: two-segment URLs also match ":accountName/:datasetName", whose routes load lazily
        it("admin dashboard redirects a user who is not an admin to the default page", async () => {
            spyOnProperty(loggedUserService, "isAdmin", "get").and.returnValue(false);

            await router.navigate([ProjectLinks.URL_ADMIN_DASHBOARD]);

            expect(location.path()).toBe("/" + ProjectLinks.DEFAULT_URL);
        });

        it("an unknown URL lands on the page-not-found component and keeps the URL", async () => {
            await router.navigateByUrl("/v/no/such/page/here");

            expect(location.path()).toBe("/v/no/such/page/here");
            expect(router.routerState.snapshot.root.firstChild?.component).toBe(PageNotFoundComponent);
        });

        describe("#login routes", () => {
            it("login redirects to default page when not allowed in configuration", fakeAsync(() => {
                spyOnProperty(loginMethodsService, "loginMethods", "get").and.returnValue([]);

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

            it("login with a redirect URL opens Login component when allowed and not logged in", fakeAsync(() => {
                spyOnProperty(loginMethodsService, "loginMethods", "get").and.returnValue([AccountProvider.Password]);
                spyOnProperty(loggedUserService, "isAuthenticated", "get").and.returnValue(false);

                promiseWithCatch(
                    router.navigate([ProjectLinks.URL_LOGIN], {
                        queryParams: { [ProjectLinks.URL_QUERY_PARAM_REDIRECT_URL]: "/kamu" },
                    }),
                );
                tick();

                expect(location.path()).toBe(
                    `/${ProjectLinks.URL_LOGIN}?${ProjectLinks.URL_QUERY_PARAM_REDIRECT_URL}=%2Fkamu`,
                );
                flush();
            }));

            it("login with a redirect URL redirects to default page when user is already logged", fakeAsync(() => {
                spyOnProperty(loggedUserService, "isAuthenticated", "get").and.returnValue(true);

                promiseWithCatch(
                    router.navigate([ProjectLinks.URL_LOGIN], {
                        queryParams: { [ProjectLinks.URL_QUERY_PARAM_REDIRECT_URL]: "/kamu" },
                    }),
                );
                tick();

                expect(location.path()).toBe("/" + ProjectLinks.URL_SEARCH);
                flush();
            }));

            it("login opens Login component when allowed and not logged in", fakeAsync(() => {
                spyOnProperty(loginMethodsService, "loginMethods", "get").and.returnValue([AccountProvider.Password]);
                spyOnProperty(loggedUserService, "isAuthenticated", "get").and.returnValue(false);

                promiseWithCatch(router.navigate([ProjectLinks.URL_LOGIN]));
                tick();

                expect(location.path()).toBe("/" + ProjectLinks.URL_LOGIN);
                flush();
            }));
        });
    });

    describe("browser history", () => {
        beforeEach(async () => {
            await configureRouter(true, [provideLocationMocks()]);
        });

        it("a guard redirect adds no history entry for the refused page", fakeAsync(() => {
            promiseWithCatch(router.navigate([ProjectLinks.URL_PAGE_NOT_FOUND]));
            tick();
            promiseWithCatch(router.navigate([ProjectLinks.URL_DATASET_CREATE]));
            tick();
            expect(location.path()).toBe("/" + ProjectLinks.DEFAULT_URL);

            location.back();
            tick();

            expect(location.path()).toBe("/" + ProjectLinks.URL_PAGE_NOT_FOUND);
            flush();
        }));
    });

    describe("with anonymous access forbidden", () => {
        beforeEach(async () => {
            await configureRouter(false);
        });

        it("an anonymous user is redirected to login, which returns to the requested page", fakeAsync(() => {
            spyOnProperty(loginMethodsService, "loginMethods", "get").and.returnValue([AccountProvider.Password]);

            promiseWithCatch(router.navigate([ProjectLinks.URL_DATASET_CREATE]));
            tick();

            expect(location.path()).toBe(
                `/${ProjectLinks.URL_LOGIN}?${ProjectLinks.URL_QUERY_PARAM_REDIRECT_URL}=${encodeURIComponent(`/${ProjectLinks.URL_DATASET_CREATE}`)}`,
            );
            flush();
        }));

        it("public routes stay reachable for an anonymous user", fakeAsync(() => {
            promiseWithCatch(router.navigate([ProjectLinks.URL_PAGE_NOT_FOUND]));
            tick();

            expect(location.path()).toBe("/" + ProjectLinks.URL_PAGE_NOT_FOUND);
            flush();
        }));

        describe("and no login method", () => {
            beforeEach(() => {
                spyOnProperty(loginMethodsService, "loginMethods", "get").and.returnValue([]);
            });

            ["", ProjectLinks.URL_SEARCH, ProjectLinks.URL_LOGIN].forEach((url: string) => {
                it(`navigation to "/${url}" settles on the login-unavailable page`, fakeAsync(() => {
                    let navigated: MaybeUndefined<boolean>;
                    router.navigate([url]).then(
                        (result) => (navigated = result),
                        () => (navigated = false),
                    );
                    tick();

                    expect(navigated).toBeTrue();
                    expect(location.path()).toBe("/" + ProjectLinks.URL_LOGIN_UNAVAILABLE);
                    flush();
                }));
            });
        });
    });
});
