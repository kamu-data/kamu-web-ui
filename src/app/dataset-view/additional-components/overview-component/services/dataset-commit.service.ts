import { inject, Injectable } from "@angular/core";
import { Observable, Subject, of } from "rxjs";
import { switchMap, map } from "rxjs/operators";
import { DatasetApi } from "src/app/api/dataset.api";
import {
    CommitEventToDatasetMutation,
    DatasetByAccountAndDatasetNameQuery,
    UpdateReadmeMutation,
    UpdateWatermarkMutation,
} from "src/app/api/kamu.graphql.interface";
import { LoggedUserService } from "src/app/auth/logged-user.service";
import { MaybeUndefined } from "src/app/common/app.types";
import { DatasetNotFoundError, DatasetOperationError } from "src/app/common/errors";
import { DatasetViewTypeEnum } from "src/app/dataset-view/dataset-view.interface";
import { DatasetService } from "src/app/dataset-view/dataset.service";
import { DatasetInfo } from "src/app/interface/navigation.interface";
import { NavigationService } from "src/app/services/navigation.service";

@Injectable({
    providedIn: "root",
})
export class DatasetCommitService {
    public static readonly NOT_LOGGED_USER_ERROR = "User must be logged in to commit to a dataset";

    private commitEventError$: Subject<string> = new Subject<string>();

    public emitCommitEventErrorOccurred(message: string): void {
        this.commitEventError$.next(message);
    }

    public get commitEventErrorOccurrences(): Observable<string> {
        return this.commitEventError$.asObservable();
    }

    private datasetIdsByAccountDatasetName = new Map<string, string>();

    private datasetApi = inject(DatasetApi);
    private navigationService = inject(NavigationService);
    private datasetService = inject(DatasetService);
    private loggedUserService = inject(LoggedUserService);

    public commitEventToDataset(params: {
        accountId: string;
        accountName: string;
        datasetName: string;
        event: string;
    }): Observable<void> {
        if (this.loggedUserService.isAuthenticated) {
            return this.getIdByAccountNameAndDatasetName(params.accountName, params.datasetName).pipe(
                switchMap((datasetId: string) =>
                    this.datasetApi.commitEvent({
                        accountId: params.accountId,
                        datasetId,
                        event: params.event,
                    }),
                ),
                map((data: CommitEventToDatasetMutation) => {
                    if (data.datasets.byId) {
                        if (data.datasets.byId.metadata.chain.commitEvent.__typename === "CommitResultSuccess") {
                            this.updatePage(params.accountName, params.datasetName);
                        } else if (
                            data.datasets.byId.metadata.chain.commitEvent.__typename === "CommitResultAppendError" ||
                            data.datasets.byId.metadata.chain.commitEvent.__typename === "MetadataManifestMalformed"
                        ) {
                            this.emitCommitEventErrorOccurred(data.datasets.byId.metadata.chain.commitEvent.message);
                        } else {
                            throw new DatasetOperationError([
                                new Error(data.datasets.byId.metadata.chain.commitEvent.message),
                            ]);
                        }
                    } else {
                        throw new DatasetNotFoundError();
                    }
                }),
            );
        } else {
            throw new DatasetOperationError([new Error(DatasetCommitService.NOT_LOGGED_USER_ERROR)]);
        }
    }

    public getIdByAccountNameAndDatasetName(accountName: string, datasetName: string): Observable<string> {
        const key = `${accountName}/${datasetName}`;
        const cachedId: MaybeUndefined<string> = this.datasetIdsByAccountDatasetName.get(key);
        if (cachedId) {
            return of(cachedId);
        } else {
            return this.datasetApi.getDatasetInfoByAccountAndDatasetName(accountName, datasetName).pipe(
                map((data: DatasetByAccountAndDatasetNameQuery) => {
                    const id = data.datasets.byOwnerAndName?.id;
                    if (id) {
                        this.datasetIdsByAccountDatasetName.set(key, id);
                        return id;
                    } else {
                        throw new DatasetNotFoundError();
                    }
                }),
            );
        }
    }

    public updateReadme(params: {
        accountId: string;
        accountName: string;
        datasetName: string;
        content: string;
    }): Observable<void> {
        if (this.loggedUserService.isAuthenticated) {
            return this.getIdByAccountNameAndDatasetName(params.accountName, params.datasetName).pipe(
                switchMap((datasetId: string) =>
                    this.datasetApi.updateReadme({ accountId: params.accountId, datasetId, content: params.content }),
                ),
                map((data: UpdateReadmeMutation) => {
                    if (data.datasets.byId) {
                        if (data.datasets.byId.metadata.updateReadme.__typename === "CommitResultSuccess") {
                            this.updatePage(params.accountName, params.datasetName);
                        } else {
                            throw new DatasetOperationError([
                                new Error(data.datasets.byId.metadata.updateReadme.message),
                            ]);
                        }
                    } else {
                        throw new DatasetNotFoundError();
                    }
                }),
            );
        } else {
            throw new DatasetOperationError([new Error(DatasetCommitService.NOT_LOGGED_USER_ERROR)]);
        }
    }

    public updateWatermark(params: {
        accountId: string;
        datasetId: string;
        watermark: string;
        datasetInfo: DatasetInfo;
    }): Observable<void> {
        if (this.loggedUserService.isAuthenticated) {
            return this.datasetApi
                .setWatermark({
                    datasetId: params.datasetId,
                    watermark: params.watermark,
                    accountId: params.accountId,
                })
                .pipe(
                    map((data: UpdateWatermarkMutation) => {
                        if (data.datasets.byId) {
                            if (data.datasets.byId.setWatermark.__typename === "SetWatermarkUpdated") {
                                this.updatePage(params.datasetInfo.accountName, params.datasetInfo.datasetName);
                            } else {
                                throw new DatasetOperationError([new Error(data.datasets.byId.setWatermark.message)]);
                            }
                        } else {
                            throw new DatasetNotFoundError();
                        }
                    }),
                );
        } else {
            throw new DatasetOperationError([new Error(DatasetCommitService.NOT_LOGGED_USER_ERROR)]);
        }
    }

    private updatePage(accountName: string, datasetName: string): void {
        this.datasetService
            .requestDatasetMainData({
                accountName,
                datasetName,
            })
            .subscribe();

        this.navigationService.navigateToDatasetView({
            accountName,
            datasetName,
            tab: DatasetViewTypeEnum.Overview,
        });
    }
}
