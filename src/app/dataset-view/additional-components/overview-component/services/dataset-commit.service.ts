import { Injectable } from "@angular/core";
import { Observable, Subject, of } from "rxjs";
import { switchMap, map } from "rxjs/operators";
import { DatasetApi } from "src/app/api/dataset.api";
import {
    CommitEventToDatasetMutation,
    DatasetByAccountAndDatasetNameQuery,
    UpdateReadmeMutation,
} from "src/app/api/kamu.graphql.interface";
import { MaybeNullOrUndefined } from "src/app/common/app.types";
import { DatasetNotFoundError } from "src/app/common/errors";
import { DatasetViewTypeEnum } from "src/app/dataset-view/dataset-view.interface";
import { DatasetService } from "src/app/dataset-view/dataset.service";
import { NavigationService } from "src/app/services/navigation.service";

@Injectable({
    providedIn: "root",
})
export class DatasetCommitService {
    private errorCommitEventChanges$: Subject<string> = new Subject<string>();

    public errorCommitEventChanges(message: string): void {
        this.errorCommitEventChanges$.next(message);
    }

    public get onErrorCommitEventChanges(): Observable<string> {
        return this.errorCommitEventChanges$.asObservable();
    }

    private datasetIdsByAccountDatasetName = new Map<string, string>();

    constructor(
        private datasetApi: DatasetApi,
        private navigationService: NavigationService,
        private datasetService: DatasetService,
    ) {}

    public commitEventToDataset(accountName: string, datasetName: string, event: string): Observable<void> {
        return this.getIdByAccountNameAndDatasetName(accountName, datasetName).pipe(
            switchMap((id: string) =>
                this.datasetApi.commitEvent({
                    datasetId: id,
                    event,
                }),
            ),
            map((data: MaybeNullOrUndefined<CommitEventToDatasetMutation>) => {
                if (
                    data?.datasets.byId?.metadata.chain.commitEvent.__typename === "CommitResultAppendError" ||
                    data?.datasets.byId?.metadata.chain.commitEvent.__typename === "MetadataManifestMalformed"
                ) {
                    this.errorCommitEventChanges(data.datasets.byId.metadata.chain.commitEvent.message);
                } else {
                    this.updatePage(accountName, datasetName);
                }
            }),
        );
    }

    public getIdByAccountNameAndDatasetName(accountName: string, datasetName: string): Observable<string> {
        const key = `${accountName}/${datasetName}`;
        const cachedId: string | undefined = this.datasetIdsByAccountDatasetName.get(key);
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
                        throw new DatasetNotFoundError(key);
                    }
                }),
            );
        }
    }

    public updateReadme(accountName: string, datasetName: string, content: string): Observable<void> {
        return this.getIdByAccountNameAndDatasetName(accountName, datasetName).pipe(
            switchMap((id: string) => this.datasetApi.updateReadme(id, content)),
            map((data: MaybeNullOrUndefined<UpdateReadmeMutation>) => {
                if (data?.datasets.byId?.metadata.updateReadme.__typename === "CommitResultSuccess") {
                    this.updatePage(accountName, datasetName);
                }
            }),
        );
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
