import { Observable, Subject } from "rxjs";
import { NavigationService } from "src/app/services/navigation.service";
import { Injectable } from "@angular/core";
import { DatasetApi } from "src/app/api/dataset.api";
import { map } from "rxjs/operators";
import { DeleteDatasetMutation, RenameDatasetMutation } from "src/app/api/kamu.graphql.interface";
import { DatasetViewTypeEnum } from "src/app/dataset-view/dataset-view.interface";
import { DatasetService } from "src/app/dataset-view/dataset.service";
import { LoggedUserService } from "src/app/auth/logged-user.service";
import { DatasetNotFoundError, DatasetOperationError } from "src/app/common/errors";

@Injectable({
    providedIn: "root",
})
export class DatasetSettingsService {
    public static readonly NOT_LOGGED_USER_ERROR = "User must be logged in to configure dataset";

    private errorRenameDatasetChanges$: Subject<string> = new Subject<string>();

    public errorRenameDatasetChanges(message: string): void {
        this.errorRenameDatasetChanges$.next(message);
    }

    public get onErrorRenameDatasetChanges(): Observable<string> {
        return this.errorRenameDatasetChanges$.asObservable();
    }

    constructor(
        private datasetApi: DatasetApi,
        private navigationService: NavigationService,
        private loggedUserService: LoggedUserService,
        private datasetService: DatasetService,
    ) {}

    public deleteDataset(datasetId: string): Observable<void> {
        if (this.loggedUserService.isAuthenticated) {
            return this.datasetApi.deleteDataset(datasetId).pipe(
                map((data: DeleteDatasetMutation) => {
                    if (data.datasets.byId) {
                        if (data.datasets.byId.delete.__typename === "DeleteResultSuccess") {
                            this.navigationService.navigateToSearch();
                        } else {
                            throw new DatasetOperationError([new Error(data.datasets.byId.delete.message)]);
                        }
                    } else {
                        throw new DatasetNotFoundError();
                    }
                }),
            );
        } else {
            throw new DatasetOperationError([new Error(DatasetSettingsService.NOT_LOGGED_USER_ERROR)]);
        }
    }

    public renameDataset(accountName: string, datasetId: string, newName: string): Observable<void> {
        if (this.loggedUserService.isAuthenticated) {
            return this.datasetApi.renameDataset(datasetId, newName).pipe(
                map((data: RenameDatasetMutation) => {
                    if (data.datasets.byId) {
                        const renameType = data.datasets.byId.rename.__typename;
                        if (renameType === "RenameResultSuccess") {
                            this.datasetService
                                .requestDatasetMainData({
                                    accountName,
                                    datasetName: newName,
                                })
                                .subscribe();
                            this.navigationService.navigateToDatasetView({
                                accountName,
                                datasetName: newName,
                                tab: DatasetViewTypeEnum.Overview,
                            });
                        } else {
                            // RenameResultNameCollision
                            // RenameResultNoChanges
                            this.errorRenameDatasetChanges(data.datasets.byId.rename.message);
                        }
                    } else {
                        throw new DatasetNotFoundError();
                    }
                }),
            );
        } else {
            throw new DatasetOperationError([new Error(DatasetSettingsService.NOT_LOGGED_USER_ERROR)]);
        }
    }

    public resetRenameError(): void {
        this.errorRenameDatasetChanges("");
    }
}