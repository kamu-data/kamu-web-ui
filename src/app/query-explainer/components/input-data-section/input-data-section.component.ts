/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { AsyncPipe, DatePipe } from "@angular/common";
import { ChangeDetectionStrategy, Component, ElementRef, inject, Input, ViewChild } from "@angular/core";
import { RouterLink } from "@angular/router";

import { Observable } from "rxjs";

import { MarkdownComponent, MarkdownModule } from "ngx-markdown";

import { DisplayHashComponent } from "@common/components/display-hash/display-hash.component";
import { addMarkdownRunButton } from "@common/helpers/app.helpers";
import { MarkdownFormatPipe } from "@common/pipes/markdown-format.pipe";
import AppValues from "@common/values/app.values";
import { MaybeUndefined } from "@interface/app.types";
import { DatasetInfo } from "@interface/navigation.interface";

import ProjectLinks from "src/app/project-links";
import { QueryExplainerComponentData } from "src/app/query-explainer/query-explainer.component";
import {
    VerifyQueryDatasetBlockNotFoundError,
    VerifyQueryDatasetNotFoundError,
    VerifyQueryError,
    VerifyQueryKindError,
} from "src/app/query-explainer/query-explainer.types";

@Component({
    selector: "app-input-data-section",
    templateUrl: "./input-data-section.component.html",
    styleUrls: ["./input-data-section.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [MarkdownFormatPipe],
    imports: [
        //-----//
        AsyncPipe,
        DatePipe,
        RouterLink,
        //-----//
        MarkdownModule,
        //-----//
        DisplayHashComponent,
        MarkdownFormatPipe,
    ],
})
export class InputDataSectionComponent {
    @Input({ required: true }) public blockHashObservables$: Observable<Date>[];
    @Input({ required: true }) public datasetInfoObservables$: Observable<DatasetInfo>[];
    @Input({ required: true }) public inputData: QueryExplainerComponentData;
    @ViewChild(MarkdownComponent, { read: ElementRef }) private markdownElement?: ElementRef<HTMLElement>;

    public readonly DISPLAY_TIME_FORMAT = AppValues.DISPLAY_TIME_FORMAT;
    private markdownFormatPipe = inject(MarkdownFormatPipe);

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

    public onMarkdownReady(): void {
        if (!this.markdownElement) {
            return;
        }
        // Find all sql queries between ```sql and ```
        const sqlQueries = this.markdownFormatPipe
            .transform(this.sqlCode, "sql")
            .match(/(?<=```sql\s+).*?(?=\s+```)/gs);
        addMarkdownRunButton(
            this.markdownElement.nativeElement,
            sqlQueries,
            `/${ProjectLinks.URL_QUERY}?${ProjectLinks.URL_QUERY_PARAM_SQL_QUERY}`,
        );
    }
}
