import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { NavigationParams } from "../interface/navigation.interface";
import ProjectLinks from "../project-links";

@Injectable()
export class NavigationService {
    constructor(private router: Router) {}

    public navigateToWebsite(url: string): void {
        window.open(url, "_blank");
    }

    public navigateToHome(): void {
        this.router.navigate([ProjectLinks.urlHome]);
    }

    public navigateToSearch(query?: string, page?: number): void {
        this.router.navigate([ProjectLinks.urlSearch], {
            queryParams: { query, page },
        });
    }

    public navigateToDatasetCreate(): void {
        this.router.navigate([ProjectLinks.urlDatasetCreate]);
    }

    public navigateToDatasetView(params: NavigationParams): void {
        this.router.navigate([params.accountName, params.datasetName], {
            queryParams: { tab: params.tab, page: params.page },
        });
    }

    public navigateToLogin(): void {
        this.router.navigate([ProjectLinks.urlLogin]);
    }

    public navigateToOwnerView(ownerName: string): void {
        this.router.navigate([ownerName]);
    }
}
