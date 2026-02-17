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

import { DataSqlErrorUpdate } from "src/app/dataset-view/dataset.subscriptions.interface";
import { EditorModule } from "src/app/editor/editor.module";
import ProjectLinks from "src/app/project-links";
import { SqlQueryBasicResponse } from "src/app/query/global-query/global-query.model";
import { SearchAndSchemasSectionComponent } from "src/app/query/global-query/search-and-schemas-section/search-and-schemas-section.component";
import { QueryAndResultSectionsComponent } from "src/app/query/shared/query-and-result-sections/query-and-result-sections.component";
import { CancelRequestService } from "src/app/services/cancel-request.service";
import { NavigationService } from "src/app/services/navigation.service";
import { SqlQueryService } from "src/app/services/sql-query.service";

import { BaseComponent } from "@common/components/base.component";
import { MaybeNull } from "@interface/app.types";
import { DatasetRequestBySql } from "@interface/dataset.interface";

@Component({
    selector: "app-global-query",
    templateUrl: "./global-query.component.html",
    styleUrls: ["./global-query.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [
        //-----//
        AsyncPipe,
        //-----//
        EditorModule,
        QueryAndResultSectionsComponent,
        SearchAndSchemasSectionComponent,
    ],
})
export class GlobalQueryComponent extends BaseComponent implements OnInit {
    @Input(ProjectLinks.URL_QUERY_PARAM_SQL_QUERY) public set sqlQuery(value: string) {
        this.sqlRequestCode = value ?? "";
    }
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

    public ngOnInit(): void {
        this.sqlQueryService.resetSqlError();
        this.sqlQueryService.emitSqlQueryResponseChanged(null);
        this.sqlErrorMarker$ = this.sqlQueryService.sqlErrorOccurrences.pipe(
            map((data: DataSqlErrorUpdate) => data.error),
        );
        this.sqlQueryResponse$ = this.sqlQueryService.sqlQueryResponseChanges;
    }

    public setDefaultQuery(sqlRequestCode: string): void {
        this.sqlRequestCode = sqlRequestCode;
    }

    public runSQLRequest(params: DatasetRequestBySql): void {
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
                this.navigationService.navigateWithSqlQuery(this.sqlRequestCode);
            });
    }
}
