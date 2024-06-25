import { Injectable } from "@angular/core";
import { ToastrService } from "ngx-toastr";
import { Observable, map, of, switchMap } from "rxjs";
import { DatasetFlowApi } from "src/app/api/dataset-flow.api";
import {
    CompactionConditionInput,
    DatasetFlowCompactingMutation,
    DatasetFlowType,
} from "src/app/api/kamu.graphql.interface";
import { DatasetFlowsService } from "../../flows-component/services/dataset-flows.service";

@Injectable({
    providedIn: "root",
})
export class DatasetCompactingService {
    constructor(
        private datasetFlowApi: DatasetFlowApi,
        private toastrService: ToastrService,
        private flowsService: DatasetFlowsService,
    ) {}

    public runHardCompacting(params: {
        datasetId: string;
        datasetFlowType: DatasetFlowType;
        compactingArgs: CompactionConditionInput;
    }): Observable<boolean> {
        return this.datasetFlowApi.setDatasetFlowCompacting(params).pipe(
            map((data: DatasetFlowCompactingMutation) => {
                if (data.datasets.byId?.flows.configs.setConfigCompaction.__typename === "SetFlowConfigSuccess") {
                    return true;
                } else {
                    this.toastrService.error(data.datasets.byId?.flows.configs.setConfigCompaction.message);
                    return false;
                }
            }),
            switchMap((success: boolean) => {
                if (success) {
                    return this.flowsService.datasetTriggerFlow({
                        datasetId: params.datasetId,
                        datasetFlowType: params.datasetFlowType,
                    });
                }
                return of(false);
            }),
        );
    }
}
