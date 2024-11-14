import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, OnInit } from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { finalize } from "rxjs";
import { BaseComponent } from "src/app/common/base.component";
import { DatasetService } from "src/app/dataset-view/dataset.service";
import { DatasetRequestBySql } from "src/app/interface/dataset.interface";
import ProjectLinks from "src/app/project-links";

@Component({
    selector: "app-global-query",
    templateUrl: "./global-query.component.html",
    styleUrls: ["./global-query.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GlobalQueryComponent extends BaseComponent implements OnInit {
    public sqlRequestCode = "";
    public sqlLoading = false;

    private datasetService = inject(DatasetService);
    private cdr = inject(ChangeDetectorRef);

    ngOnInit(): void {
        this.initSqlQueryFromUrl();
    }

    private initSqlQueryFromUrl(): void {
        const sqlQueryFromUrl = this.activatedRoute.snapshot.queryParamMap.get(ProjectLinks.URL_QUERY_PARAM_SQL_QUERY);
        if (sqlQueryFromUrl) {
            this.sqlRequestCode = sqlQueryFromUrl;
        }
    }

    public runSQLRequest(params: DatasetRequestBySql): void {
        this.sqlLoading = true;
        this.datasetService
            .requestDatasetDataSqlRun(params)
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
