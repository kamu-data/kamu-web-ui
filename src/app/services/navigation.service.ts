import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { logError } from "../common/app.helpers";
import { DatasetNavigationParams } from "../interface/navigation.interface";
import ProjectLinks from "../project-links";

@Injectable()
export class NavigationService {
    constructor(private router: Router) {}

    public navigateToWebsite(url: string): void {
        window.open(url, "_blank");
    }

    public navigateToHome(): void {
        this.router.navigate([ProjectLinks.urlHome]).catch((e) => logError(e));
    }

    public navigateToSearch(query?: string, page?: number): void {
        this.router
            .navigate([ProjectLinks.urlSearch], {
                queryParams: query ? { query, page } : { page },
            })
            .catch((e) => logError(e));
    }

    public navigateToDatasetCreate(): void {
        this.router
            .navigate([ProjectLinks.urlDatasetCreate])
            .catch((e) => logError(e));
    }

    public navigateToDatasetView(params: DatasetNavigationParams): void {
        this.router
            .navigate([params.accountName, params.datasetName], {
                queryParams:
                    params.page === 1
                        ? { tab: params.tab }
                        : { tab: params.tab, page: params.page },
            })
            .catch((e) => logError(e));
    }

    public navigateToLogin(): void {
        this.router.navigate([ProjectLinks.urlLogin]).catch((e) => logError(e));
    }

    public navigateToOwnerView(ownerName: string): void {
        this.router.navigate([ownerName]).catch((e) => logError(e));
    }
}
