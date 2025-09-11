/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { AfterViewChecked, ChangeDetectionStrategy, Component, inject, Input } from "@angular/core";
import { Observable } from "rxjs";
import {
    VerifyQueryDatasetBlockNotFoundError,
    VerifyQueryDatasetNotFoundError,
    VerifyQueryError,
    VerifyQueryKindError,
} from "../../query-explainer.types";
import { DatasetInfo } from "src/app/interface/navigation.interface";
import { MaybeUndefined } from "src/app/interface/app.types";
import AppValues from "src/app/common/values/app.values";
import { QueryExplainerComponentData } from "../../query-explainer.component";
import ProjectLinks from "src/app/project-links";
import { addMarkdownRunButton } from "src/app/common/helpers/app.helpers";
import { DisplayHashComponent } from "../../../common/components/display-hash/display-hash.component";
import { RouterLink } from "@angular/router";
import { NgIf, NgFor, AsyncPipe, DatePipe } from "@angular/common";
import { MarkdownModule } from "ngx-markdown";
import { MarkdownFormatPipe } from "src/app/common/pipes/markdown-format.pipe";

@Component({
    selector: "app-input-data-section",
    templateUrl: "./input-data-section.component.html",
    styleUrls: ["./input-data-section.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    providers: [MarkdownFormatPipe],
    imports: [
        //-----//
        AsyncPipe,
        DatePipe,
        NgIf,
        NgFor,
        RouterLink,

        //-----//
        MarkdownModule,

        //-----//
        DisplayHashComponent,
        MarkdownFormatPipe,
    ],
})
export class InputDataSectionComponent implements AfterViewChecked {
    @Input({ required: true }) public blockHashObservables$: Observable<Date>[];
    @Input({ required: true }) public datasetInfoObservables$: Observable<DatasetInfo>[];
    @Input({ required: true }) public inputData: QueryExplainerComponentData;

    public readonly DISPLAY_TIME_FORMAT = AppValues.DISPLAY_TIME_FORMAT;
    private markdownFormatPipe = inject(MarkdownFormatPipe);

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

    private addDynamicRunButton(): void {
        // Find all sql queries between ```sql and ```
        const sqlQueries = this.markdownFormatPipe
            .transform(this.sqlCode, "sql")
            .match(/(?<=```sql\s+).*?(?=\s+```)/gs);
        addMarkdownRunButton(sqlQueries, `/${ProjectLinks.URL_QUERY}?${ProjectLinks.URL_QUERY_PARAM_SQL_QUERY}`);
    }
}
