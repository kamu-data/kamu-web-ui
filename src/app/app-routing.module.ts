import { GlobalQueryComponent } from "./query/global-query/global-query.component";
import { AddPollingSourceComponent } from "./dataset-view/additional-components/metadata-component/components/source-events/add-polling-source/add-polling-source.component";
import { MetadataBlockComponent } from "./dataset-block/metadata-block/metadata-block.component";
import { AuthenticatedGuard } from "./auth/guards/authenticated.guard";
import { AccountSettingsComponent } from "./auth/settings/account-settings.component";
import { PageNotFoundComponent } from "./components/page-not-found/page-not-found.component";
import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { SearchComponent } from "./search/search.component";
import { LoginComponent } from "./auth/login/login.component";
import { DatasetComponent } from "./dataset-view/dataset.component";
import { DatasetCreateComponent } from "./dataset-create/dataset-create.component";
import { GithubCallbackComponent } from "./auth/github-callback/github.callback";
import ProjectLinks from "./project-links";
import { SetTransformComponent } from "./dataset-view/additional-components/metadata-component/components/set-transform/set-transform.component";
import { LoginGuard } from "./auth/guards/login.guard";
import { ReturnToCliComponent } from "./components/return-to-cli/return-to-cli.component";
import { AddPushSourceComponent } from "./dataset-view/additional-components/metadata-component/components/source-events/add-push-source/add-push-source.component";
import { adminGuard } from "./auth/guards/admin.guard";
import { AdminDashboardComponent } from "./admin-view/admin-dashboard/admin-dashboard.component";
import { DatasetFlowDetailsComponent } from "./dataset-flow/dataset-flow-details/dataset-flow-details.component";
import { AccountComponent } from "./account/account.component";
import { QueryExplainerComponent } from "./query-explainer/query-explainer.component";

export const routes: Routes = [
    { path: "", redirectTo: ProjectLinks.DEFAULT_URL, pathMatch: "full" },
    {
        path: ProjectLinks.URL_GITHUB_CALLBACK,
        component: GithubCallbackComponent,
    },
    {
        path: ProjectLinks.URL_LOGIN,
        component: LoginComponent,
        canActivate: [LoginGuard],
    },
    {
        path: ProjectLinks.URL_SEARCH,
        component: SearchComponent,
        children: [{ path: ":id", component: SearchComponent }],
    },
    {
        canActivate: [AuthenticatedGuard],
        path: ProjectLinks.URL_DATASET_CREATE,
        component: DatasetCreateComponent,
    },
    {
        canActivate: [adminGuard],
        path: ProjectLinks.URL_ADMIN_DASHBOARD,
        component: AdminDashboardComponent,
    },
    {
        path: ProjectLinks.URL_QUERY_EXPLAINER,
        component: QueryExplainerComponent,
        loadChildren: () => import("./query-explainer/query-explainer.module").then((m) => m.QueryExplainerModule),
    },
    {
        path: ProjectLinks.URL_QUERY,
        component: GlobalQueryComponent,
        loadChildren: () => import("./query/query.module").then((m) => m.QueryModule),
    },
    {
        path:
            `:${ProjectLinks.URL_PARAM_ACCOUNT_NAME}/:${ProjectLinks.URL_PARAM_DATASET_NAME}` +
            `/${ProjectLinks.URL_BLOCK}/:${ProjectLinks.URL_PARAM_BLOCK_HASH}`,
        component: MetadataBlockComponent,
    },
    {
        canActivate: [AuthenticatedGuard],
        path:
            `:${ProjectLinks.URL_PARAM_ACCOUNT_NAME}/:${ProjectLinks.URL_PARAM_DATASET_NAME}` +
            `/${ProjectLinks.URL_FLOW_DETAILS}/:${ProjectLinks.URL_PARAM_FLOW_ID}/:${ProjectLinks.URL_PARAM_CATEGORY}`,
        component: DatasetFlowDetailsComponent,
    },
    {
        path: ProjectLinks.URL_PAGE_NOT_FOUND,
        component: PageNotFoundComponent,
    },
    {
        path: ProjectLinks.URL_RETURN_TO_CLI,
        component: ReturnToCliComponent,
    },
    {
        path: ProjectLinks.URL_SETTINGS,
        canActivate: [AuthenticatedGuard],
        children: [
            {
                path: `:${ProjectLinks.URL_PARAM_CATEGORY}`,
                component: AccountSettingsComponent,
            },
        ],
    },
    {
        path: `:${ProjectLinks.URL_PARAM_ACCOUNT_NAME}`,
        children: [
            {
                path: "",
                component: AccountComponent,
            },
            {
                path: `:${ProjectLinks.URL_PARAM_DATASET_NAME}`,
                component: DatasetComponent,
            },
        ],
    },
    {
        canActivate: [AuthenticatedGuard],
        path:
            `:${ProjectLinks.URL_PARAM_ACCOUNT_NAME}/:${ProjectLinks.URL_PARAM_DATASET_NAME}` +
            `/${ProjectLinks.URL_PARAM_ADD_POLLING_SOURCE}`,
        component: AddPollingSourceComponent,
    },
    {
        canActivate: [AuthenticatedGuard],
        path:
            `:${ProjectLinks.URL_PARAM_ACCOUNT_NAME}/:${ProjectLinks.URL_PARAM_DATASET_NAME}` +
            `/${ProjectLinks.URL_PARAM_ADD_PUSH_SOURCE}`,
        component: AddPushSourceComponent,
    },
    {
        canActivate: [AuthenticatedGuard],
        path:
            `:${ProjectLinks.URL_PARAM_ACCOUNT_NAME}/:${ProjectLinks.URL_PARAM_DATASET_NAME}` +
            `/${ProjectLinks.URL_PARAM_SET_TRANSFORM}`,
        component: SetTransformComponent,
    },
    {
        path: "**",
        component: PageNotFoundComponent,
    },
];

@NgModule({
    imports: [RouterModule.forRoot(routes, { onSameUrlNavigation: "reload" })],
    exports: [RouterModule],
})
export class AppRoutingModule {}
