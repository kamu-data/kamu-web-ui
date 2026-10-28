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
import { Type } from "@angular/core";
import { ComponentFixture, fakeAsync, flush, TestBed, tick } from "@angular/core/testing";
import { Router, ROUTES } from "@angular/router";

import { NEVER, Observable, of } from "rxjs";

import { Apollo } from "apollo-angular";
import { ApolloTestingModule } from "apollo-angular/testing";
import { provideToastr } from "ngx-toastr";
import { Mock } from "vitest";

import { PageNotFoundComponent } from "@common/components/page-not-found/page-not-found.component";
import { promiseWithCatch } from "@common/helpers/app.helpers";
import { AccountProvider } from "@api/kamu.graphql.interface";
import { mockAccessTokenConnectionData } from "@api/mock/access-token.mock";
import { mockAccountDetails } from "@api/mock/auth.mock";
import { mockDatasetFlowByIdResponse } from "@api/mock/dataset-flow.mock";
import { mockDatasetsAccountResponse } from "@api/mock/dataset.mock";
import { MaybeNull, MaybeUndefined } from "@interface/app.types";
import { FeatureVisibility } from "@interface/feature-flags.interface";

import { accountDatasetsResolverFn } from "src/app/account/additional-components/datasets-tab/resolver/account-datasets.resolver";
import { accountSettingsAccessTokensResolverFn } from "src/app/account/settings/tabs/access-tokens-tab/resolver/account-settings-access-tokens.resolver";
import { AppConfigService } from "src/app/app-config.service";
import { provideCatchAllRoute, provideConditionalGuardedRoutes, PUBLIC_ROUTES } from "src/app/app-routing";
import { LoggedUserService } from "src/app/auth/logged-user.service";
import { LoginMethodsService } from "src/app/auth/login-methods.service";
import { LoginComponent } from "src/app/auth/login/login.component";
import { blockMetadataResolverFn } from "src/app/dataset-block/metadata-block/resolver/block-metadata.resolver";
import { DatasetFlowByIdResponse } from "src/app/dataset-flow/dataset-flow-details/dataset-flow-details.types";
import { flowDetailsResolverFn } from "src/app/dataset-flow/dataset-flow-details/resolvers/flow-details.resolver";
import { mockDerivedOverviewUpdate } from "src/app/dataset-view/additional-components/data-tabs.mock";
import { editWebhookResolverFn } from "src/app/dataset-view/additional-components/dataset-settings-component/tabs/webhooks/components/edit-webhook/resolvers/edit-webhook.resolver";
import { datasetOverviewTabResolverFn } from "src/app/dataset-view/additional-components/overview-component/resolver/dataset-overview-tab.resolver";
import { datasetViewResolverFn } from "src/app/dataset-view/resolvers/dataset-view.resolver";
import ProjectLinks from "src/app/project-links";
import {
    mockDatasetBasicsDerivedFragment,
    mockDatasetSearchResult,
    mockFullPowerDatasetPermissionsFragment,
} from "src/app/search/mock.data";
import { searchResolverFn } from "src/app/search/resolver/search.resolver";
import { FeatureFlagsService } from "src/app/services/feature-flags.service";

