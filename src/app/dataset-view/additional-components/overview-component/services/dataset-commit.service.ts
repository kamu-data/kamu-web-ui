import { Injectable } from "@angular/core";
import { Observable, Subject, of } from "rxjs";
import { switchMap, map } from "rxjs/operators";
import { DatasetApi } from "src/app/api/dataset.api";
import {
    CommitEventToDatasetMutation,
    DatasetByAccountAndDatasetNameQuery,
    UpdateReadmeMutation,
} from "src/app/api/kamu.graphql.interface";
import { LoggedUserService } from "src/app/auth/logged-user.service";
import { MaybeUndefined } from "src/app/common/app.types";
import { DatasetNotFoundError, DatasetOperationError } from "src/app/common/errors";
import { DatasetViewTypeEnum } from "src/app/dataset-view/dataset-view.interface";
import { DatasetService } from "src/app/dataset-view/dataset.service";
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

    constructor(
        private datasetApi: DatasetApi,
        private navigationService: NavigationService,
        private datasetService: DatasetService,
        private loggedUserService: LoggedUserService,
    ) {}

    public commitEventToDataset(accountName: string, datasetName: string, event: string): Observable<void> {
        if (this.loggedUserService.isAuthenticated) {
            return this.getIdByAccountNameAndDatasetName(accountName, datasetName).pipe(
                switchMap((id: string) =>
                    this.datasetApi.commitEvent({
                        datasetId: id,
                        event,
                    }),
                ),
                map((data: CommitEventToDatasetMutation) => {
                    if (data.datasets.byId) {
                        if (data.datasets.byId.metadata.chain.commitEvent.__typename === "CommitResultSuccess") {
                            this.updatePage(accountName, datasetName);
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

    public updateReadme(accountName: string, datasetName: string, content: string): Observable<void> {
        if (this.loggedUserService.isAuthenticated) {
            return this.getIdByAccountNameAndDatasetName(accountName, datasetName).pipe(
                switchMap((id: string) => this.datasetApi.updateReadme(id, content)),
                map((data: UpdateReadmeMutation) => {
                    if (data.datasets.byId) {
                        if (data.datasets.byId.metadata.updateReadme.__typename === "CommitResultSuccess") {
                            this.updatePage(accountName, datasetName);
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
