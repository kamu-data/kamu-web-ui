/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { ChangeDetectionStrategy, Component, inject, Input, OnInit } from "@angular/core";
import { LoggedUserService } from "src/app/auth/logged-user.service";
import { BaseComponent } from "src/app/common/components/base.component";
import { GrafanaLogsService } from "../../../../services/grafana-logs.service";
import { DatasetFlowByIdResponse, FlowDetailsTabs } from "../../dataset-flow-details.types";
import { AppConfigService } from "src/app/app-config.service";
import RoutingResolvers from "src/app/common/resolvers/routing-resolvers";
import { DatasetInfo } from "src/app/interface/navigation.interface";
import { filter, skip, tap, timer } from "rxjs";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { FlowStatus } from "src/app/api/kamu.graphql.interface";
import { NavigationService } from "src/app/services/navigation.service";

@Component({
    selector: "app-flow-details-logs-tab",
    templateUrl: "./flow-details-logs-tab.component.html",
    styleUrls: ["./flow-details-logs-tab.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FlowDetailsLogsTabComponent extends BaseComponent implements OnInit {
    @Input(RoutingResolvers.FLOW_DETAILS_LOGS_KEY) public flowDetails: DatasetFlowByIdResponse;
    @Input(RoutingResolvers.DATASET_INFO_KEY) public datasetInfo: DatasetInfo;

    private loggedUserService = inject(LoggedUserService);
    private grafanaLogsService = inject(GrafanaLogsService);
    private appConfigService = inject(AppConfigService);
    private navigationService = inject(NavigationService);

    public ngOnInit(): void {
        timer(0, 5000)
            .pipe(
                skip(1),
                filter(() => Boolean(this.flowDetails.flow.status !== FlowStatus.Finished)),
                tap(() => {
                    this.navigationService.navigateToFlowDetails({
                        ...this.datasetInfo,
                        flowId: this.flowDetails.flow.flowId,
                        tab: FlowDetailsTabs.LOGS,
                    });
                }),
                takeUntilDestroyed(this.destroyRef),
            )
            .subscribe();
    }

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
