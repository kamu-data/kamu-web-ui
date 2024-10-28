import { ChangeDetectionStrategy, Component, inject, Input } from "@angular/core";
import { BaseComponent } from "src/app/common/base.component";
import { GrafanaLogsService } from "../../grafana-logs.service";
import { DatasetFlowByIdResponse } from "../../dataset-flow-details.types";
import { AppConfigService } from "src/app/app-config.service";

@Component({
    selector: "app-flow-details-logs-tab",
    templateUrl: "./flow-details-logs-tab.component.html",
    styleUrls: ["./flow-details-logs-tab.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FlowDetailsLogsTabComponent extends BaseComponent {
    @Input({ required: true }) flowDetails: DatasetFlowByIdResponse;
    private grafanaLogsService = inject(GrafanaLogsService);
    private appConfigService = inject(AppConfigService);

    public get grafanaTaskDetailsURL(): string {
        return this.appConfigService.grafanaLogs?.taskDetailsUrl ?? "";
    }

    public get isAdmin(): boolean {
        return this.loggedUserService.isAdmin;
    }

    public grafanaTaskLogsUrl(url: string): string {
        return this.grafanaLogsService.buildTaskUrl(url, this.flowDetails);
    }
}
