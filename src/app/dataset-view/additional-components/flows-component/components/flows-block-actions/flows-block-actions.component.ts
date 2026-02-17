/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { MatIconModule } from "@angular/material/icon";

import {
    DatasetBasicsFragment,
    DatasetFlowProcess,
    DatasetKind,
    FlowProcessEffectiveState,
} from "@api/kamu.graphql.interface";
import { BaseComponent } from "@common/components/base.component";
import AppValues from "@common/values/app.values";
import { SettingsTabsEnum } from "src/app/dataset-view/additional-components/dataset-settings-component/dataset-settings.model";
import { DatasetViewTypeEnum } from "src/app/dataset-view/dataset-view.interface";

@Component({
    selector: "app-flows-block-actions",
    imports: [
        //-----//
        FormsModule,
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

    @Output() public refreshEmitter: EventEmitter<void> = new EventEmitter<void>();

    public readonly DatasetViewTypeEnum: typeof DatasetViewTypeEnum = DatasetViewTypeEnum;

    public readonly FlowProcessEffectiveState: typeof FlowProcessEffectiveState = FlowProcessEffectiveState;
    public readonly TIMEOUT_REFRESH_FLOW = AppValues.TIMEOUT_REFRESH_FLOW_MS;

    public refreshFlow(): void {
        this.refreshEmitter.emit();
    }

    public get redirectSection(): SettingsTabsEnum {
        return this.datasetBasics.kind === DatasetKind.Root
            ? SettingsTabsEnum.SCHEDULING
            : SettingsTabsEnum.TRANSFORM_SETTINGS;
    }
}
