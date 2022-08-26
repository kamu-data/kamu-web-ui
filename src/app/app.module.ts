import { APP_INITIALIZER, NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { LoginComponent } from "./auth/login/login.component";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { ServiceWorkerModule } from "@angular/service-worker";
import { environment } from "../environments/environment";
import { MatToolbarModule } from "@angular/material/toolbar";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatIconModule } from "@angular/material/icon";
import { GraphQLModule } from "./graphql.module";
import { HttpClient, HttpClientModule } from "@angular/common/http";
import { MatTableModule } from "@angular/material/table";
import { CdkTableModule } from "@angular/cdk/table";
import { Apollo, APOLLO_OPTIONS } from "apollo-angular";
import { HttpLink } from "apollo-angular-link-http";
import { InMemoryCache } from "@apollo/client/core";
import { SearchApi } from "./api/search.api";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { AppSearchService } from "./search/search.service";
import { MatChipsModule } from "@angular/material/chips";
import { MatDividerModule } from "@angular/material/divider";
import { MatSidenavModule } from "@angular/material/sidenav";
import { SideNavService } from "./services/sidenav.service";
import { MatMenuModule } from "@angular/material/menu";
import { MatButtonModule } from "@angular/material/button";
import { SearchModule } from "./search/search.module";
import { AccountComponent } from "./auth/account/account.component";
import { DatasetModule } from "./dataset-view/dataset.module";
import { AppDatasetService } from "./dataset-view/dataset.service";
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
import { AppDatasetSubsService } from "./dataset-view/datasetSubs.service";

const Services = [
    {
        provide: APP_INITIALIZER,
        multi: true,
        deps: [AppConfigService],
        useFactory: (appConfigService: AppConfigService) => {
            return () => {
                return appConfigService.loadAppConfig();
            };
        },
    },
    Apollo,
    AuthApi,
    SearchApi,
    HttpLink,
    AppSearchService,
    AppDatasetService,
    NavigationService,
    AppDatasetSubsService,
    SideNavService,
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
];

@NgModule({
    declarations: [
        AppComponent,
        AppHeaderComponent,
        LoginComponent,
        GithubCallbackComponent,
        AccountComponent,
        NotificationIndicatorComponent,
    ],
    imports: [
        AppRoutingModule,
        DatasetModule,
        DatasetCreateModule,
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
        GraphQLModule,
        HttpClientModule,
        CdkTableModule,
        ...MatModules,
        FormsModule,
        MatOptionModule,
        ReactiveFormsModule,
        NgxGraphModule,
    ],
    providers: [...Services],
    bootstrap: [AppComponent],
})
export class AppModule {}
