/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    EventEmitter,
    inject,
    Input,
    Output,
} from "@angular/core";
import { NgIf } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { MatIconModule } from "@angular/material/icon";
import { RouterLink } from "@angular/router";
import { DatasetKind, FlowProcessEffectiveState } from "src/app/api/kamu.graphql.interface";
import { DatasetOverviewTabData, DatasetViewTypeEnum } from "src/app/dataset-view/dataset-view.interface";
import { Observable, of, take } from "rxjs";
import { DatasetFlowsService } from "../../services/dataset-flows.service";
import { BaseComponent } from "src/app/common/components/base.component";
import { promiseWithCatch } from "src/app/common/helpers/app.helpers";
import { ModalService } from "src/app/common/components/modal/modal.service";
import { SettingsTabsEnum } from "../../../dataset-settings-component/dataset-settings.model";
import AppValues from "src/app/common/values/app.values";
import { DatasetFlowsTabState } from "../../flows.helpers";

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
    @Input({ required: true }) public flowConnectionData: DatasetFlowsTabState;
    @Input({ required: true }) public flowsData: DatasetOverviewTabData;
    @Output() public updateEmitter: EventEmitter<void> = new EventEmitter<void>();
    @Output() public refreshEmitter: EventEmitter<void> = new EventEmitter<void>();
    public readonly DatasetViewTypeEnum: typeof DatasetViewTypeEnum = DatasetViewTypeEnum;

    private flowsService = inject(DatasetFlowsService);
    private cdr = inject(ChangeDetectorRef);
    private modalService = inject(ModalService);

    public readonly FlowProcessEffectiveState: typeof FlowProcessEffectiveState = FlowProcessEffectiveState;
    public readonly TIMEOUT_REFRESH_FLOW = AppValues.TIMEOUT_REFRESH_FLOW_MS;

    public get hasPushSources(): boolean {
        return Boolean(this.flowsData.overviewUpdate.overview.metadata.currentPushSources.length);
    }

    public get showUpdateNowButton(): boolean {
        return !this.hasPushSources;
    }

    public get showPauseOrResumeButton(): boolean {
        return (
            !this.hasPushSources &&
            this.flowConnectionData?.flowProcesses?.primary.summary.effectiveState !==
                FlowProcessEffectiveState.Unconfigured
        );
    }

    public updateNow(): void {
        this.updateEmitter.emit();
    }

    public refreshFlow(): void {
        this.refreshEmitter.emit();
    }

    public get redirectSection(): SettingsTabsEnum {
        return this.flowsData.datasetBasics.kind === DatasetKind.Root
            ? SettingsTabsEnum.SCHEDULING
            : SettingsTabsEnum.TRANSFORM_SETTINGS;
    }

    public toggleStateDatasetFlowConfigs(state: FlowProcessEffectiveState): void {
        let operation$: Observable<void> = of();
        if (state === FlowProcessEffectiveState.Active) {
            operation$ = this.flowsService.datasetPauseFlows({
                datasetId: this.flowsData.datasetBasics.id,
            });
        } else if (state === FlowProcessEffectiveState.StoppedAuto) {
            promiseWithCatch(
                this.modalService.error({
                    title: "Resume updates",
                    message: "Have you confirmed that all issues have been resolved?",
                    yesButtonText: "Ok",
                    noButtonText: "Cancel",
                    handler: (ok) => {
                        if (ok) {
                            this.flowsService
                                .datasetResumeFlows({
                                    datasetId: this.flowsData.datasetBasics.id,
                                })
                                .pipe(take(1))
                                .subscribe(() => {
                                    setTimeout(() => {
                                        this.refreshFlow();
                                        this.cdr.detectChanges();
                                    }, this.TIMEOUT_REFRESH_FLOW);
                                });
                        }
                    },
                }),
            );
        } else {
            operation$ = this.flowsService.datasetResumeFlows({
                datasetId: this.flowsData.datasetBasics.id,
            });
        }

        operation$.pipe(take(1)).subscribe(() => {
            setTimeout(() => {
                this.refreshFlow();
                this.cdr.detectChanges();
            }, this.TIMEOUT_REFRESH_FLOW);
        });
    }
}
