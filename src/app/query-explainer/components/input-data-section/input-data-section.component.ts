import { AfterViewChecked, ChangeDetectionStrategy, Component, Input } from "@angular/core";
import { Observable } from "rxjs";
import {
    VerifyQueryDatasetBlockNotFoundError,
    VerifyQueryDatasetNotFoundError,
    VerifyQueryError,
    VerifyQueryKindError,
} from "../../query-explainer.types";
import { DatasetInfo } from "src/app/interface/navigation.interface";
import { MaybeUndefined } from "src/app/common/app.types";
import AppValues from "src/app/common/app.values";
import { QueryExplainerComponentData } from "../../query-explainer.component";
import ProjectLinks from "src/app/project-links";
import { addMarkdownRunButton } from "src/app/common/app.helpers";

@Component({
    selector: "app-input-data-section",
    templateUrl: "./input-data-section.component.html",
    styleUrls: ["./input-data-section.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InputDataSectionComponent implements AfterViewChecked {
    @Input({ required: true }) public blockHashObservables$: Observable<Date>[];
    @Input({ required: true }) public datasetInfoObservables$: Observable<DatasetInfo>[];
    @Input({ required: true }) public inputData: QueryExplainerComponentData;
    public readonly DATE_FORMAT = AppValues.DISPLAY_FLOW_DATE_FORMAT;

    public ngAfterViewChecked(): void {
        this.addDynamicRunButton();
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

    public get sqlCode(): string {
        return this.inputData.sqlQueryExplainerResponse.input.query;
    }

    public sqlWrapper(sqlCode: string): string {
        return "```sql\n" + sqlCode + "\n```";
    }

    private addDynamicRunButton(): void {
        // Find all sql queries between ```sql and ```
        const sqlQueries = this.sqlWrapper(this.sqlCode).match(/(?<=```sql\s+).*?(?=\s+```)/gs);
        addMarkdownRunButton(sqlQueries, `/${ProjectLinks.URL_QUERY}?${ProjectLinks.URL_QUERY_PARAM_SQL_QUERY}`);
    }
}
