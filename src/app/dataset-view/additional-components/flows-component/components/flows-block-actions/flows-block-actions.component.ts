/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from "@angular/core";
import { NgIf } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { MatIconModule } from "@angular/material/icon";
import { RouterLink } from "@angular/router";
import {
    DatasetBasicsFragment,
    DatasetFlowProcess,
    DatasetKind,
    FlowProcessEffectiveState,
} from "src/app/api/kamu.graphql.interface";
import { DatasetViewTypeEnum } from "src/app/dataset-view/dataset-view.interface";
import { BaseComponent } from "src/app/common/components/base.component";
import { SettingsTabsEnum } from "../../../dataset-settings-component/dataset-settings.model";
import AppValues from "src/app/common/values/app.values";

@Component({
    selector: "app-flows-block-actions",
    standalone: true,
    imports: [
        //-----//
        FormsModule,
        NgIf,
        RouterLink,

        //-----//
        MatIconModule,
    ],
    templateUrl: "./flows-block-actions.component.html",
    styleUrls: ["./flows-block-actions.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FlowsBlockActionsComponent extends BaseComponent {
    @Input({ required: true }) public flowProcess: DatasetFlowProcess;
    @Input({ required: true }) public datasetBasics: DatasetBasicsFragment;
    @Input({ required: true }) public hasPushSources: boolean;
    @Output() public updateEmitter: EventEmitter<void> = new EventEmitter<void>();
    @Output() public refreshEmitter: EventEmitter<void> = new EventEmitter<void>();
    @Output() public toggleStateDatasetFlowConfigsEmitter: EventEmitter<FlowProcessEffectiveState> =
        new EventEmitter<FlowProcessEffectiveState>();
    public readonly DatasetViewTypeEnum: typeof DatasetViewTypeEnum = DatasetViewTypeEnum;

    public readonly FlowProcessEffectiveState: typeof FlowProcessEffectiveState = FlowProcessEffectiveState;
    public readonly TIMEOUT_REFRESH_FLOW = AppValues.TIMEOUT_REFRESH_FLOW_MS;

    public get showUpdateNowButton(): boolean {
        return !this.hasPushSources;
    }

    public get pauseAllowedStates(): FlowProcessEffectiveState[] {
        return [FlowProcessEffectiveState.Active, FlowProcessEffectiveState.Failing];
    }

    public get showPauseOrResumeButton(): boolean {
        return (
            !this.hasPushSources && this.flowProcess.summary.effectiveState !== FlowProcessEffectiveState.Unconfigured
        );
    }

    public updateNow(): void {
        this.updateEmitter.emit();
    }

    public refreshFlow(): void {
        this.refreshEmitter.emit();
    }

    public get redirectSection(): SettingsTabsEnum {
        return this.datasetBasics.kind === DatasetKind.Root
            ? SettingsTabsEnum.SCHEDULING
            : SettingsTabsEnum.TRANSFORM_SETTINGS;
    }

    public toggleStateDatasetFlowConfigs(state: FlowProcessEffectiveState): void {
        this.toggleStateDatasetFlowConfigsEmitter.emit(state);
    }
}
