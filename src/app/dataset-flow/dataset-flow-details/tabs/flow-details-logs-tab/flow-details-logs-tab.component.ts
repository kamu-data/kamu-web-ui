import { ChangeDetectionStrategy, Component, inject, Input } from "@angular/core";
import { LoggedUserService } from "src/app/auth/logged-user.service";
import { BaseComponent } from "src/app/common/base.component";
import { GrafanaLogsService } from "../../grafana-logs.service";
import { DatasetFlowByIdResponse } from "../../dataset-flow-details.types";

@Component({
    selector: "app-flow-details-logs-tab",
    templateUrl: "./flow-details-logs-tab.component.html",
    styleUrls: ["./flow-details-logs-tab.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FlowDetailsLogsTabComponent extends BaseComponent {
    @Input({ required: true }) flowDetails: DatasetFlowByIdResponse;
    private loggedUserService = inject(LoggedUserService);
    private grafanaLogsService = inject(GrafanaLogsService);

    // Mock URL
    public grafanaMockURL =
        "https://grafana.sha.stg.internal.kamu.dev/explore?schemaVersion=1&panes=%7B%22b_q%22%3A%7B%22datasource%22%3A%22365dd1cc-3781-43c1-86a1-a3f78c6ab420%22%2C%22queries%22%3A%5B%7B%22refId%22%3A%22A%22%2C%22expr%22%3A%22%7Bjob%3D%5C%22demo%2Fkamu-api-server%5C%22%7D+%7C+json+root_span%2C+task_id%3D%5C%22log.spans%5B0%5D.task_id%5C%22+%7C+task_id+%3D+%60{{taskId}}%60+%7C%3D+%60%60+%7C+root_span+%3D+%60run_task%60%22%2C%22queryType%22%3A%22range%22%2C%22datasource%22%3A%7B%22type%22%3A%22loki%22%2C%22uid%22%3A%22365dd1cc-3781-43c1-86a1-a3f78c6ab420%22%7D%2C%22editorMode%22%3A%22builder%22%7D%5D%2C%22range%22%3A%7B%22from%22%3A%22{{fromTime}}%22%2C%22to%22%3A%22{{toTime}}%22%7D%7D%7D&orgId=1";

    public get isAdmin(): boolean {
        return this.loggedUserService.isAdmin;
    }

    public grafanaTaskLogsUrl(url: string): string {
        return this.grafanaLogsService.buildTaskUrl(url, this.flowDetails);
    }
}
