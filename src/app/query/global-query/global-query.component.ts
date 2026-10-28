/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { AsyncPipe } from "@angular/common";
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, Input, OnInit } from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";

import { filter, finalize, fromEvent, map, Observable, takeUntil } from "rxjs";

import { BaseComponent } from "@common/components/base.component";
import { promiseWithCatch } from "@common/helpers/app.helpers";
import { queryParamValue } from "@common/helpers/url-params.helpers";
import AppValues from "@common/values/app.values";
import { MaybeNull, MaybeUndefined } from "@interface/app.types";
import { DatasetRequestBySql } from "@interface/dataset.interface";

import { DataSqlErrorUpdate } from "src/app/dataset-view/dataset.subscriptions.interface";
import ProjectLinks from "src/app/project-links";
import { SqlQueryBasicResponse } from "src/app/query/global-query/global-query.model";
import { SearchAndSchemasSectionComponent } from "src/app/query/global-query/search-and-schemas-section/search-and-schemas-section.component";
import { QueryAndResultSectionsComponent } from "src/app/query/shared/query-and-result-sections/query-and-result-sections.component";
import { CancelRequestService } from "src/app/services/cancel-request.service";
import { NavigationService } from "src/app/services/navigation.service";
import { QueryMicroDbTrackerService } from "src/app/services/query-micro-db-tracker.service";
import { SqlQueryService } from "src/app/services/sql-query.service";

@Component({
    selector: "app-global-query",
    templateUrl: "./global-query.component.html",
    styleUrls: ["./global-query.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [
        //-----//
        AsyncPipe,
        //-----//
        QueryAndResultSectionsComponent,
        SearchAndSchemasSectionComponent,
    ],
})
export class GlobalQueryComponent extends BaseComponent implements OnInit {
    @Input({ alias: ProjectLinks.URL_QUERY_PARAM_SQL_QUERY, transform: queryParamValue })
    public set sqlQuery(value: MaybeUndefined<string>) {
        this.sqlQueryFromUrl = value;
        // A run of the selected part only must not replace the rest of the editor's text
        if (this.queryOfOwnRun !== undefined && value === this.queryOfOwnRun) {
            this.queryOfOwnRun = undefined;
        } else {
            this.sqlRequestCode = value ?? "";
        }
    }
    private sqlQueryFromUrl: MaybeUndefined<string>;
    private queryOfOwnRun: MaybeUndefined<string>;
    public sqlRequestCode = "";
    public sqlLoading = false;
    public sqlErrorMarker$: Observable<string>;
    public sqlQueryResponse$: Observable<MaybeNull<SqlQueryBasicResponse>>;
    public readonly MONACO_PLACEHOLDER = "Please type your query here or find the dataset in the search...";
    private visibilityDocumentChange$ = fromEvent(document, "visibilitychange");

    private sqlQueryService = inject(SqlQueryService);
    private navigationService = inject(NavigationService);
    private cancelRequestService = inject(CancelRequestService);
    private cdr = inject(ChangeDetectorRef);
    private queryMicroDbTrackerService = inject(QueryMicroDbTrackerService);

    public ngOnInit(): void {
        this.sqlQueryService.resetSqlError();
        this.sqlQueryService.emitSqlQueryResponseChanged(null);
        this.sqlErrorMarker$ = this.sqlQueryService.sqlErrorOccurrences.pipe(
            map((data: DataSqlErrorUpdate) => data.error),
        );
        this.sqlQueryResponse$ = this.sqlQueryService.sqlQueryResponseChanges;
        promiseWithCatch(this.buildSqlRequestCode().then());
    }

    public setDefaultQuery(sqlRequestCode: string): void {
        this.sqlRequestCode = sqlRequestCode;
    }

    private async buildSqlRequestCode(): Promise<void> {
        // A query from the URL wins over the saved one, so shared query links open what they carry
        if (this.sqlRequestCode) {
            return;
        }
        const entry = await this.queryMicroDbTrackerService
            .getQuery(AppValues.MICRO_DB_GLOBAL_QUERY_SQL)
            .catch(() => undefined);
        if (entry) {
            this.sqlRequestCode = entry.query;
            this.cdr.markForCheck();
        }
    }

    public runSQLRequest(params: DatasetRequestBySql): void {
        promiseWithCatch(
            this.queryMicroDbTrackerService.saveQuery(AppValues.MICRO_DB_GLOBAL_QUERY_SQL, params.query).then(),
        );
        this.sqlLoading = true;
        this.sqlQueryService
            .requestDataSqlRun(params)
            .pipe(
                finalize(() => {
                    this.sqlLoading = false;
                    this.cdr.detectChanges();
                }),
                takeUntil(this.visibilityDocumentChange$.pipe(filter(() => document.visibilityState === "hidden"))),
                takeUntil(this.cancelRequestService.cancelRequestObservable),
                takeUntilDestroyed(this.destroyRef),
            )
            .subscribe(() => {
                if (params.query !== this.sqlQueryFromUrl) {
                    this.queryOfOwnRun = params.query;
                }
                this.navigationService.navigateWithSqlQuery(params.query);
            });
    }
}
