/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { inject, Injectable } from "@angular/core";

import { Observable, Subject } from "rxjs";
import { map } from "rxjs/operators";

import { LoggedUserService } from "src/app/auth/logged-user.service";
import { DatasetViewTypeEnum } from "src/app/dataset-view/dataset-view.interface";
import { NavigationService } from "src/app/services/navigation.service";

import { DatasetOperationError } from "@common/values/errors";
import { DatasetApi } from "@api/dataset.api";
import {
    AccountFragment,
    CreateDatasetFromSnapshotMutation,
    CreateEmptyDatasetMutation,
    DatasetKind,
    DatasetVisibility,
} from "@api/kamu.graphql.interface";
import { MaybeNull } from "@interface/app.types";

@Injectable({ providedIn: "root" })
export class DatasetCreateService {
    public static readonly NOT_LOGGED_USER_ERROR = "User must be logged in to create a dataset";

    private errorMessage$: Subject<string> = new Subject<string>();

    public emitErrorMessageChanged(message: string): void {
        this.errorMessage$.next(message);
    }

    public get errorMessageChanges(): Observable<string> {
        return this.errorMessage$.asObservable();
    }

    private datasetApi = inject(DatasetApi);
    private loggedUserService = inject(LoggedUserService);
    private navigationService = inject(NavigationService);

    public createEmptyDataset(params: {
        datasetKind: DatasetKind;
        datasetAlias: string;
        datasetVisibility: DatasetVisibility;
    }): Observable<void> {
        const loggedUser: MaybeNull<AccountFragment> = this.loggedUserService.maybeCurrentlyLoggedInUser;
        if (loggedUser) {
            return this.datasetApi.createEmptyDataset(params).pipe(
                map((data: CreateEmptyDatasetMutation) => {
                    if (data.datasets.createEmpty.__typename === "CreateDatasetResultSuccess") {
                        this.navigationService.navigateToDatasetView({
                            accountName: loggedUser.accountName,
                            datasetName: params.datasetAlias,
                            tab: DatasetViewTypeEnum.Overview,
                        });
                    } else {
                        this.emitErrorMessageChanged(data.datasets.createEmpty.message);
                    }
                }),
            );
        } else {
            throw new DatasetOperationError([new Error(DatasetCreateService.NOT_LOGGED_USER_ERROR)]);
        }
    }

    public createDatasetFromSnapshot(params: {
        snapshot: string;
        datasetVisibility: DatasetVisibility;
    }): Observable<void> {
        const loggedUser: MaybeNull<AccountFragment> = this.loggedUserService.maybeCurrentlyLoggedInUser;
        if (loggedUser) {
            return this.datasetApi.createDatasetFromSnapshot(params).pipe(
                map((data: CreateDatasetFromSnapshotMutation) => {
                    if (data.datasets.createFromSnapshot.__typename === "CreateDatasetResultSuccess") {
                        const datasetName = data.datasets.createFromSnapshot.dataset.name;
                        this.navigationService.navigateToDatasetView({
                            accountName: loggedUser.accountName,
                            datasetName,
                            tab: DatasetViewTypeEnum.Overview,
                        });
                    } else {
                        this.emitErrorMessageChanged(data.datasets.createFromSnapshot.message);
                    }
                }),
            );
        } else {
            throw new DatasetOperationError([new Error(DatasetCreateService.NOT_LOGGED_USER_ERROR)]);
        }
    }
}
