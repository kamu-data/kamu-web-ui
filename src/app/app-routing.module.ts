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
        path: ProjectLinks.urlDatasetCreate,
        component: DatasetCreateComponent,
    },
    {
        path: `:${ProjectLinks.urlParamAccountName}`,
        children: [
            {
                path: "",
                component: AccountComponent,
            },
            {
                path: `:${ProjectLinks.urlParamDatasetName}`,
                component: DatasetComponent,
            },
        ],
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
