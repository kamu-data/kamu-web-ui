import { promiseWithCatch } from "src/app/common/app.helpers";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { DatasetNavigationParams } from "../interface/navigation.interface";
import ProjectLinks from "../project-links";

@Injectable({ providedIn: "root" })
export class NavigationService {
    constructor(private router: Router) {}

    public navigateToWebsite(url: string): void {
        window.open(url, "_blank");
    }

    public navigateToHome(): void {
        promiseWithCatch(this.router.navigate([ProjectLinks.URL_HOME]));
    }

    public navigateToSearch(query?: string, page?: number): void {
        const queryParams = query
            ? page
                ? { query, page }
                : { query }
            : page
            ? { page }
            : {};
        promiseWithCatch(
            this.router.navigate([ProjectLinks.URL_SEARCH], { queryParams }),
        );
    }

    public navigateToDatasetCreate(): void {
        promiseWithCatch(
            this.router.navigate([ProjectLinks.URL_DATASET_CREATE]),
        );
    }

    public navigateToDatasetView(params: DatasetNavigationParams): void {
        promiseWithCatch(
            this.router.navigate([params.accountName, params.datasetName], {
                queryParams:
                    params.page === 1
                        ? { tab: params.tab }
                        : { tab: params.tab, page: params.page },
            }),
        );
    }

    public navigateToLogin(): void {
        promiseWithCatch(this.router.navigate([ProjectLinks.URL_LOGIN]));
    }

    public navigateToOwnerView(ownerName: string): void {
        promiseWithCatch(this.router.navigate([ownerName]));
    }

    public navigateToPageNotFound(): void {
        promiseWithCatch(
            this.router.navigate([ProjectLinks.URL_PAGE_NOT_FOUND], {
                skipLocationChange: true,
            }),
        );
    }
}
