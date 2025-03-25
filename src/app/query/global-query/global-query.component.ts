/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, Input, NgZone, OnInit } from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { finalize, map, Observable } from "rxjs";
import { MaybeNull } from "src/app/interface/app.types";
import { BaseComponent } from "src/app/common/components/base.component";
import { DataSqlErrorUpdate } from "src/app/dataset-view/dataset.subscriptions.interface";
import { DatasetRequestBySql } from "src/app/interface/dataset.interface";
import ProjectLinks from "src/app/project-links";
import { SqlQueryService } from "src/app/services/sql-query.service";
import { SqlQueryResponseState } from "./global-query.model";
import { NavigationService } from "src/app/services/navigation.service";

@Component({
    selector: "app-global-query",
    templateUrl: "./global-query.component.html",
    styleUrls: ["./global-query.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GlobalQueryComponent extends BaseComponent implements OnInit {
    @Input(ProjectLinks.URL_QUERY_PARAM_SQL_QUERY) public set sqlQuery(value: string) {
        this.sqlRequestCode = value ?? "";
    }
    public sqlRequestCode = "";
    public sqlLoading = false;
    public sqlErrorMarker$: Observable<string>;
    public sqlQueryResponse$: Observable<MaybeNull<SqlQueryResponseState>>;
    public readonly MONACO_PLACEHOLDER = "Please type your guery here or find the dataset in the search...";

    private sqlQueryService = inject(SqlQueryService);
    private cdr = inject(ChangeDetectorRef);
    private ngZone = inject(NgZone);
    private navigationService = inject(NavigationService);

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
                takeUntilDestroyed(this.destroyRef),
                finalize(() => {
                    this.sqlLoading = false;
                    this.ngZone.run(() => {
                        this.navigationService.navigateWithSqlQuery(params.query);
                    });
                }),
            )
            .subscribe();
        this.cdr.detectChanges();
    }
}
