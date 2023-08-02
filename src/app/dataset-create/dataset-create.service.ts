import {
    CommitEventToDatasetMutation,
    CreateDatasetFromSnapshotMutation,
    CreateEmptyDatasetMutation,
    DatasetByAccountAndDatasetNameQuery,
    UpdateReadmeMutation,
} from "./../api/kamu.graphql.interface";
import { Observable, Subject } from "rxjs";
import { DatasetApi } from "src/app/api/dataset.api";
import { Injectable } from "@angular/core";
import { DatasetKind } from "../api/kamu.graphql.interface";
import { map, switchMap } from "rxjs/operators";
import { NavigationService } from "../services/navigation.service";
import { DatasetViewTypeEnum } from "../dataset-view/dataset-view.interface";
import { DatasetService } from "../dataset-view/dataset.service";

@Injectable({ providedIn: "root" })
export class AppDatasetCreateService {
    private errorMessageChanges$: Subject<string> = new Subject<string>();

    public errorMessageChanges(message: string): void {
        this.errorMessageChanges$.next(message);
    }

    public get onErrorMessageChanges(): Observable<string> {
        return this.errorMessageChanges$.asObservable();
    }

    private errorCommitEventChanges$: Subject<string> = new Subject<string>();

    public errorCommitEventChanges(message: string): void {
        this.errorCommitEventChanges$.next(message);
    }

    public get onErrorCommitEventChanges(): Observable<string> {
        return this.errorCommitEventChanges$.asObservable();
    }
    private cache = new Map<string, string>();

    public constructor(
        private datasetApi: DatasetApi,
        private navigationService: NavigationService,
        private datasetService: DatasetService,
    ) {}

    public createEmptyDataset(
        accountId: string,
        datasetKind: DatasetKind,
        datasetName: string,
    ): Observable<void> {
        return this.datasetApi
            .createEmptyDataset(accountId, datasetKind, datasetName)
            .pipe(
                map((data: CreateEmptyDatasetMutation | null | undefined) => {
                    if (
                        data?.datasets.createEmpty.__typename ===
                        "CreateDatasetResultSuccess"
                    ) {
                        this.navigationService.navigateToDatasetView({
                            accountName: accountId,
                            datasetName,
                            tab: DatasetViewTypeEnum.Overview,
                        });
                    } else {
                        if (data)
                            this.errorMessageChanges(
                                data.datasets.createEmpty.message,
                            );
                    }
                }),
            );
    }

    public createDatasetFromSnapshot(
        accountId: string,
        snapshot: string,
    ): Observable<void> {
        return this.datasetApi
            .createDatasetFromSnapshot(accountId, snapshot)
            .pipe(
                map(
                    (
                        data:
                            | CreateDatasetFromSnapshotMutation
                            | null
                            | undefined,
                    ) => {
                        if (
                            data?.datasets.createFromSnapshot.__typename ===
                            "CreateDatasetResultSuccess"
                        ) {
                            const datasetName = data.datasets.createFromSnapshot
                                .dataset.name as string;
                            this.navigationService.navigateToDatasetView({
                                accountName: accountId,
                                datasetName,
                                tab: DatasetViewTypeEnum.Overview,
                            });
                        } else {
                            if (data)
                                this.errorMessageChanges(
                                    data.datasets.createFromSnapshot.message,
                                );
                        }
                    },
                ),
            );
    }

    public commitEventToDataset(
        accountName: string,
        datasetName: string,
        event: string,
    ): Observable<void> {
        const key = `${accountName}${datasetName}`;
        let observable: Observable<
            CommitEventToDatasetMutation | null | undefined
        >;
        if (this.cache.has(key)) {
            observable = this.datasetApi.commitEvent({
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                datasetId: this.cache.get(key)!,
                event,
            });
        } else {
            observable = this.datasetApi
                .getDatasetInfoByAccountAndDatasetName(accountName, datasetName)
                .pipe(
                    switchMap((x: DatasetByAccountAndDatasetNameQuery) => {
                        const id = x.datasets.byOwnerAndName?.id as string;
                        this.cache.set(key, id);
                        return this.datasetApi.commitEvent({
                            datasetId: id,
                            event,
                        });
                    }),
                );
        }
        return observable.pipe(
            map((data: CommitEventToDatasetMutation | undefined | null) => {
                if (
                    data?.datasets.byId?.metadata.chain.commitEvent
                        .__typename === "CommitResultAppendError" ||
                    data?.datasets.byId?.metadata.chain.commitEvent
                        .__typename === "MetadataManifestMalformed"
                ) {
                    this.errorCommitEventChanges(
                        data.datasets.byId.metadata.chain.commitEvent.message,
                    );
                } else {
                    this.successActions(accountName, datasetName);
                }
            }),
        );
    }

    public updateReadme(
        accountName: string,
        datasetName: string,
        content: string,
    ): Observable<void> {
        const key = `${accountName}${datasetName}`;
        let observable: Observable<UpdateReadmeMutation | null | undefined>;
        if (this.cache.has(key)) {
            observable = this.datasetApi.updateReadme(
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                this.cache.get(key)!,
                content,
            );
        } else {
            observable = this.datasetApi
                .getDatasetInfoByAccountAndDatasetName(accountName, datasetName)
                .pipe(
                    switchMap((x: DatasetByAccountAndDatasetNameQuery) => {
                        const id = x.datasets.byOwnerAndName?.id as string;
                        this.cache.set(key, id);
                        return this.datasetApi.updateReadme(id, content);
                    }),
                );
        }
        return observable.pipe(
            map((data: UpdateReadmeMutation | null | undefined) => {
                if (
                    data?.datasets.byId?.metadata.updateReadme.__typename ===
                    "CommitResultSuccess"
                ) {
                    this.successActions(accountName, datasetName);
                }
            }),
        );
    }

    private successActions(accountName: string, datasetName: string): void {
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
