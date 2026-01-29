/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { ComponentFixture, TestBed, fakeAsync, flush, tick } from "@angular/core/testing";
import { Location } from "@angular/common";
import { Router, ROUTES } from "@angular/router";
import { provideCatchAllRoute, provideConditionalGuardedRoutes, PUBLIC_ROUTES } from "./app-routing";
import ProjectLinks from "./project-links";
import { promiseWithCatch } from "./common/helpers/app.helpers";
import { ApolloTestingModule } from "apollo-angular/testing";
import { NO_ERRORS_SCHEMA } from "@angular/core";
import { LoggedUserService } from "./auth/logged-user.service";
import { PageNotFoundComponent } from "./common/components/page-not-found/page-not-found.component";
import { LoginComponent } from "./auth/login/login.component";
import { provideHttpClientTesting } from "@angular/common/http/testing";
import { accountSettingsAccessTokensResolverFn } from "./account/settings/tabs/access-tokens-tab/resolver/account-settings-access-tokens.resolver";
import { provideToastr } from "ngx-toastr";
import { mockAccountDetails } from "./api/mock/auth.mock";
import { of } from "rxjs";
import { AccessTokenConnection, AccountProvider } from "./api/kamu.graphql.interface";
import { mockListAccessTokensQuery } from "./api/mock/access-token.mock";
import { searchResolverFn } from "./search/resolver/search.resolver";
import {
    mockDatasetBasicsDerivedFragment,
    mockDatasetSearchResult,
    mockFullPowerDatasetPermissionsFragment,
} from "./search/mock.data";
import { datasetViewResolverFn } from "./dataset-view/resolvers/dataset-view.resolver";
import { datasetOverviewTabResolverFn } from "./dataset-view/additional-components/overview-component/resolver/dataset-overview-tab.resolver";
import {
    mockMetadataDerivedUpdate,
    mockOverviewDataUpdate,
    mockOverviewDataUpdateNullable,
} from "./dataset-view/additional-components/data-tabs.mock";
import { OverviewUpdate } from "./dataset-view/dataset.subscriptions.interface";
import { NgxGraphModule } from "@swimlane/ngx-graph";
import { provideAnimations } from "@angular/platform-browser/animations";
import { AppConfigService } from "./app-config.service";
import { LoginMethodsService } from "./auth/login-methods.service";
import { provideHttpClient, withInterceptorsFromDi } from "@angular/common/http";
import { Apollo } from "apollo-angular";

describe("Router", () => {
    let router: Router;
    let fixture: ComponentFixture<PageNotFoundComponent>; // any component is fine, we are testing router
    let location: Location;
    let loggedUserService: LoggedUserService;
    let loginMethodsService: LoginMethodsService;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            schemas: [NO_ERRORS_SCHEMA],
            imports: [ApolloTestingModule, NgxGraphModule, PageNotFoundComponent, LoginComponent],
            providers: [
                Apollo,
                {
                    provide: AppConfigService,
                    useValue: {
                        allowAnonymous: true,
                    },
                },
                {
                    provide: ROUTES,
                    multi: true,
                    useValue: PUBLIC_ROUTES,
                },
                provideConditionalGuardedRoutes(),
                provideCatchAllRoute(),
                provideAnimations(),
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
                provideHttpClient(withInterceptorsFromDi()),
                provideHttpClientTesting(),
            ],
        }).compileComponents();

        router = TestBed.inject(Router);
        location = TestBed.inject(Location);
        loggedUserService = TestBed.inject(LoggedUserService);
        loginMethodsService = TestBed.inject(LoginMethodsService);

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
