import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { SearchComponent } from "./search/search.component";
import { LoginComponent } from "./auth/login/login.component";
import { DatasetComponent } from "./dataset-view/dataset.component";
import { DatasetCreateComponent } from "./dataset-create/dataset-create.component";
import { AccountComponent } from "./auth/account/account.component";
import AppValues from "./common/app.values";
import { GithubCallbackComponent } from "./auth/github-callback/github.callback";
import { environment } from "../environments/environment";
import {SettingsComponent} from "./auth/settings/settings.component";

const githubUrl = `https://github.com/login/oauth/authorize?scope=user:email&client_id=${environment.github_client_id}`;

const routes: Routes = [
    { path: "", redirectTo: AppValues.urlSearch, pathMatch: "full" },
    { path: AppValues.urlGithubCallback, component: GithubCallbackComponent },
    {
        path: AppValues.urlLogin,
        component: LoginComponent,
        loadChildren: () =>
            new Promise(() => {
                window.location.href = githubUrl;
            }),
    },
    {
        path: AppValues.urlSearch,
        component: SearchComponent,
        children: [{ path: ":id", component: SearchComponent }],
    },
    {
        path: "settings/profile",
        component: SettingsComponent
    },
    {
        path: ":username/dataset-view/:id",
        component: DatasetComponent
    },
    {
        path: ":username",
        children: [
            {
                path: "",
                component: AccountComponent,
            },
            {
                path: "dataset-view",
                component: DatasetComponent,
            },
            {
                path: AppValues.urlDatasetCreateSelectType,
                component: DatasetCreateComponent,
            },
            {
                path: AppValues.urlDatasetCreate,
                component: DatasetCreateComponent,
                children: [
                    {
                        path: "",
                        redirectTo: AppValues.urlDatasetCreateSelectType,
                        pathMatch: "full",
                    },
                    {
                        path: AppValues.urlDatasetCreateRoot,
                        component: DatasetCreateComponent,
                    },
                ],
            },
        ],
    },
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule],
})
export class AppRoutingModule {}
