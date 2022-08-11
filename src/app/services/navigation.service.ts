import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import AppValues from "../common/app.values";
import ProjectLinks from "../project-links";

@Injectable()
export class NavigationService {
    constructor(private router: Router) {}

    public navigateToHome(params?: object): void {
        this.router.navigate([ProjectLinks.urlHome], { queryParams: params });
    }

    public navigateToSearch(params?: object): void {
        this.router.navigate([ProjectLinks.urlSearch], { queryParams: params });
    }
    public navigateToDatasetCreate(params?: object): void {
        this.router.navigate(
            [AppValues.defaultUsername, ProjectLinks.urlDatasetCreate],
            { queryParams: params },
        );
    }
    public navigateToDatasetView(name: string, params?: object): void {
        this.router.navigate([name, ProjectLinks.urlDatasetView], {
            queryParams: params,
        });
    }
    public navigateToLogin(params?: object): void {
        this.router.navigate([ProjectLinks.urlLogin], { queryParams: params });
    }
    public navigateToOwnerView(url: string[], params?: object): void {
        this.router.navigate(url, { queryParams: params });
    }
}
