import { AddPollingSourceComponent } from "./dataset-view/additional-components/metadata-component/components/add-polling-source/add-polling-source.component";
import { MetadataBlockComponent } from "./dataset-block/metadata-block/metadata-block.component";
import { AuthenticationGuard } from "./auth/authentication.guard";
import { SettingsComponent } from "./auth/settings/settings.component";
import { PageNotFoundComponent } from "./components/page-not-found/page-not-found.component";
import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { SearchComponent } from "./search/search.component";
import { LoginComponent } from "./auth/login/login.component";
import { DatasetComponent } from "./dataset-view/dataset.component";
import { DatasetCreateComponent } from "./dataset-create/dataset-create.component";
import { AccountComponent } from "./auth/account/account.component";
import { GithubCallbackComponent } from "./auth/github-callback/github.callback";
import { environment } from "../environments/environment";
import ProjectLinks from "./project-links";

const githubUrl = `https://github.com/login/oauth/authorize?scope=user:email&client_id=${environment.github_client_id}`;

export const routes: Routes = [
    { path: "", redirectTo: ProjectLinks.URL_SEARCH, pathMatch: "full" },
    {
        path: ProjectLinks.URL_GITHUB_CALLBACK,
        component: GithubCallbackComponent,
    },
    {
        path: ProjectLinks.URL_LOGIN,
        component: LoginComponent,
        loadChildren: () =>
            new Promise(() => {
                window.location.href = githubUrl;
            }),
    },
    {
        path: ProjectLinks.URL_SEARCH,
        component: SearchComponent,
        children: [{ path: ":id", component: SearchComponent }],
    },
    {
        path: ProjectLinks.URL_DATASET_CREATE,
        component: DatasetCreateComponent,
    },
    {
        path:
            `:${ProjectLinks.URL_PARAM_ACCOUNT_NAME}/:${ProjectLinks.URL_PARAM_DATASET_NAME}` +
            `/${ProjectLinks.URL_BLOCK}/:${ProjectLinks.URL_PARAM_BLOCK_HASH}`,
        component: MetadataBlockComponent,
    },
    {
        path: ProjectLinks.URL_PAGE_NOT_FOUND,
        component: PageNotFoundComponent,
    },
    {
        path: ProjectLinks.URL_SETTINGS,
        canActivate: [AuthenticationGuard],
        children: [
            {
                path: `:${ProjectLinks.URL_PARAM_CATEGORY}`,
                component: SettingsComponent,
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
        path:
            `:${ProjectLinks.URL_PARAM_ACCOUNT_NAME}/:${ProjectLinks.URL_PARAM_DATASET_NAME}` +
            `/${ProjectLinks.URL_PARAM_ADD_POLLING_SOURCE}`,
        component: AddPollingSourceComponent,
    },
    {
        path: "**",
        component: PageNotFoundComponent,
    },
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule],
})
export class AppRoutingModule {}
