import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, OnInit } from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { finalize, map, Observable } from "rxjs";
import { MaybeNull } from "src/app/common/app.types";
import { BaseComponent } from "src/app/common/base.component";
import { DataSqlErrorUpdate } from "src/app/dataset-view/dataset.subscriptions.interface";
import { DatasetRequestBySql } from "src/app/interface/dataset.interface";
import ProjectLinks from "src/app/project-links";
import { SqlQueryService } from "src/app/services/sql-query.service";
import { SqlQueryResponseState } from "./global-query.model";

@Component({
    selector: "app-global-query",
    templateUrl: "./global-query.component.html",
    styleUrls: ["./global-query.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GlobalQueryComponent extends BaseComponent implements OnInit {
    public sqlRequestCode = "";
    public sqlLoading = false;
    public sqlErrorMarker$: Observable<string>;
    public sqlQueryResponse$: Observable<MaybeNull<SqlQueryResponseState>>;

    private sqlQueryService = inject(SqlQueryService);
    private cdr = inject(ChangeDetectorRef);

    ngOnInit(): void {
        this.initSqlQueryFromUrl();
        this.sqlQueryService.resetSqlError();
        this.sqlQueryService.emitSqlQueryResponseChanged(null);
        this.sqlErrorMarker$ = this.sqlQueryService.sqlErrorOccurrences.pipe(
            map((data: DataSqlErrorUpdate) => data.error),
        );
        this.sqlQueryResponse$ = this.sqlQueryService.sqlQueryResponseChanges;
    }

    private initSqlQueryFromUrl(): void {
        const sqlQueryFromUrl = this.activatedRoute.snapshot.queryParamMap.get(ProjectLinks.URL_QUERY_PARAM_SQL_QUERY);
        if (sqlQueryFromUrl) {
            this.sqlRequestCode = sqlQueryFromUrl;
        }
    }

    public runSQLRequest(params: DatasetRequestBySql): void {
        this.sqlLoading = true;
        this.sqlQueryService
            .requestDataSqlRun(params)
            .pipe(
                finalize(() => {
                    this.sqlLoading = false;
                }),
                takeUntilDestroyed(this.destroyRef),
            )
            .subscribe();
        this.cdr.detectChanges();
    }
}
