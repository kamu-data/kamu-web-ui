/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { inject, Injectable } from "@angular/core";

import { Observable } from "rxjs";
import { map } from "rxjs/operators";

import { FieldMutationResult } from "@common/validation/server-errors.helpers";
import { DatasetOperationError } from "@common/values/errors";
import { DatasetApi } from "@api/dataset.api";
import {
    AccountFragment,
    CreateDatasetAsCollectionMutation,
    CreateDatasetAsVersionedFileMutation,
    CreateDatasetFromSnapshotMutation,
    CreateEmptyDatasetMutation,
    DatasetKind,
    DatasetVisibility,
} from "@api/kamu.graphql.interface";
import { MaybeNull } from "@interface/app.types";

import { LoggedUserService } from "src/app/auth/logged-user.service";
import { DatasetViewTypeEnum } from "src/app/dataset-view/dataset-view.interface";
import { NavigationService } from "src/app/services/navigation.service";

@Injectable({ providedIn: "root" })
export class DatasetCreateService {
    public static readonly NOT_LOGGED_USER_ERROR = "User must be logged in to create a dataset";

    private datasetApi = inject(DatasetApi);
    private loggedUserService = inject(LoggedUserService);
    private navigationService = inject(NavigationService);

    public createEmptyDataset(params: {
        datasetKind: DatasetKind;
        datasetAlias: string;
        datasetVisibility: DatasetVisibility;
    }): Observable<FieldMutationResult<true>> {
        const loggedUser: MaybeNull<AccountFragment> = this.loggedUserService.maybeCurrentlyLoggedInUser;
        if (loggedUser) {
            return this.datasetApi.createEmptyDataset(params).pipe(
                map((data: CreateEmptyDatasetMutation): FieldMutationResult<true> => {
                    if (data.datasets.createEmpty.__typename === "CreateDatasetResultSuccess") {
                        this.navigationService.navigateToDatasetView({
                            accountName: loggedUser.accountName,
                            datasetName: params.datasetAlias,
                            tab: DatasetViewTypeEnum.Overview,
                        });
                        return { ok: true, value: true };
                    }
                    return { ok: false, fieldError: data.datasets.createEmpty.message };
                }),
            );
        } else {
            throw new DatasetOperationError([new Error(DatasetCreateService.NOT_LOGGED_USER_ERROR)]);
        }
    }

    public createDatasetFromSnapshot(params: {
        snapshot: string;
        datasetVisibility: DatasetVisibility;
    }): Observable<FieldMutationResult<true>> {
        const loggedUser: MaybeNull<AccountFragment> = this.loggedUserService.maybeCurrentlyLoggedInUser;
        if (loggedUser) {
            return this.datasetApi.createDatasetFromSnapshot(params).pipe(
                map((data: CreateDatasetFromSnapshotMutation): FieldMutationResult<true> => {
                    if (data.datasets.createFromSnapshot.__typename === "CreateDatasetResultSuccess") {
                        const datasetName = data.datasets.createFromSnapshot.dataset.name;
                        this.navigationService.navigateToDatasetView({
                            accountName: loggedUser.accountName,
                            datasetName,
                            tab: DatasetViewTypeEnum.Overview,
                        });
                        return { ok: true, value: true };
                    }
                    return { ok: false, fieldError: data.datasets.createFromSnapshot.message };
                }),
            );
        } else {
            throw new DatasetOperationError([new Error(DatasetCreateService.NOT_LOGGED_USER_ERROR)]);
        }
    }

    public createCollection(params: {
        datasetAlias: string;
        datasetVisibility: DatasetVisibility;
    }): Observable<FieldMutationResult<true>> {
        const loggedUser: MaybeNull<AccountFragment> = this.loggedUserService.maybeCurrentlyLoggedInUser;
        if (loggedUser) {
            return this.datasetApi.createDatasetAsCollection(params).pipe(
                map((data: CreateDatasetAsCollectionMutation): FieldMutationResult<true> => {
                    if (data.datasets.createCollection.__typename === "CreateDatasetResultSuccess") {
                        const datasetName = data.datasets.createCollection.dataset.name;
                        this.navigationService.navigateToDatasetView({
                            accountName: loggedUser.accountName,
                            datasetName,
                            tab: DatasetViewTypeEnum.Overview,
                        });
                        return { ok: true, value: true };
                    }
                    return { ok: false, fieldError: data.datasets.createCollection.message };
                }),
            );
        } else {
            throw new DatasetOperationError([new Error(DatasetCreateService.NOT_LOGGED_USER_ERROR)]);
        }
    }

    public createVersionedFile(params: {
        datasetAlias: string;
        datasetVisibility: DatasetVisibility;
    }): Observable<FieldMutationResult<true>> {
        const loggedUser: MaybeNull<AccountFragment> = this.loggedUserService.maybeCurrentlyLoggedInUser;
        if (loggedUser) {
            return this.datasetApi.createDatasetAsVersionedFile(params).pipe(
                map((data: CreateDatasetAsVersionedFileMutation): FieldMutationResult<true> => {
                    if (data.datasets.createVersionedFile.__typename === "CreateDatasetResultSuccess") {
                        const datasetName = data.datasets.createVersionedFile.dataset.name;
                        this.navigationService.navigateToDatasetView({
                            accountName: loggedUser.accountName,
                            datasetName,
                            tab: DatasetViewTypeEnum.Overview,
                        });
                        return { ok: true, value: true };
                    }
                    return { ok: false, fieldError: data.datasets.createVersionedFile.message };
                }),
            );
        } else {
            throw new DatasetOperationError([new Error(DatasetCreateService.NOT_LOGGED_USER_ERROR)]);
        }
    }
}
