import {
    HTTP_INTERCEPTORS,
    HttpClient,
    HttpHeaders,
    provideHttpClient,
    withInterceptorsFromDi,
} from "@angular/common/http";
import {
    enableProdMode,
    ErrorHandler,
    importProvidersFrom,
    inject,
    Injector,
    provideAppInitializer,
    SecurityContext,
} from "@angular/core";
import { MAT_RIPPLE_GLOBAL_OPTIONS } from "@angular/material/core";
import { bootstrapApplication } from "@angular/platform-browser";
import { provideAnimations } from "@angular/platform-browser/animations";
import { provideRouter, withComponentInputBinding, withRouterConfig } from "@angular/router";

import { firstValueFrom } from "rxjs";

import { ApolloLink } from "@apollo/client/core";
import { CombinedGraphQLErrors } from "@apollo/client/errors";
import { onError } from "@apollo/client/link/error";
import { Apollo, provideApollo } from "apollo-angular";
import { HttpLink } from "apollo-angular/http";
import { MarkdownModule } from "ngx-markdown";
import { provideToastr, ToastrService } from "ngx-toastr";
import { NavigationService } from "src/app/services/navigation.service";

import { AppConfigService } from "./app/app-config.service";
import { provideCatchAllRoute, provideConditionalGuardedRoutes, PUBLIC_ROUTES } from "./app/app-routing";
import { AppComponent } from "./app/app.component";
import { LoggedUserService } from "./app/auth/logged-user.service";
import { LoginMethodsService } from "./app/auth/login-methods.service";
import { SpinnerInterceptor } from "./app/common/components/spinner/spinner.interceptor";
import { SpinnerService } from "./app/common/components/spinner/spinner.service";
import { apolloCache } from "./app/common/helpers/apollo-cache.helper";
import { HIGHLIGHT_OPTIONS_PROVIDER, isAccessTokenExpired, logError } from "./app/common/helpers/app.helpers";
import { AuthInterceptor } from "./app/common/interceptors/auth.interceptor";
import AppValues from "./app/common/values/app.values";
import { ErrorTexts } from "./app/common/values/errors.text";
import ProjectLinks from "./app/project-links";
import { ErrorHandlerService } from "./app/services/error-handler.service";
import { LocalStorageService } from "./app/services/local-storage.service";
import { environment } from "./environments/environment";

const Services = [
    Apollo,
    {
        provide: HTTP_INTERCEPTORS,
        useClass: SpinnerInterceptor,
        multi: true,
        deps: [SpinnerService],
    },
    {
        provide: HTTP_INTERCEPTORS,
        useClass: AuthInterceptor,
        multi: true,
        deps: [LocalStorageService],
    },
    {
        provide: ErrorHandler,
        useClass: ErrorHandlerService,
    },

    HIGHLIGHT_OPTIONS_PROVIDER,

    {
        provide: MAT_RIPPLE_GLOBAL_OPTIONS,
        useValue: {
            disabled: true,
        },
    },
];

if (environment.production) {
    enableProdMode();
}

bootstrapApplication(AppComponent, {
    providers: [
        importProvidersFrom(
            MarkdownModule.forRoot({
                loader: HttpClient,
                sanitize: SecurityContext.NONE,
            }),
        ),
        provideAnimations(),
        provideHttpClient(withInterceptorsFromDi()),

        // 3-phase routing table:
        //  1. Public routes (no guards)
        //  2. Conditional guarded routes (guards that can be skipped)
        //  3. Catch-all route (404 page)
        provideRouter(
            PUBLIC_ROUTES,
            withRouterConfig({
                onSameUrlNavigation: "reload",
            }),
            withComponentInputBinding(),
        ),
        provideConditionalGuardedRoutes(),
        provideCatchAllRoute(),

        provideToastr({
            timeOut: 5000,
            positionClass: "toast-bottom-right",
            newestOnTop: false,
            preventDuplicates: true,
        }),

        provideAppInitializer(() => {
            const loggedUserService = inject(LoggedUserService);
            return loggedUserService.initializeCompletes();
        }),

        provideAppInitializer(() => {
            const loginMethodsService = inject(LoginMethodsService);
            return firstValueFrom(loginMethodsService.initialize()).catch((e) => logError(e));
        }),

        provideApollo(() => {
            const httpLink = inject(HttpLink);
            const appConfig = inject(AppConfigService);
            const localStorageService = inject(LocalStorageService);
            const injector = inject(Injector);
            const navigationService = inject(NavigationService);

            // 1. Main Link
            const httpMainLink = httpLink.create({
                uri: appConfig.apiServerGqlUrl,
            });

            // 2. Error Middleware
            const errorMiddleware = onError((errorOptions) => {
                const { error } = errorOptions;
                const toastrService = injector.get(ToastrService);

                // Check if it's a GraphQL error (errors from the GraphQL server)
                if (CombinedGraphQLErrors.is(error)) {
                    const graphQLErrors = error.errors;
                    if (graphQLErrors && graphQLErrors.length > 0) {
                        const firstMsg = graphQLErrors[0].message;
                        if (firstMsg === ErrorTexts.ERROR_ACCOUNT_IS_NOT_WHITELISTED) {
                            navigationService.navigateToPath(ProjectLinks.URL_ACCOUNT_WHITELIST_PAGE_NOT_FOUND);
                        } else if (firstMsg === ErrorTexts.ERROR_ACCESS_TOKEN) {
                            const token = localStorageService.accessToken;
                            if (token) {
                                toastrService.error(
                                    isAccessTokenExpired(token) ? ErrorTexts.ERROR_ACCESS_TOKEN_EXPIRED : firstMsg,
                                );
                                navigationService.navigateToLogin(window.location.pathname);
                            }
                        } else {
                            graphQLErrors.forEach((err) => toastrService.error(err.message));
                        }
                    }
                } else if (error) {
                    // Network error (e.g., connection failed, timeout, etc.)
                    logError(error);
                    toastrService.error(ErrorTexts.ERROR_NETWORK_DESCRIPTION, "", { disableTimeOut: true });
                }
            });

            // 3. Auth Middleware
            const authorizationMiddleware = new ApolloLink((operation, forward) => {
                const token = localStorageService.accessToken;
                if (token) {
                    operation.setContext({
                        headers: new HttpHeaders().set(AppValues.HEADERS_AUTHORIZATION_KEY, `Bearer ${token}`),
                    });
                }
                return forward(operation);
            });

            // 4. Loader Middleware
            const globalLoaderMiddleware = new ApolloLink((operation, forward) => {
                const context = operation.getContext();
                const skipLoading = !!context.skipLoading;
                if (skipLoading) {
                    const headers = (context.headers as HttpHeaders) || new HttpHeaders();
                    operation.setContext({
                        headers: headers.set(AppValues.HEADERS_SKIP_LOADING_KEY, `${skipLoading}`),
                    });
                }
                return forward(operation);
            });

            return {
                cache: apolloCache(),
                link: ApolloLink.from([errorMiddleware, authorizationMiddleware, globalLoaderMiddleware, httpMainLink]),
            };
        }),
        ...Services,
    ],
})
    // eslint-disable-next-line no-console
    .catch((err) => console.error(err));
