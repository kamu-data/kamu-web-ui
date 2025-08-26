/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, Input } from "@angular/core";
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from "@angular/forms";
import { BaseComponent } from "src/app/common/components/base.component";
import { ScheduleType, FlowStopPolicyType } from "../../dataset-settings.model";
import { DatasetBasicsFragment, DatasetFlowType, DatasetKind } from "src/app/api/kamu.graphql.interface";
import { DatasetFlowTriggerService } from "../../services/dataset-flow-trigger.service";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import RoutingResolvers from "src/app/common/resolvers/routing-resolvers";
import { IngestTriggerFormComponent } from "./ingest-trigger-form/ingest-trigger-form.component";
import { NgIf } from "@angular/common";
import { MatDividerModule } from "@angular/material/divider";
import { MaybeNull } from "src/app/interface/app.types";
import { IngestTriggerFormValue } from "./ingest-trigger-form/ingest-trigger-form.types";
import { MatProgressBarModule } from "@angular/material/progress-bar";
import { DatasetSettingsSchedulingTabData } from "./dataset-settings-scheduling-tab.data";
import { SchedulingSettingsFormType, SchedulingSettingsFormValue } from "./dataset-settings-scheduling-tab.types";
import { FlowStopPolicyFormComponent } from "../shared/flow-stop-policy-form/flow-stop-policy-form.component";
import { FlowStopPolicyFormValue } from "../shared/flow-stop-policy-form/flow-stop-policy-form.types";
import { FlowTooltipsTexts } from "src/app/common/tooltips/flow-tooltips.text";
import { TooltipIconComponent } from "src/app/common/components/tooltip-icon/tooltip-icon.component";
import { MatSlideToggleModule } from "@angular/material/slide-toggle";

@Component({
    selector: "app-dataset-settings-scheduling-tab",
    templateUrl: "./dataset-settings-scheduling-tab.component.html",
    styleUrls: ["./dataset-settings-scheduling-tab.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [
        //-----//
        NgIf,
        FormsModule,
        ReactiveFormsModule,

        //-----//
        MatSlideToggleModule,
        MatProgressBarModule,
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
                    stopPolicyType: FlowStopPolicyType.NEVER,
                    maxFailures: FlowStopPolicyFormComponent.DEFAULT_MAX_FAILURES,
                };

            case "FlowTriggerStopPolicyAfterConsecutiveFailures":
                return {
                    stopPolicyType: FlowStopPolicyType.AFTER_CONSECUTIVE_FAILURES,
                    maxFailures: stopPolicy.maxFailures,
                };

            /* istanbul ignore next */
            default: {
                throw new Error(`Unknown stop policy type: ${stopPolicy.__typename}`);
            }
        }
    }

    public saveScheduledUpdates(): void {
        const formValue = this.form.getRawValue() as SchedulingSettingsFormValue;
        const ingestTriggerFormValue = formValue.ingestTrigger;

        this.datasetFlowTriggerService
            .setDatasetFlowTriggers({
                datasetId: this.datasetBasics.id,
                datasetFlowType: DatasetFlowType.Ingest,
                paused: !formValue.updatesEnabled,
                triggerRuleInput: IngestTriggerFormComponent.buildPollingTriggerRuleInput(ingestTriggerFormValue),
                triggerStopPolicyInput: FlowStopPolicyFormComponent.buildStopPolicyInput(formValue.stopPolicy),
                datasetInfo: {
                    accountName: this.datasetBasics.owner.accountName,
                    datasetName: this.datasetBasics.name,
                },
            })
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe();
    }
}
