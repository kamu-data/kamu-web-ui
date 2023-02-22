import { CreateEmptyDatasetQuery } from "./../api/kamu.graphql.interface";
import { Observable, Subject } from "rxjs";
import { DatasetApi } from "src/app/api/dataset.api";
import { Injectable } from "@angular/core";
import { DatasetKind } from "../api/kamu.graphql.interface";
import { map } from "rxjs/operators";
import { NavigationService } from "../services/navigation.service";
import { DatasetViewTypeEnum } from "../dataset-view/dataset-view.interface";

@Injectable({ providedIn: "root" })
export class AppDatasetCreateService {
    private errorMessageChanges$: Subject<string> = new Subject<string>();

    public get onErrorMessageChanges(): Observable<string> {
        return this.errorMessageChanges$.asObservable();
    }

    public errorMessageChanges(message: string): void {
        this.errorMessageChanges$.next(message);
    }

    public constructor(
        private datasetApi: DatasetApi,
        private navigationService: NavigationService,
    ) {}

    public createEmptyDataset(
        accountId: string,
        datasetKind: DatasetKind,
        datasetName: string,
    ): Observable<void> {
        return this.datasetApi
            .createEmptyDataset(accountId, datasetKind, datasetName)
            .pipe(
                map((data: CreateEmptyDatasetQuery) => {
                    if (
                        data.datasets.createEmpty.__typename ===
                        "CreateDatasetResultSuccess"
                    ) {
                        this.navigationService.navigateToDatasetView({
                            accountName: accountId,
                            datasetName,
                            tab: DatasetViewTypeEnum.Overview,
                        });
                    } else {
                        this.errorMessageChanges(
                            data.datasets.createEmpty.message,
                        );
                    }
                }),
            );
    }
}
