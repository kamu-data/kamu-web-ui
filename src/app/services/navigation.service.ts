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
        promiseWithCatch(this.router.navigate([ProjectLinks.urlHome]));
    }

    public navigateToSearch(query?: string, page?: number): void {
        promiseWithCatch(
            this.router.navigate([ProjectLinks.urlSearch], {
                queryParams: query ? { query, page } : { page },
            }),
        );
    }

    public navigateToDatasetCreate(): void {
        promiseWithCatch(this.router.navigate([ProjectLinks.urlDatasetCreate]));
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
        promiseWithCatch(this.router.navigate([ProjectLinks.urlLogin]));
    }

    public navigateToOwnerView(ownerName: string): void {
        promiseWithCatch(this.router.navigate([ownerName]));
    }

    public navigateToPageNotFound(): void {
        promiseWithCatch(
            this.router.navigate([ProjectLinks.urlPageNotFound], {
                skipLocationChange: true,
            }),
        );
    }
}
