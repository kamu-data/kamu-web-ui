import {
    enableProdMode,
    ErrorHandler,
    Injector,
    APP_INITIALIZER,
    SecurityContext,
    importProvidersFrom,
} from "@angular/core";
import { environment } from "./environments/environment";
import { AppComponent } from "./app/app.component";
import { MarkdownModule } from "ngx-markdown";
import { provideAnimations } from "@angular/platform-browser/animations";
import { bootstrapApplication } from "@angular/platform-browser";
import { MAT_RIPPLE_GLOBAL_OPTIONS } from "@angular/material/core";
import { HIGHLIGHT_OPTIONS_PROVIDER, logError } from "./app/common/helpers/app.helpers";
import { firstValueFrom } from "rxjs";
import { apolloCache } from "./app/common/helpers/apollo-cache.helper";
import { ErrorTexts } from "./app/common/values/errors.text";
import { ToastrService } from "ngx-toastr";
import { onError } from "@apollo/client/link/error";
import { ApolloLink, Operation, NextLink } from "@apollo/client/core";
import { LocalStorageService } from "./app/services/local-storage.service";
import { AppConfigService } from "./app/app-config.service";
import { ErrorHandlerService } from "./app/services/error-handler.service";
import { SpinnerService } from "./app/common/components/spinner/spinner.service";
import { SpinnerInterceptor } from "./app/common/components/spinner/spinner.interceptor";
import {
    HTTP_INTERCEPTORS,
    HttpHeaders,
    withInterceptorsFromDi,
    provideHttpClient,
    HttpClient,
} from "@angular/common/http";
import { LoggedUserService } from "./app/auth/logged-user.service";
import { LoginService } from "./app/auth/login/login.service";
import { HttpLink } from "apollo-angular/http";
import { Apollo, APOLLO_OPTIONS } from "apollo-angular";
import AppValues from "./app/common/values/app.values";
import { provideRouter, withComponentInputBinding, withRouterConfig } from "@angular/router";
import { routes } from "./app/app-routing";
import { provideToastr } from "ngx-toastr";

const Services = [
    Apollo,
    {
        provide: HTTP_INTERCEPTORS,
        useClass: SpinnerInterceptor,
        multi: true,
        deps: [SpinnerService],
    },
    {
        provide: ErrorHandler,
        useClass: ErrorHandlerService,
    },
    {
        provide: APOLLO_OPTIONS,
        useFactory: (
            httpLink: HttpLink,
            appConfig: AppConfigService,
            localStorageService: LocalStorageService,
            injector: Injector,
        ) => {
            const httpMainLink: ApolloLink = httpLink.create({
                uri: appConfig.apiServerGqlUrl,
            });

            const errorMiddleware: ApolloLink = onError(({ graphQLErrors, networkError }) => {
                const toastrService = injector.get(ToastrService);
                if (graphQLErrors) {
                    graphQLErrors.forEach(({ message }) => {
                        toastrService.error(message);
                    });
                }

                if (networkError) {
                    toastrService.error(ErrorTexts.ERROR_NETWORK_DESCRIPTION, "", { disableTimeOut: true });
                }
            });

            const authorizationMiddleware: ApolloLink = new ApolloLink((operation: Operation, forward: NextLink) => {
                const accessToken: string | null = localStorageService.accessToken;
                if (accessToken) {
                    operation.setContext({
                        headers: new HttpHeaders().set(AppValues.HEADERS_AUTHORIZATION_KEY, `Bearer ${accessToken}`),
                    });
                }
                return forward(operation);
            });

            const globalLoaderMiddleware: ApolloLink = new ApolloLink((operation: Operation, forward: NextLink) => {
                const context = operation.getContext();
                const skipLoading = Boolean(context.skipLoading);
                const headers = context.headers as HttpHeaders;
                const headersExist = headers && headers.keys().length;
                if (skipLoading) {
                    operation.setContext({
                        headers: headersExist
                            ? headers.append(AppValues.HEADERS_SKIP_LOADING_KEY, `${skipLoading}`)
                            : new HttpHeaders().set(AppValues.HEADERS_SKIP_LOADING_KEY, `${skipLoading}`),
                    });
                }
                return forward(operation);
            });

            return {
                cache: apolloCache(),
                link: ApolloLink.from([errorMiddleware, authorizationMiddleware, globalLoaderMiddleware, httpMainLink]),
            };
        },
        deps: [HttpLink, AppConfigService, LocalStorageService, Injector],
    },
    HIGHLIGHT_OPTIONS_PROVIDER,
    {
        provide: APP_INITIALIZER,
        useFactory: (loggedUserService: LoggedUserService) => {
            return () => {
                return loggedUserService.initializeCompletes();
            };
        },
        deps: [LoggedUserService],
        multi: true,
    },
    {
        provide: APP_INITIALIZER,
        useFactory: (loginService: LoginService) => {
            return (): Promise<void> => {
                return firstValueFrom(loginService.initialize()).catch((e) => logError(e));
            };
        },
        deps: [LoginService],
        multi: true,
    },
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
        provideRouter(
            routes,
            withRouterConfig({
                onSameUrlNavigation: "reload",
            }),
            withComponentInputBinding(),
        ),
        provideToastr({
            timeOut: 5000,
            positionClass: "toast-bottom-right",
            newestOnTop: false,
            preventDuplicates: true,
        }),
        ...Services,
    ],
})
    // eslint-disable-next-line no-console
    .catch((err) => console.error(err));
