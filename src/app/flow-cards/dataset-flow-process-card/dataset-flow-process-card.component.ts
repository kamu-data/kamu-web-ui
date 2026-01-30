/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { ChangeDetectionStrategy, Component, Input, Output } from "@angular/core";
import { NgClass } from "@angular/common";
import {
    DatasetBasicsFragment,
    DatasetKind,
    FlowProcessEffectiveState,
    FlowProcessSummary,
} from "src/app/api/kamu.graphql.interface";
import { MatIconModule } from "@angular/material/icon";
import { RouterLink } from "@angular/router";
import {
    DatasetFlowsBadgeStyle,
    DatasetFlowBadgeHelpers,
    DatasetFlowsBadgeTexts,
    webhooksStateMapper,
} from "src/app/dataset-view/additional-components/flows-component/flows.helpers";
import { DatasetViewTypeEnum } from "src/app/dataset-view/dataset-view.interface";
import { EventEmitter } from "@angular/core";
import { SettingsTabsEnum } from "src/app/dataset-view/additional-components/dataset-settings-component/dataset-settings.model";
import { NgIf } from "@angular/common";
@Component({
    selector: "app-dataset-flow-process-card",
    imports: [
        //-----//
        NgIf,
        NgClass,
        RouterLink,
        //-----//
        MatIconModule,
        //-----//
    ],
    templateUrl: "./dataset-flow-process-card.component.html",
    styleUrls: ["./dataset-flow-process-card.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DatasetFlowProcessCardComponent {
    @Input({ required: true }) public datasetBasics: DatasetBasicsFragment;
    @Input({ required: true }) public summary: FlowProcessSummary;
    @Input() public showFlowsHistoryLink = false;
    @Output() public updateNowEmitter = new EventEmitter<DatasetBasicsFragment>();
    @Output() public toggleStateDatasetCardEmitter = new EventEmitter<{
        state: FlowProcessEffectiveState;
        datasetBasics: DatasetBasicsFragment;
    }>();

    public readonly FlowProcessEffectiveState: typeof FlowProcessEffectiveState = FlowProcessEffectiveState;
    public readonly DatasetViewTypeEnum: typeof DatasetViewTypeEnum = DatasetViewTypeEnum;

    public badgeStyles(effectiveState: FlowProcessEffectiveState): DatasetFlowsBadgeStyle {
        return DatasetFlowBadgeHelpers.badgeStyles(effectiveState);
    }

    public badgeMessages(datasetKind: DatasetKind, summary: FlowProcessSummary): DatasetFlowsBadgeTexts {
        const isRoot = datasetKind === DatasetKind.Root;
        return DatasetFlowBadgeHelpers.badgeMessages(summary, isRoot);
    }

    public get pauseableStates(): FlowProcessEffectiveState[] {
        return [FlowProcessEffectiveState.Active, FlowProcessEffectiveState.Failing];
    }

    public redirectSection(datasetKind: DatasetKind): SettingsTabsEnum {
        return datasetKind === DatasetKind.Root ? SettingsTabsEnum.SCHEDULING : SettingsTabsEnum.TRANSFORM_SETTINGS;
    }

    public flowProcessEffectiveStateMapper(state: FlowProcessEffectiveState): string {
        return webhooksStateMapper[state];
    }

    public updateNow(datasetBasics: DatasetBasicsFragment): void {
        this.updateNowEmitter.emit(datasetBasics);
    }

    public toggleStateDatasetCard(state: FlowProcessEffectiveState, datasetBasics: DatasetBasicsFragment): void {
        this.toggleStateDatasetCardEmitter.emit({
            state,
            datasetBasics,
        });
    }
}
