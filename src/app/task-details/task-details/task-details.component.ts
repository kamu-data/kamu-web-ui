import { ChangeDetectionStrategy, Component, OnInit } from "@angular/core";
import { TaskDetailsTabs } from "./task-details.constants";
import { BaseComponent } from "src/app/common/base.component";
import { Router, ActivatedRoute, NavigationEnd } from "@angular/router";
import { MaybeUndefined } from "src/app/common/app.types";
import ProjectLinks from "src/app/project-links";
import { filter } from "rxjs";

@Component({
    selector: "app-task-details",
    templateUrl: "./task-details.component.html",
    styleUrls: ["./task-details.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TaskDetailsComponent extends BaseComponent implements OnInit {
    public readonly TaskDetailsTabs: typeof TaskDetailsTabs = TaskDetailsTabs;
    public activeTab: TaskDetailsTabs = TaskDetailsTabs.SUMMARY;
    private taskId = 1;

    constructor(private router: Router, private route: ActivatedRoute) {
        super();
    }

    public get accountName(): string {
        return this.getDatasetInfoFromUrl().accountName;
    }

    public get datasetName(): string {
        return this.getDatasetInfoFromUrl().datasetName;
    }

    ngOnInit(): void {
        this.trackSubscription(
            this.router.events.pipe(filter((event) => event instanceof NavigationEnd)).subscribe(() => {
                this.extractActiveTabFromRoute();
            }),
        );
        this.extractActiveTabFromRoute();
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
}
