/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { ChangeDetectionStrategy, Component, Input } from "@angular/core";
import {
    DashboardFiltersOptions,
    ProcessFilterStateOption,
} from "src/app/account/additional-components/account-flows-tab/account-flows-tab.types";
import { FormsModule } from "@angular/forms";
import { NgSelectModule } from "@ng-select/ng-select";

@Component({
    selector: "app-flow-process-status-list",
    imports: [
        //-----//
        FormsModule,
        //-----//
        NgSelectModule,
    ],
    templateUrl: "./flow-process-status-list.component.html",
    styleUrls: ["./flow-process-status-list.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FlowProcessStatusListComponent {
    @Input({ required: true }) public options: ProcessFilterStateOption[];
    @Input({ required: true }) public filters: DashboardFiltersOptions;
}
