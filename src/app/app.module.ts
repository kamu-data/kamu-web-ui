/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import AppValues from "src/app/common/values/app.values";
import { MetadataBlockModule } from "./dataset-block/metadata-block/metadata-block.module";
import { SpinnerService } from "./common/components/spinner/spinner.service";
import { SpinnerInterceptor } from "./common/components/spinner/spinner.interceptor";
import { Apollo, APOLLO_OPTIONS } from "apollo-angular";
import { HttpLink } from "apollo-angular/http";
import { APP_INITIALIZER, Injector, NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { HttpClient, HttpClientModule, HTTP_INTERCEPTORS, HttpHeaders } from "@angular/common/http";
import { ApolloLink, NextLink, Operation } from "@apollo/client/core";
import { SearchApi } from "./api/search.api";
import { SearchService } from "./search/search.service";
import { SearchModule } from "./search/search.module";
import { DatasetViewModule } from "./dataset-view/dataset-view.module";
import { DatasetService } from "./dataset-view/dataset.service";
import { DatasetCreateModule } from "./dataset-create/dataset-create.module";
import { MAT_RIPPLE_GLOBAL_OPTIONS } from "@angular/material/core";
import { NgxGraphModule } from "@swimlane/ngx-graph";
import { AuthApi } from "./api/auth.api";
import { ModalModule } from "./common/components/modal/modal.module";
import { MarkdownModule } from "ngx-markdown";
import { SecurityContext } from "@angular/core";
import { AppConfigService } from "./app-config.service";
import { NavigationService } from "./services/navigation.service";
import { DatasetSubscriptionsService } from "./dataset-view/dataset.subscriptions.service";
import { SpinnerModule } from "./common/components/spinner/spinner.module";
import { DatasetApi } from "./api/dataset.api";
import { DatasetListModule } from "./common/components/dataset-list-component/dataset-list.module";
import { ClipboardModule } from "@angular/cdk/clipboard";
import { HIGHLIGHT_OPTIONS } from "ngx-highlightjs";
import { ToastrModule } from "ngx-toastr";
import { LoggedUserService } from "./auth/logged-user.service";
import { firstValueFrom } from "rxjs";
import { LoginService } from "./auth/login/login.service";
import { logError } from "./common/helpers/app.helpers";
import { DatasetPermissionsService } from "./dataset-view/dataset.permissions.service";
import { LocalStorageService } from "./services/local-storage.service";
import { apolloCache } from "./common/helpers/apollo-cache.helper";
import { DatasetFlowDetailsModule } from "./dataset-flow/dataset-flow-details/dataset-flow-details.module";
import { AccountModule } from "./account/account.module";
import { AccountSettingsModule } from "./account/settings/account-settings.module";
import { LoginModule } from "./auth/login/login.module";
import { AdminViewModule } from "./admin-view/admin-view.module";
import { HeaderModule } from "./header/header.module";
import { PageNotFoundComponent } from "./common/components/page-not-found/page-not-found.component";
import { CommonModule } from "@angular/common";
import { onError } from "@apollo/client/link/error";
import { ErrorTexts } from "./common/values/errors.text";
import { ToastrService } from "ngx-toastr";

const Services = [
    Apollo,
    AuthApi,
    DatasetApi,
    DatasetPermissionsService,
    DatasetService,
    DatasetSubscriptionsService,
    HttpLink,
    LoginService,
    LoggedUserService,
    NavigationService,
    SearchApi,
    SearchService,
    {
        provide: HTTP_INTERCEPTORS,
        useClass: SpinnerInterceptor,
        multi: true,
        deps: [SpinnerService],
    },
    // {
    //     provide: ErrorHandler,
    //     useClass: ErrorHandlerService,
    // },
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
    {
        provide: HIGHLIGHT_OPTIONS,
        useValue: {
            coreLibraryLoader: () => import("highlight.js/lib/core"),
            languages: {
                sql: () => import("highlight.js/lib/languages/sql"),
                yaml: () => import("highlight.js/lib/languages/yaml"),
            },
        },
    },
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
@NgModule({
    declarations: [AppComponent, PageNotFoundComponent],
    imports: [
        CommonModule,
        BrowserModule,
        BrowserAnimationsModule,
        ClipboardModule,
        HttpClientModule,
        MarkdownModule.forRoot({
            loader: HttpClient,
            sanitize: SecurityContext.NONE,
        }),
        ModalModule.forRoot(),
        NgxGraphModule,
        ToastrModule.forRoot({
            timeOut: 5000,
            positionClass: "toast-bottom-right",
            newestOnTop: false,
            preventDuplicates: true,
        }), // ToastrModule added

        AccountModule,
        AccountSettingsModule,
        AdminViewModule,
        AppRoutingModule,
        HeaderModule,
        DatasetCreateModule,
        DatasetFlowDetailsModule,
        DatasetListModule,
        DatasetViewModule,
        LoginModule,
        MetadataBlockModule,
        SearchModule,
        SpinnerModule,
    ],
    providers: [...Services],
    bootstrap: [AppComponent],
})
export class AppModule {}
