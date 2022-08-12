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
import ProjectLinks from "./project-links";

const githubUrl = `https://github.com/login/oauth/authorize?scope=user:email&client_id=${environment.github_client_id}`;

const routes: Routes = [
    { path: "", redirectTo: ProjectLinks.urlSearch, pathMatch: "full" },
    {
        path: ProjectLinks.urlGithubCallback,
        component: GithubCallbackComponent,
    },
    {
        path: ProjectLinks.urlLogin,
        component: LoginComponent,
        loadChildren: () =>
            new Promise(() => {
                window.location.href = githubUrl;
            }),
    },
    {
        path: ProjectLinks.urlSearch,
        component: SearchComponent,
        children: [{ path: ":id", component: SearchComponent }],
    },
    {
        path: ":username/dataset-view/:id",
        component: DatasetComponent,
    },
    {
        path: ":username",
        children: [
            {
                path: "",
                component: AccountComponent,
            },
            {
                path: ProjectLinks.urlDatasetView,
                component: DatasetComponent,
            },
            {
                path: ProjectLinks.urlDatasetCreateSelectType,
                component: DatasetCreateComponent,
            },
            {
                path: ProjectLinks.urlDatasetCreate,
                component: DatasetCreateComponent,
                children: [
                    {
                        path: "",
                        redirectTo: ProjectLinks.urlDatasetCreateSelectType,
                        pathMatch: "full",
                    },
                    {
                        path: ProjectLinks.urlDatasetCreateRoot,
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
