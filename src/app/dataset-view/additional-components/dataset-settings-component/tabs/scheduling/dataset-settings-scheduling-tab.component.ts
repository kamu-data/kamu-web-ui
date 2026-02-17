/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { NgIf } from "@angular/common";
import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, Input } from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatDividerModule } from "@angular/material/divider";
import { MatSlideToggleModule } from "@angular/material/slide-toggle";

import {
    FlowTriggerStopPolicyType,
    ScheduleType,
} from "src/app/dataset-view/additional-components/dataset-settings-component/dataset-settings.model";
import { DatasetFlowTriggerService } from "src/app/dataset-view/additional-components/dataset-settings-component/services/dataset-flow-trigger.service";
import { DatasetSettingsSchedulingTabData } from "src/app/dataset-view/additional-components/dataset-settings-component/tabs/scheduling/dataset-settings-scheduling-tab.data";
import {
    SchedulingSettingsFormType,
    SchedulingSettingsFormValue,
} from "src/app/dataset-view/additional-components/dataset-settings-component/tabs/scheduling/dataset-settings-scheduling-tab.types";
import { IngestTriggerFormComponent } from "src/app/dataset-view/additional-components/dataset-settings-component/tabs/scheduling/ingest-trigger-form/ingest-trigger-form.component";
import { IngestTriggerFormValue } from "src/app/dataset-view/additional-components/dataset-settings-component/tabs/scheduling/ingest-trigger-form/ingest-trigger-form.types";
import { FlowStopPolicyFormComponent } from "src/app/dataset-view/additional-components/dataset-settings-component/tabs/shared/flow-stop-policy-form/flow-stop-policy-form.component";
import { FlowStopPolicyFormValue } from "src/app/dataset-view/additional-components/dataset-settings-component/tabs/shared/flow-stop-policy-form/flow-stop-policy-form.types";

import { BaseComponent } from "@common/components/base.component";
import { TooltipIconComponent } from "@common/components/tooltip-icon/tooltip-icon.component";
import RoutingResolvers from "@common/resolvers/routing-resolvers";
import { FlowTooltipsTexts } from "@common/tooltips/flow-tooltips.text";
import { DatasetBasicsFragment, DatasetFlowType, DatasetKind } from "@api/kamu.graphql.interface";
import { MaybeNull } from "@interface/app.types";

@Component({
    selector: "app-dataset-settings-scheduling-tab",
    templateUrl: "./dataset-settings-scheduling-tab.component.html",
    styleUrls: ["./dataset-settings-scheduling-tab.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [
        //-----//
        NgIf,
        FormsModule,
        ReactiveFormsModule,
        //-----//
        MatSlideToggleModule,
        MatDividerModule,
        //-----//
        IngestTriggerFormComponent,
        FlowStopPolicyFormComponent,
        TooltipIconComponent,
    ],
})
export class DatasetSettingsSchedulingTabComponent extends BaseComponent implements AfterViewInit {
    @Input(RoutingResolvers.DATASET_SETTINGS_SCHEDULING_KEY)
    public schedulingTabData: DatasetSettingsSchedulingTabData;

    private readonly cdr = inject(ChangeDetectorRef);
    private readonly datasetFlowTriggerService = inject(DatasetFlowTriggerService);

    public readonly UPDATES_TOOLTIP = FlowTooltipsTexts.UPDATE_SELECTOR_TOOLTIP;

    public readonly form: FormGroup<SchedulingSettingsFormType> = new FormGroup<SchedulingSettingsFormType>({
        updatesEnabled: new FormControl<boolean>({ value: false, disabled: false }, { nonNullable: true }),
        ingestTrigger: IngestTriggerFormComponent.buildForm(),
        stopPolicy: FlowStopPolicyFormComponent.buildForm(),
    });

    public get datasetBasics(): DatasetBasicsFragment {
        return this.schedulingTabData.datasetBasics;
    }

    public get isRootDataset(): boolean {
        return this.datasetBasics.kind === DatasetKind.Root;
    }

    public ngAfterViewInit() {
        this.form.patchValue(
            {
                updatesEnabled: this.schedulingTabData.paused === false,
                ingestTrigger: this.buildInitialIngestTriggerFormValue(),
                stopPolicy: this.buildInitialStopPolicyFormValue(),
            } as SchedulingSettingsFormValue,
            { emitEvent: true },
        );
        this.cdr.detectChanges();
    }

    private buildInitialIngestTriggerFormValue(): MaybeNull<IngestTriggerFormValue> {
        const schedule = this.schedulingTabData.schedule;

        if (!schedule) {
            return null;
        }

        switch (schedule.__typename) {
            case "TimeDelta": {
                return {
                    __typename: ScheduleType.TIME_DELTA,
                    timeDelta: {
                        every: schedule.every,
                        unit: schedule.unit,
                    },
                    cron: {
                        cronExpression: "",
                    },
                } as IngestTriggerFormValue;
            }

            case "Cron5ComponentExpression": {
                return {
                    __typename: ScheduleType.CRON_5_COMPONENT_EXPRESSION,
                    timeDelta: {
                        every: null,
                        unit: null,
                    },
                    cron: {
                        cronExpression: schedule.cron5ComponentExpression,
                    },
                } as IngestTriggerFormValue;
            }

            /* istanbul ignore next */
            default: {
                throw new Error(`Unknown schedule type: ${schedule.__typename}`);
            }
        }
    }

    private buildInitialStopPolicyFormValue(): MaybeNull<FlowStopPolicyFormValue> {
        const stopPolicy = this.schedulingTabData.stopPolicy;
        if (!stopPolicy) {
            return null;
        }

        switch (stopPolicy.__typename) {
            case "FlowTriggerStopPolicyNever":
                return {
                    stopPolicyType: FlowTriggerStopPolicyType.NEVER,
                    maxFailures: FlowStopPolicyFormComponent.DEFAULT_MAX_FAILURES,
                };

            case "FlowTriggerStopPolicyAfterConsecutiveFailures":
                return {
                    stopPolicyType: FlowTriggerStopPolicyType.AFTER_CONSECUTIVE_FAILURES,
                    maxFailures: stopPolicy.maxFailures,
                };

            /* istanbul ignore next */
            default: {
                throw new Error(`Unknown stop policy type: ${stopPolicy.__typename}`);
            }
        }
    }

    public saveUpdates(): void {
        const formValue = this.form.getRawValue() as SchedulingSettingsFormValue;
        const ingestTriggerFormValue = formValue.ingestTrigger;

        if (formValue.updatesEnabled) {
            this.datasetFlowTriggerService
                .setDatasetFlowTrigger({
                    datasetId: this.datasetBasics.id,
                    datasetFlowType: DatasetFlowType.Ingest,
                    triggerRuleInput: IngestTriggerFormComponent.buildPollingTriggerRuleInput(ingestTriggerFormValue),
                    triggerStopPolicyInput: FlowStopPolicyFormComponent.buildStopPolicyInput(formValue.stopPolicy),
                    datasetInfo: {
                        accountName: this.datasetBasics.owner.accountName,
                        datasetName: this.datasetBasics.name,
                    },
                })
                .pipe(takeUntilDestroyed(this.destroyRef))
                .subscribe();
        } else {
            this.datasetFlowTriggerService
                .pauseDatasetFlowTrigger({
                    datasetId: this.datasetBasics.id,
                    datasetFlowType: DatasetFlowType.Ingest,
                })
                .pipe(takeUntilDestroyed(this.destroyRef))
                .subscribe();
        }
    }
}
