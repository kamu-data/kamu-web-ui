/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { ChangeDetectionStrategy, Component, inject, Input } from "@angular/core";
import { LoggedUserService } from "src/app/auth/logged-user.service";
import { GrafanaLogsService } from "../../../../services/grafana-logs.service";
import { DatasetFlowByIdResponse } from "../../dataset-flow-details.types";
import { AppConfigService } from "src/app/app-config.service";
import RoutingResolvers from "src/app/common/resolvers/routing-resolvers";
import { MatIconModule } from "@angular/material/icon";
import { NgIf } from "@angular/common";

@Component({
    selector: "app-flow-details-logs-tab",
    templateUrl: "./flow-details-logs-tab.component.html",
    styleUrls: ["./flow-details-logs-tab.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [NgIf, MatIconModule],
})
export class FlowDetailsLogsTabComponent {
    @Input(RoutingResolvers.FLOW_DETAILS_LOGS_KEY) public flowDetails: DatasetFlowByIdResponse;

    private loggedUserService = inject(LoggedUserService);
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