describe("Router", () => {
    let router: Router;
    let fixture: ComponentFixture<PageNotFoundComponent>; // any component is fine, we are testing router
    let location: Location;
    let loggedUserService: LoggedUserService;
    let loginMethodsService: LoginMethodsService;
    let flowDetailsResolveSpy: Mock<() => Observable<DatasetFlowByIdResponse>>;
    let editWebhookResolveSpy: Mock<() => Observable<never>>;
    let blockMetadataResolveSpy: Mock<() => Observable<never>>;

    /** The component of the deepest route the last navigation activated */
    function activatedComponent(): MaybeNull<Type<unknown> | string> {
        let route = router.routerState.snapshot.root;
        while (route.firstChild) {
            route = route.firstChild;
        }
        return route.component;
    }

    async function configureRouter(allowAnonymous: boolean): Promise<void> {
        flowDetailsResolveSpy = vi.fn(() => of(mockDatasetFlowByIdResponse));
        editWebhookResolveSpy = vi.fn(() => NEVER);
        blockMetadataResolveSpy = vi.fn(() => NEVER);

        await TestBed.configureTestingModule({
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
                        resolve: () => of(mockAccessTokenConnectionData),
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
                                overviewUpdate: mockDerivedOverviewUpdate,
                            }),
                    },
                },
                { provide: flowDetailsResolverFn, useValue: { resolve: flowDetailsResolveSpy } },
                { provide: editWebhookResolverFn, useValue: { resolve: editWebhookResolveSpy } },
                { provide: blockMetadataResolverFn, useValue: { resolve: blockMetadataResolveSpy } },
                {
                    provide: accountDatasetsResolverFn,
                    useValue: {
                        resolve: () => of({ datasetsResponse: mockDatasetsAccountResponse, accountName: "datasets" }),
                    },
                },
                provideHttpClient(),
                provideHttpClientTesting(),
                provideLocationMocks(),
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
                vi.spyOn(loggedUserService, "isAuthenticated", "get").mockReturnValue(true);
                vi.spyOn(loggedUserService, "currentlyLoggedInUser", "get").mockReturnValue(mockAccountDetails);
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
            vi.spyOn(loggedUserService, "isAdmin", "get").mockReturnValue(false);

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
                vi.spyOn(loginMethodsService, "loginMethods", "get").mockReturnValue([]);

                promiseWithCatch(router.navigate([ProjectLinks.URL_LOGIN]));
                tick();

                expect(location.path()).toBe("/" + ProjectLinks.URL_SEARCH);
                flush();
            }));

            it("login redirects to default page when user is already logged", fakeAsync(() => {
                vi.spyOn(loggedUserService, "isAuthenticated", "get").mockReturnValue(true);

                promiseWithCatch(router.navigate([ProjectLinks.URL_LOGIN]));
                tick();

                expect(location.path()).toBe("/" + ProjectLinks.URL_SEARCH);
                flush();
            }));

            it("login with a redirect URL opens Login component when allowed and not logged in", fakeAsync(() => {
                vi.spyOn(loginMethodsService, "loginMethods", "get").mockReturnValue([AccountProvider.Password]);
                vi.spyOn(loggedUserService, "isAuthenticated", "get").mockReturnValue(false);

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
                vi.spyOn(loggedUserService, "isAuthenticated", "get").mockReturnValue(true);

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
                vi.spyOn(loginMethodsService, "loginMethods", "get").mockReturnValue([AccountProvider.Password]);
                vi.spyOn(loggedUserService, "isAuthenticated", "get").mockReturnValue(false);

                promiseWithCatch(router.navigate([ProjectLinks.URL_LOGIN]));
                tick();

                expect(location.path()).toBe("/" + ProjectLinks.URL_LOGIN);
                flush();
            }));
        });
    });

    describe("URL validation", () => {
        beforeEach(async () => {
            await configureRouter(true);

            vi.spyOn(loggedUserService, "isAuthenticated", "get").mockReturnValue(true);
            vi.spyOn(loggedUserService, "currentlyLoggedInUser", "get").mockReturnValue(mockAccountDetails);
            vi.spyOn(TestBed.inject(FeatureFlagsService), "featureVisibility").mockImplementation((name) =>
                name === "flowDetails.usage" ? FeatureVisibility.INVISIBLE : FeatureVisibility.VISIBLE,
            );
        });

        it("should open the history tab for a flow-details URL without a tab", async () => {
            await router.navigateByUrl("/kamu/dataset/flow-details/42");

            expect(location.path()).toBe("/kamu/dataset/flow-details/42/history");
            expect(activatedComponent()).not.toBe(PageNotFoundComponent);
        });

        [
            { description: "a flow id that is not a number", url: "/kamu/dataset/flow-details/abc/summary" },
            { description: "a webhook id that is not a UUID", url: "/kamu/dataset/settings/webhooks/not-a-uuid" },
            {
                description: "a webhook id to rotate that is not a UUID",
                url: "/kamu/dataset/settings/webhooks/rotate-secret/not-a-uuid",
            },
            { description: "a block hash that is not a multihash", url: "/kamu/dataset/block/xyz!" },
            { description: "an account name outside the name grammar", url: "/bad_name" },
            { description: "a dataset name outside the name grammar", url: "/kamu/bad_name" },
            {
                description: "a flow-details tab hidden behind a feature flag",
                url: "/kamu/dataset/flow-details/42/usage",
            },
            {
                description: "a rotate-secret URL without a webhook id",
                url: "/kamu/dataset/settings/webhooks/rotate-secret",
            },
        ].forEach(({ description, url }) => {
            it(`should show page-not-found for ${description} and resolve nothing`, async () => {
                await router.navigateByUrl(url);

                expect(activatedComponent()).toBe(PageNotFoundComponent);
                expect(flowDetailsResolveSpy).not.toHaveBeenCalled();
                expect(editWebhookResolveSpy).not.toHaveBeenCalled();
                expect(blockMetadataResolveSpy).not.toHaveBeenCalled();
            });
        });

        it("should open the datasets tab of an account named after an account tab", async () => {
            await router.navigateByUrl("/datasets?page=2");

            expect(location.path()).toBe("/datasets/~select/datasets?page=2");
        });
    });

    describe("browser history", () => {
        beforeEach(async () => {
            await configureRouter(true);
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
            vi.spyOn(loginMethodsService, "loginMethods", "get").mockReturnValue([AccountProvider.Password]);

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
                vi.spyOn(loginMethodsService, "loginMethods", "get").mockReturnValue([]);
            });

            ["", ProjectLinks.URL_SEARCH, ProjectLinks.URL_LOGIN].forEach((url: string) => {
                it(`navigation to "/${url}" settles on the login-unavailable page`, fakeAsync(() => {
                    // The initial navigation already lands on the page, so a redirect to it is skipped
                    // and resolves `false`; a redirect loop would reject or never settle.
                    let outcome: MaybeUndefined<"resolved" | "rejected">;
                    router.navigate([url]).then(
                        () => (outcome = "resolved"),
                        () => (outcome = "rejected"),
                    );
                    tick();

                    expect(outcome).toBe("resolved");
                    expect(location.path()).toBe("/" + ProjectLinks.URL_LOGIN_UNAVAILABLE);
                    flush();
                }));
            });
        });
    });
});
