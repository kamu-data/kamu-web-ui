import { MetadataBlockModule } from "./dataset-block/metadata-block/metadata-block.module";
import { SpinnerService } from "./components/spinner/spinner.service";
import { SpinnerInterceptor } from "./components/spinner/spinner.interceptor";
import { Apollo, APOLLO_OPTIONS } from "apollo-angular";
import { HttpLink } from "apollo-angular/http";
import { ErrorHandler, NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { LoginComponent } from "./auth/login/login.component";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { ServiceWorkerModule } from "@angular/service-worker";
import { environment } from "../environments/environment";
import { MatToolbarModule } from "@angular/material/toolbar";
import { NgbModule, NgbTypeaheadModule } from "@ng-bootstrap/ng-bootstrap";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatIconModule } from "@angular/material/icon";
import {
    HttpClient,
    HttpClientModule,
    HTTP_INTERCEPTORS,
} from "@angular/common/http";
import { MatTableModule } from "@angular/material/table";
import { CdkTableModule } from "@angular/cdk/table";
import { InMemoryCache } from "@apollo/client/core";
import { SearchApi } from "./api/search.api";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { SearchService } from "./search/search.service";
import { MatChipsModule } from "@angular/material/chips";
import { MatDividerModule } from "@angular/material/divider";
import { MatSidenavModule } from "@angular/material/sidenav";
import { MatMenuModule } from "@angular/material/menu";
import { MatButtonModule } from "@angular/material/button";
import { SearchModule } from "./search/search.module";
import { AccountComponent } from "./auth/account/account.component";
import { DatasetModule } from "./dataset-view/dataset.module";
import { DatasetService } from "./dataset-view/dataset.service";
import { DatasetCreateModule } from "./dataset-create/dataset-create.module";
import { AppHeaderComponent } from "./components/app-header/app-header.component";
import { MatOptionModule } from "@angular/material/core";
import { MatAutocompleteModule } from "@angular/material/autocomplete";
import { NgxGraphModule } from "@swimlane/ngx-graph";
import { GithubCallbackComponent } from "./auth/github-callback/github.callback";
import { AuthApi } from "./api/auth.api";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { ModalModule } from "./components/modal/modal.module";
import { MarkdownModule } from "ngx-markdown";
import { SecurityContext } from "@angular/core";
import { NotificationIndicatorComponent } from "./components/notification-indicator/notification-indicator.component";
import { MonacoEditorModule } from "ngx-monaco-editor";
import { AppConfigService } from "./app-config.service";
import { NavigationService } from "./services/navigation.service";
import { AppDatasetSubscriptionsService } from "./dataset-view/dataset.subscriptions.service";
import { SpinnerModule } from "./components/spinner/spinner.module";
import { DatasetApi } from "./api/dataset.api";
import { ErrorHandlerService } from "./services/error-handler.service";

import { SettingsComponent } from "./auth/settings/settings.component";
import { MatButtonToggleModule } from "@angular/material/button-toggle";
import { DatasetListModule } from "./components/dataset-list-component/dataset-list.module";
import { PaginationModule } from "./components/pagination-component/pagination.module";
import { AngularSvgIconModule } from "angular-svg-icon";
import { AngularSvgIconPreloaderModule } from "angular-svg-icon-preloader";
import { DatasetsTabComponent } from "./auth/account/additional-components/datasets-tab/datasets-tab.component";
import { ClipboardModule } from "@angular/cdk/clipboard";
import { HighlightModule, HIGHLIGHT_OPTIONS } from "ngx-highlightjs";
import { ToastrModule } from "ngx-toastr";

const Services = [
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
    Apollo,
    AuthApi,
    SearchApi,
    DatasetApi,
    HttpLink,
    SearchService,
    DatasetService,
    NavigationService,
    AppDatasetSubscriptionsService,

    {
        provide: APOLLO_OPTIONS,
        useFactory: (httpLink: HttpLink, appConfig: AppConfigService) => {
            return {
                cache: new InMemoryCache(),
                link: httpLink.create({
                    uri: appConfig.apiServerGqlUrl,
                }),
            };
        },
        deps: [HttpLink, AppConfigService],
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
];
const MatModules = [
    MatChipsModule,
    MatDividerModule,
    MatToolbarModule,
    MatFormFieldModule,
    MatTableModule,
    MatIconModule,
    MatSidenavModule,
    MatMenuModule,
    MatButtonModule,
    MatAutocompleteModule,
    MatProgressSpinnerModule,
    MatButtonToggleModule,
];

@NgModule({
    declarations: [
        AppComponent,
        AppHeaderComponent,
        LoginComponent,
        GithubCallbackComponent,
        AccountComponent,
        NotificationIndicatorComponent,
        SettingsComponent,
        DatasetsTabComponent,
    ],
    imports: [
        AppRoutingModule,
        DatasetModule,
        DatasetCreateModule,
        MetadataBlockModule,
        ModalModule.forRoot(),
        SearchModule.forRoot(),
        MarkdownModule.forRoot({
            loader: HttpClient,
            sanitize: SecurityContext.NONE,
        }),
        MonacoEditorModule.forRoot(),

        BrowserModule,
        BrowserAnimationsModule,
        ServiceWorkerModule.register("ngsw-worker.js", {
            enabled: environment.production,
            // Register the ServiceWorker as soon as the app is stable
            // or after 30 seconds (whichever comes first).
            registrationStrategy: "registerWhenStable:30000",
        }),
        NgbModule,
        NgbTypeaheadModule,
        //GraphQLModule,
        HttpClientModule,
        CdkTableModule,
        ...MatModules,
        FormsModule,
        MatOptionModule,
        ReactiveFormsModule,
        NgxGraphModule,
        SpinnerModule,
        DatasetListModule,
        PaginationModule,
        ClipboardModule,
        AngularSvgIconModule.forRoot(),
        AngularSvgIconPreloaderModule.forRoot({
            configUrl: "./assets/svg/icons.json",
        }),
        HighlightModule,
        ToastrModule.forRoot({
            timeOut: 2000,
            positionClass: "toast-bottom-right",
            newestOnTop: false,
            preventDuplicates: true,
        }), // ToastrModule added
    ],
    providers: [...Services],
    bootstrap: [AppComponent],
})
export class AppModule {}
