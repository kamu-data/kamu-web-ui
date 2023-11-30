import { ChangeDetectionStrategy, Component, OnInit } from "@angular/core";
import { TaskDetailsTabs } from "./task-details.constants";
import { Router, ActivatedRoute, NavigationEnd } from "@angular/router";
import { MaybeUndefined } from "src/app/common/app.types";
import ProjectLinks from "src/app/project-links";
import { Observable, Subscription, combineLatest, filter, map } from "rxjs";
import { DatasetViewTypeEnum } from "src/app/dataset-view/dataset-view.interface";
import { DatasetBasicsFragment, DatasetPermissionsFragment } from "src/app/api/kamu.graphql.interface";
import { DatasetInfo } from "src/app/interface/navigation.interface";
import { BaseProcessingComponent } from "src/app/common/base.processing.component";
import { DatasetService } from "src/app/dataset-view/dataset.service";
import { DatasetSubscriptionsService } from "src/app/dataset-view/dataset.subscriptions.service";

@Component({
    selector: "app-task-details",
    templateUrl: "./task-details.component.html",
    styleUrls: ["./task-details.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TaskDetailsComponent extends BaseProcessingComponent implements OnInit {
    public readonly TaskDetailsTabs: typeof TaskDetailsTabs = TaskDetailsTabs;
    public readonly TASKS_TYPE = DatasetViewTypeEnum.Tasks;
    public activeTab: TaskDetailsTabs = TaskDetailsTabs.SUMMARY;
    private taskId = 1;

    public datasetInfo$: Observable<DatasetInfo>;
    public datasetBasics$: Observable<DatasetBasicsFragment>;
    public datasetPermissions$: Observable<DatasetPermissionsFragment>;
    public datasetViewMenuData$: Observable<{
        datasetBasics: DatasetBasicsFragment;
        datasetPermissions: DatasetPermissionsFragment;
    }>;

    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private datasetService: DatasetService,
        private datasetSubsService: DatasetSubscriptionsService,
    ) {
        super();
    }

    public get accountName(): string {
        return this.getDatasetInfoFromUrl().accountName;
    }

    public get datasetName(): string {
        return this.getDatasetInfoFromUrl().datasetName;
    }

    ngOnInit(): void {
        this.datasetBasics$ = this.datasetService.datasetChanges;
        this.datasetPermissions$ = this.datasetSubsService.permissionsChanges;
        this.datasetViewMenuData$ = combineLatest([this.datasetBasics$, this.datasetPermissions$]).pipe(
            map(([datasetBasics, datasetPermissions]) => {
                return { datasetBasics, datasetPermissions };
            }),
        );
        this.datasetInfo$ = this.datasetInfoFromUrlChanges;
        this.trackSubscription(
            this.router.events.pipe(filter((event) => event instanceof NavigationEnd)).subscribe(() => {
                this.extractActiveTabFromRoute();
            }),
        );
        this.extractActiveTabFromRoute();
        this.trackSubscriptions(this.loadDatasetBasicDataWithPermissions());
    }

    public getRouteLink(tab: TaskDetailsTabs): string {
        return `/${this.accountName}/${this.datasetName}/${ProjectLinks.URL_TASK_DETAILS}/${this.taskId}/${tab}`;
    }

    private extractActiveTabFromRoute(): void {
        const categoryParam: MaybeUndefined<string> = this.route.snapshot.params[
            ProjectLinks.URL_PARAM_CATEGORY
        ] as MaybeUndefined<string>;

        if (categoryParam) {
            const category = categoryParam as TaskDetailsTabs;
            if (Object.values(TaskDetailsTabs).includes(category)) {
                this.activeTab = category;
                return;
            }
        }

        this.activeTab = TaskDetailsTabs.SUMMARY;
    }

    private loadDatasetBasicDataWithPermissions(): Subscription {
        return this.datasetService.requestDatasetBasicDataWithPermissions(this.getDatasetInfoFromUrl()).subscribe();
    }
}
