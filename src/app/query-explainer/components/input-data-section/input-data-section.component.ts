import { ChangeDetectionStrategy, Component, Input } from "@angular/core";
import { Observable } from "rxjs";
import {
    QueryExplainerComponentData,
    QueryExplainerDataFormat,
    VerifyQueryDatasetBlockNotFoundError,
    VerifyQueryDatasetNotFoundError,
    VerifyQueryError,
    VerifyQueryKindError,
} from "../../query-explainer.types";
import { DatasetInfo } from "src/app/interface/navigation.interface";
import { MaybeUndefined } from "src/app/common/app.types";
import AppValues from "src/app/common/app.values";
import { DataSchemaFormat, QueryDialect } from "src/app/api/kamu.graphql.interface";

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

    public inputQueryDialectHelper(option: keyof typeof QueryDialect): string {
        switch (option) {
            case "SqlDataFusion":
                return "SQL DataFusion";
            case "SqlFlink":
                return "SQL Flink";
            case "SqlRisingWave":
                return "SQL RisingWave";
            case "SqlSpark":
                return "SQL Spark";
            /* istanbul ignore next */
            default:
                return "Unknown query dialect";
        }
    }

    public inputSchemaFormatHelper(option: keyof typeof DataSchemaFormat): string {
        switch (option) {
            case "ArrowJson":
                return "Arrow JSON";
            case "Parquet":
                return "Parquet";
            case "ParquetJson":
                return "Parquet JSON";
            /* istanbul ignore next */
            default:
                return "Unknown schema format";
        }
    }

    public inputDataFormatHelper(option: keyof typeof QueryExplainerDataFormat): string {
        switch (option) {
            case "JsonAoS":
                return "JSON AoS";
            case "JsonSoA":
                return "JSON SoA";
            case "JsonAoA":
                return "JSON AoA";
            /* istanbul ignore next */
            default:
                return "Unknown data format";
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
