import { Observable, Subject } from "rxjs";
import { NavigationService } from "src/app/services/navigation.service";
import { Injectable } from "@angular/core";
import { DatasetApi } from "src/app/api/dataset.api";
import { map } from "rxjs/operators";
import { DeleteDatasetMutation, RenameDatasetMutation } from "src/app/api/kamu.graphql.interface";
import { DatasetViewTypeEnum } from "src/app/dataset-view/dataset-view.interface";
import { promiseWithCatch } from "src/app/common/app.helpers";
import { ModalService } from "src/app/components/modal/modal.service";
import { DatasetService } from "src/app/dataset-view/dataset.service";
import { MaybeNullOrUndefined } from "src/app/common/app.types";

@Injectable({
    providedIn: "root",
})
export class DatasetSettingsService {
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
        private modalService: ModalService,
        private datasetService: DatasetService,
    ) {}

    public deleteDataset(datasetId: string): Observable<void> {
        return this.datasetApi.deleteDataset(datasetId).pipe(
            map((data: MaybeNullOrUndefined<DeleteDatasetMutation>) => {
                if (data?.datasets.byId?.delete.__typename === "DeleteResultSuccess") {
                    this.navigationService.navigateToSearch();
                } else {
                    if (data) {
                        promiseWithCatch(
                            this.modalService.error({
                                title: "Can't delete",
                                message: data.datasets.byId?.delete.message,
                                yesButtonText: "Ok",
                            }),
                        );
                    }
                }
            }),
        );
    }

    public renameDataset(accountName: string, datasetId: string, newName: string): Observable<void> {
        return this.datasetApi.renameDataset(datasetId, newName).pipe(
            map((data: MaybeNullOrUndefined<RenameDatasetMutation>) => {
                if (data?.datasets.byId?.rename.__typename === "RenameResultSuccess") {
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
                    if (data) {
                        this.proccesRenameError(data);
                    }
                }
            }),
        );
    }

    public resetRenameError(): void {
        this.errorRenameDatasetChanges("");
    }

    private proccesRenameError(data: RenameDatasetMutation): void {
        if (
            data.datasets.byId?.rename.__typename === "RenameResultNameCollision" ||
            data.datasets.byId?.rename.__typename === "RenameResultNoChanges"
        ) {
            this.errorRenameDatasetChanges(data.datasets.byId.rename.message);
        } else {
            promiseWithCatch(
                this.modalService.error({
                    title: "Can't rename dataset",
                    message: data.datasets.byId?.rename.message,
                    yesButtonText: "Ok",
                }),
            );
        }
    }
}
