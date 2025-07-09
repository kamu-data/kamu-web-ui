/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, Input } from "@angular/core";
import { FormGroup, FormsModule, ReactiveFormsModule } from "@angular/forms";
import { BaseComponent } from "src/app/common/components/base.component";
import { ScheduleType } from "../../dataset-settings.model";
import {
    DatasetBasicsFragment,
    DatasetFlowType,
    DatasetKind,
    FlowTriggerInput,
} from "src/app/api/kamu.graphql.interface";
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
import {
    SchedulingSettingsFormType,
    SchedulingSettingsFormValue,
} from "./dataset-settings-scheduling-tab.component.types";

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
        MatProgressBarModule,
        MatDividerModule,

        //-----//
        IngestTriggerFormComponent,
    ],
})
export class DatasetSettingsSchedulingTabComponent extends BaseComponent implements AfterViewInit {
    @Input(RoutingResolvers.DATASET_SETTINGS_SCHEDULING_KEY)
    public schedulingTabData: DatasetSettingsSchedulingTabData;

    private readonly cdr = inject(ChangeDetectorRef);
    private readonly datasetFlowTriggerService = inject(DatasetFlowTriggerService);

    public readonly form: FormGroup<SchedulingSettingsFormType> = new FormGroup<SchedulingSettingsFormType>({
        ingestTrigger: IngestTriggerFormComponent.buildForm(),
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
                ingestTrigger: this.buildInitialIngestTriggerFormValue(),
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

        const updatesEnabled = !this.schedulingTabData.paused;
        switch (schedule.__typename) {
            case "TimeDelta": {
                return {
                    updatesEnabled,
                    __typename: ScheduleType.TIME_DELTA,
                    timeDelta: {
                        every: schedule.every,
                        unit: schedule.unit,
                    },
                    cron: null,
                } as IngestTriggerFormValue;
            }

            case "Cron5ComponentExpression": {
                return {
                    updatesEnabled,
                    __typename: ScheduleType.CRON_5_COMPONENT_EXPRESSION,
                    timeDelta: null,
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

    public saveScheduledUpdates(): void {
        const formValue = this.form.getRawValue() as SchedulingSettingsFormValue;
        const ingestTriggerFormValue = formValue.ingestTrigger;

        this.datasetFlowTriggerService
            .setDatasetFlowTriggers({
                datasetId: this.datasetBasics.id,
                datasetFlowType: DatasetFlowType.Ingest,
                paused: !ingestTriggerFormValue.updatesEnabled,
                triggerInput: this.buildPollingTriggerInput(ingestTriggerFormValue),
                datasetInfo: {
                    accountName: this.datasetBasics.owner.accountName,
                    datasetName: this.datasetBasics.name,
                },
            })
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe();
    }

    private buildPollingTriggerInput(ingestTriggerFormValue: IngestTriggerFormValue): FlowTriggerInput {
        switch (ingestTriggerFormValue.__typename) {
            case ScheduleType.TIME_DELTA: {
                const timeDeltaValue = ingestTriggerFormValue.timeDelta;
                // istanbul ignore next
                if (!timeDeltaValue || !timeDeltaValue.every || !timeDeltaValue.unit) {
                    throw new Error("Time delta value is not valid");
                }
                return {
                    schedule: {
                        timeDelta: {
                            every: timeDeltaValue.every,
                            unit: timeDeltaValue.unit,
                        },
                    },
                };
            }

            case ScheduleType.CRON_5_COMPONENT_EXPRESSION: {
                const cronValue = ingestTriggerFormValue.cron;
                // istanbul ignore next
                if (!cronValue || !cronValue.cronExpression) {
                    throw new Error("Cron expression value is not valid");
                }
                return {
                    schedule: {
                        // sync with server validator
                        cron5ComponentExpression: cronValue.cronExpression,
                    },
                };
            }

            /* istanbul ignore next */
            default:
                throw new Error(`Unknown schedule type`);
        }
    }
}
