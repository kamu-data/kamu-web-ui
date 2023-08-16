import { Observable } from "rxjs";
import { NavigationService } from "src/app/services/navigation.service";
import { Injectable } from "@angular/core";
import { DatasetApi } from "src/app/api/dataset.api";
import { map } from "rxjs/operators";
import { DeleteDatasetMutation } from "src/app/api/kamu.graphql.interface";
import { DatasetViewTypeEnum } from "src/app/dataset-view/dataset-view.interface";
import { promiseWithCatch } from "src/app/common/app.helpers";
import { ModalService } from "src/app/components/modal/modal.service";

@Injectable({
    providedIn: "root",
})
export class DatasetSettingsService {
    constructor(
        private datasetApi: DatasetApi,
        private navigationService: NavigationService,
        private modalService: ModalService,
    ) {}

    public deleteDataset(datasetId: string): Observable<void> {
        return this.datasetApi.deleteDataset(datasetId).pipe(
            map((data: DeleteDatasetMutation | undefined | null) => {
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
}
