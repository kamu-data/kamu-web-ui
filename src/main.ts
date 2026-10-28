import { HttpClient, HttpHeaders, provideHttpClient, withInterceptors } from "@angular/common/http";
import {
    ErrorHandler,
    inject,
    provideAppInitializer,
    provideBrowserGlobalErrorListeners,
    provideZoneChangeDetection,
    SecurityContext,
} from "@angular/core";
import { MAT_RIPPLE_GLOBAL_OPTIONS } from "@angular/material/core";
import { bootstrapApplication } from "@angular/platform-browser";
import {
    provideRouter,
    RouteReuseStrategy,
    UrlSerializer,
    withComponentInputBinding,
    withRouterConfig,
} from "@angular/router";

import { firstValueFrom } from "rxjs";

import { ApolloLink } from "@apollo/client/core";
import { Apollo, provideApollo } from "apollo-angular";
import { HttpLink } from "apollo-angular/http";
import { provideMarkdown, SANITIZE } from "ngx-markdown";
import { provideToastr } from "ngx-toastr";

import { spinnerInterceptor } from "@common/components/spinner/spinner.interceptor";
import { apolloCache } from "@common/helpers/apollo-cache.helper";
import { createApolloErrorLink } from "@common/helpers/apollo-error.helpers";
import { HIGHLIGHT_OPTIONS_PROVIDER, logError } from "@common/helpers/app.helpers";
import { KamuRouteReuseStrategy } from "@common/helpers/kamu-route-reuse-strategy";
import { KamuUrlSerializer } from "@common/helpers/kamu-url-serializer";
import { authInterceptor } from "@common/interceptors/auth.interceptor";
import AppValues from "@common/values/app.values";

import { AppConfigService } from "src/app/app-config.service";
import { provideCatchAllRoute, provideConditionalGuardedRoutes, PUBLIC_ROUTES } from "src/app/app-routing";
import { AppComponent } from "src/app/app.component";
import { LoggedUserService } from "src/app/auth/logged-user.service";
import { LoginMethodsService } from "src/app/auth/login-methods.service";
import { ErrorHandlerService } from "src/app/services/error-handler.service";
import { LocalStorageService } from "src/app/services/local-storage.service";

const Services = [
    Apollo,
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

bootstrapApplication(AppComponent, {
    providers: [
        provideZoneChangeDetection(),
        provideBrowserGlobalErrorListeners(),
        provideMarkdown({
            loader: HttpClient,
            sanitize: { provide: SANITIZE, useValue: SecurityContext.NONE },
        }),
        { provide: UrlSerializer, useClass: KamuUrlSerializer },
        { provide: RouteReuseStrategy, useClass: KamuRouteReuseStrategy },
        provideHttpClient(withInterceptors([spinnerInterceptor, authInterceptor])),

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

            // 1. Main Link
            const httpMainLink = httpLink.create({
                uri: appConfig.apiServerGqlUrl,
            });

            // 2. Error Middleware
            const errorMiddleware = createApolloErrorLink();

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
