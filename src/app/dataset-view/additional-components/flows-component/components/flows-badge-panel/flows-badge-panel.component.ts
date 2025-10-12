/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { ChangeDetectionStrategy, Component, Input } from "@angular/core";
import { NgClass, NgIf } from "@angular/common";
import {
    AccountFragment,
    DatasetFlowProcess,
    DatasetFlowProcesses,
    DatasetKind,
} from "src/app/api/kamu.graphql.interface";
import { DatasetFlowsBadgeStyle, DatasetFlowBadgeHelpers, DatasetFlowsBadgeTexts } from "../../flows.helpers";
import { FlowsTableData } from "src/app/dataset-flow/flows-table/flows-table.types";
import { MatIconModule } from "@angular/material/icon";

@Component({
    selector: "app-flows-badge-panel",
    standalone: true,
    imports: [
        //-----//
        NgClass,
        NgIf,

        //-----//
        MatIconModule,
    ],
    templateUrl: "./flows-badge-panel.component.html",
    styleUrls: ["./flows-badge-panel.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FlowsBadgePanelComponent {
    @Input({ required: true }) public datasetKind: DatasetKind;
    @Input({ required: true }) public flowConnectionData: {
        flowsData: FlowsTableData;
        flowInitiators: AccountFragment[];
        flowProcesses?: DatasetFlowProcesses;
    };

    public get isRoot(): boolean {
        return this.datasetKind === DatasetKind.Root;
    }

    public badgeStyles(element: DatasetFlowProcess): DatasetFlowsBadgeStyle {
        return DatasetFlowBadgeHelpers.badgeStyles(element);
    }

    public badgeMessages(element: DatasetFlowProcess, isRoot: boolean): DatasetFlowsBadgeTexts {
        return DatasetFlowBadgeHelpers.badgeMessages(element, isRoot);
    }
}
