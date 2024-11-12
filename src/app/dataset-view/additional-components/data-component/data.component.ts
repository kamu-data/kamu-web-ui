import { ChangeDetectionStrategy, Component, EventEmitter, inject, Input, OnInit, Output } from "@angular/core";
import { Location } from "@angular/common";
import { Observable } from "rxjs";
import AppValues from "src/app/common/app.values";
import DataTabValues from "./mock.data";
import { OffsetInterval } from "../../../api/kamu.graphql.interface";
import { OverviewUpdate } from "src/app/dataset-view/dataset.subscriptions.interface";
import { DatasetRequestBySql } from "../../../interface/dataset.interface";
import { DatasetSubscriptionsService } from "../../dataset.subscriptions.service";
import { BaseComponent } from "src/app/common/base.component";
import { DatasetBasicsFragment } from "src/app/api/kamu.graphql.interface";
import { MaybeNull } from "src/app/common/app.types";
import ProjectLinks from "src/app/project-links";

@Component({
    selector: "app-data",
    templateUrl: "./data.component.html",
    styleUrls: ["./data.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DataComponent extends BaseComponent implements OnInit {
    @Input({ required: true }) public datasetBasics: DatasetBasicsFragment;
    @Input({ required: true }) public sqlLoading: boolean;
    @Input() public resultTime: number;
    @Output() public runSQLRequestEmit = new EventEmitter<DatasetRequestBySql>();

    public savedQueries = DataTabValues.savedQueries;
    public sqlRequestCode = `select\n  *\nfrom `;

    private offsetColumnName = AppValues.DEFAULT_OFFSET_COLUMN_NAME;
    public overviewUpdate$: Observable<OverviewUpdate>;

    private datasetSubsService = inject(DatasetSubscriptionsService);
    private location = inject(Location);

    public ngOnInit(): void {
        this.overviewUpdate$ = this.datasetSubsService.overviewChanges;

        this.buildSqlRequestCode();
        this.runSQLRequest({ query: this.sqlRequestCode });
    }

    public runSQLRequest(params: DatasetRequestBySql): void {
        this.runSQLRequestEmit.emit(params);
    }

    private buildSqlRequestCode(): void {
        const sqlQueryFromUrl = this.activatedRoute.snapshot.queryParamMap.get(ProjectLinks.URL_QUERY_PARAM_SQL_QUERY);
        if (sqlQueryFromUrl) {
            this.sqlRequestCode = sqlQueryFromUrl;
        } else {
            this.sqlRequestCode += `'${this.datasetBasics.alias}'`;
            const offset = this.location.getState() as MaybeNull<Partial<OffsetInterval>>;
            if (offset && typeof offset.start !== "undefined" && typeof offset.end !== "undefined") {
                this.sqlRequestCode += `\nwhere ${this.offsetColumnName}>=${offset.start} and ${this.offsetColumnName}<=${offset.end}\norder by ${this.offsetColumnName} desc`;
            }
        }
    }
}
