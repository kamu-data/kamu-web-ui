import { ChangeDetectionStrategy, Component, Input } from "@angular/core";
import { Observable } from "rxjs";
import {
    QueryExplainerComponentData,
    VerifyQueryDatasetBlockNotFoundError,
    VerifyQueryDatasetNotFoundError,
    VerifyQueryError,
    VerifyQueryKindError,
} from "../../query-explainer.types";
import { DatasetInfo } from "src/app/interface/navigation.interface";
import { MaybeUndefined } from "src/app/common/app.types";
import AppValues from "src/app/common/app.values";

@Component({
    selector: "app-input-data-section",
    templateUrl: "./input-data-section.component.html",
    styleUrls: ["./input-data-section.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InputDataSectionComponent {
    @Input({ required: true }) public blockHashObservables$: Observable<Date>[];
    @Input({ required: true }) public datasetInfoObservables$: Observable<DatasetInfo>[];
    @Input({ required: true }) inputData: QueryExplainerComponentData;
    public readonly DATE_FORMAT = AppValues.DISPLAY_FLOW_DATE_FORMAT;

    public inputParamsHelper(option: string): string {
        switch (option) {
            case "SqlDataFusion":
                return "SQL DataFusion";
            case "JsonAoA":
            case "JsonAoa":
                return "JSON AoA";
            case "ArrowJson":
                return "Arrow JSON";
            /* istanbul ignore next */
            default:
                return "Unknown options";
        }
    }

    public isDatasetBlockNotFoundError(error: MaybeUndefined<VerifyQueryError>, blockHash: string): boolean {
        return (
            error?.kind === VerifyQueryKindError.DatasetBlockNotFound &&
            (error as VerifyQueryDatasetBlockNotFoundError).block_hash === blockHash
        );
    }

    public isDatasetNotFoundError(error: MaybeUndefined<VerifyQueryError>, datasetId: string): boolean {
        return (
            error?.kind === VerifyQueryKindError.DatasetNotFound &&
            (error as VerifyQueryDatasetNotFoundError).dataset_id === datasetId
        );
    }
}
