/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { NgForOf, NgIf } from "@angular/common";
import { ChangeDetectionStrategy, Component, inject, Input } from "@angular/core";
import { MatIconModule } from "@angular/material/icon";

import RoutingResolvers from "@common/resolvers/routing-resolvers";
import { FlowEventTaskChanged, FlowHistoryDataFragment, TaskStatus } from "@api/kamu.graphql.interface";

import { AppConfigService } from "src/app/app-config.service";
import { LoggedUserService } from "src/app/auth/logged-user.service";
import { DatasetFlowByIdResponse } from "src/app/dataset-flow/dataset-flow-details/dataset-flow-details.types";
import { GrafanaLogsService } from "src/app/services/grafana-logs.service";

@Component({
    selector: "app-flow-details-logs-tab",
    templateUrl: "./flow-details-logs-tab.component.html",
    styleUrls: ["./flow-details-logs-tab.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [
        //-----//
        NgIf,
        //-----//
        MatIconModule,
        NgForOf,
    ],
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

    public tasksEventById(taskId: string): FlowEventTaskChanged[] {
        return this.flowDetails.flowHistory.filter(
            (item) => item.__typename === "FlowEventTaskChanged" && item.taskId === taskId,
        ) as FlowEventTaskChanged[];
    }

    public get taskIds(): string[] {
        return this.flowDetails.flowHistory
            .filter((item) => item.__typename === "FlowEventTaskChanged" && item.taskStatus === TaskStatus.Queued)
            .map((item) => (item as FlowEventTaskChanged).taskId);
    }

    public tasksById(id: string): FlowEventTaskChanged[] {
        return this.flowDetails.flowHistory.filter(
            (item) => item.__typename === "FlowEventTaskChanged" && item.taskId === id,
        ) as FlowEventTaskChanged[];
    }

    public grafanaTaskLogsUrl(url: string, eventTask: FlowEventTaskChanged[]): string {
        return this.grafanaLogsService.buildTaskUrl(url, eventTask);
    }
}
