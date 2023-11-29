import { DatasetInfo, TaskDetailsNavigationParams } from "../interface/navigation.interface";
import { AccountTabs } from "../auth/account/account.constants";
import { promiseWithCatch } from "src/app/common/app.helpers";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { DatasetNavigationParams, MetadataBlockNavigationParams } from "../interface/navigation.interface";
import ProjectLinks from "../project-links";
import { TaskDetailsTabs } from "../task-details/task-details/task-details.constants";

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
        const queryParams = query ? (page ? { query, page } : { query }) : page ? { page } : {};
        promiseWithCatch(this.router.navigate([ProjectLinks.URL_SEARCH], { queryParams }));
    }

    public navigateToDatasetCreate(): void {
        promiseWithCatch(this.router.navigate([ProjectLinks.URL_DATASET_CREATE]));
    }

    public navigateToSettings(): void {
        promiseWithCatch(this.router.navigate([ProjectLinks.URL_SETTINGS, "profile"]));
    }

    public navigateToMetadataBlock(params: MetadataBlockNavigationParams): void {
        promiseWithCatch(
            this.router.navigate([params.accountName, params.datasetName, ProjectLinks.URL_BLOCK, params.blockHash]),
        );
    }

    public navigateToAddPollingSource(params: DatasetInfo): void {
        promiseWithCatch(
            this.router.navigate([params.accountName, params.datasetName, ProjectLinks.URL_PARAM_ADD_POLLING_SOURCE]),
        );
    }

    public navigateToSetTransform(params: DatasetInfo): void {
        promiseWithCatch(
            this.router.navigate([params.accountName, params.datasetName, ProjectLinks.URL_PARAM_SET_TRANSFORM]),
        );
    }

    public navigateToTaskDetail(params: TaskDetailsNavigationParams): void {
        promiseWithCatch(
            this.router.navigate([
                params.accountName,
                params.datasetName,
                ProjectLinks.URL_TASK_DETAILS,
                params.taskId,
                TaskDetailsTabs.SUMMARY,
            ]),
        );
    }

    public navigateToDatasetView(params: DatasetNavigationParams): void {
        promiseWithCatch(
            this.router.navigate([params.accountName, params.datasetName], {
                queryParams: params.page === 1 ? { tab: params.tab } : { tab: params.tab, page: params.page },
                state: params.state,
            }),
        );
    }

    public navigateToLogin(): void {
        promiseWithCatch(this.router.navigate([ProjectLinks.URL_LOGIN]));
    }

    public navigateToOwnerView(ownerName: string, tab?: string, page?: number): void {
        promiseWithCatch(
            this.router.navigate([ownerName], {
                queryParams: tab !== AccountTabs.OVERVIEW ? { tab, page } : {},
            }),
        );
    }

    public navigateToPageNotFound(): void {
        promiseWithCatch(
            this.router.navigate([ProjectLinks.URL_PAGE_NOT_FOUND], {
                skipLocationChange: true,
            }),
        );
    }

    public navigateToReturnToCli(): void {
        promiseWithCatch(
            this.router.navigate([ProjectLinks.URL_RETURN_TO_CLI], {
                skipLocationChange: true,
            }),
        );
    }
}
