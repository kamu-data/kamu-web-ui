/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { Observable, Subject } from "rxjs";
import { NavigationService } from "src/app/services/navigation.service";
import { inject, Injectable } from "@angular/core";
import { DatasetApi } from "src/app/api/dataset.api";
import { map } from "rxjs/operators";
import {
    DatasetVisibilityInput,
    DeleteDatasetMutation,
    RenameDatasetMutation,
    SetVisibilityDatasetMutation,
} from "src/app/api/kamu.graphql.interface";
import { DatasetViewTypeEnum } from "src/app/dataset-view/dataset-view.interface";
import { DatasetService } from "src/app/dataset-view/dataset.service";
import { LoggedUserService } from "src/app/auth/logged-user.service";
import { DatasetNotFoundError, DatasetOperationError } from "src/app/common/values/errors";
import { ToastrService } from "ngx-toastr";

@Injectable({
    providedIn: "root",
})
export class DatasetSettingsService {
    public static readonly NOT_LOGGED_USER_ERROR = "User must be logged in to configure dataset";

    private renameDatasetError$: Subject<string> = new Subject<string>();
    private toastrService = inject(ToastrService);

    public emitRenameDatasetErrorOccurred(message: string): void {
        this.renameDatasetError$.next(message);
    }

    public get renameDatasetErrorOccurrences(): Observable<string> {
        return this.renameDatasetError$.asObservable();
    }

    private datasetApi = inject(DatasetApi);
    private navigationService = inject(NavigationService);
    private loggedUserService = inject(LoggedUserService);
    private datasetService = inject(DatasetService);

    public deleteDataset(accountId: string, datasetId: string): Observable<void> {
        if (this.loggedUserService.isAuthenticated) {
            return this.datasetApi.deleteDataset({ accountId, datasetId }).pipe(
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

    public renameDataset(params: {
        accountId: string;
        accountName: string;
        datasetId: string;
        newName: string;
    }): Observable<void> {
        if (this.loggedUserService.isAuthenticated) {
            return this.datasetApi
                .renameDataset({ datasetId: params.datasetId, newName: params.newName, accountId: params.accountId })
                .pipe(
                    map((data: RenameDatasetMutation) => {
                        if (data.datasets.byId) {
                            const renameType = data.datasets.byId.rename.__typename;
                            if (renameType === "RenameResultSuccess") {
                                this.datasetService
                                    .requestDatasetMainData({
                                        accountName: params.accountName,
                                        datasetName: params.newName,
                                    })
                                    .subscribe();
                                this.navigationService.navigateToDatasetView({
                                    accountName: params.accountName,
                                    datasetName: params.newName,
                                    tab: DatasetViewTypeEnum.Overview,
                                });
                            } else {
                                // RenameResultNameCollision
                                // RenameResultNoChanges
                                this.emitRenameDatasetErrorOccurred(data.datasets.byId.rename.message);
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
        this.emitRenameDatasetErrorOccurred("");
    }

    public setVisibility(params: {
        accountId: string;
        accountName: string;
        datasetId: string;
        datasetName: string;
        visibility: DatasetVisibilityInput;
    }): Observable<void> {
        if (this.loggedUserService.isAuthenticated) {
            return this.datasetApi
                .setVisibilityDataset({
                    accountId: params.accountId,
                    datasetId: params.datasetId,
                    visibility: params.visibility,
                })
                .pipe(
                    map((data: SetVisibilityDatasetMutation) => {
                        if (data.datasets.byId?.setVisibility.__typename === "SetDatasetVisibilityResultSuccess") {
                            this.datasetService
                                .requestDatasetMainData({
                                    accountName: params.accountName,
                                    datasetName: params.datasetName,
                                })
                                .subscribe();
                            this.navigationService.navigateToDatasetView({
                                accountName: params.accountName,
                                datasetName: params.datasetName,
                                tab: DatasetViewTypeEnum.Overview,
                            });
                            this.toastrService.success("Visibility changed");
                        }
                    }),
                );
        } else {
            throw new DatasetOperationError([new Error(DatasetSettingsService.NOT_LOGGED_USER_ERROR)]);
        }
    }
}
