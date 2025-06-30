/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { ChangeDetectionStrategy, Component, inject, Input } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { BaseComponent } from "src/app/common/components/base.component";
import { PollingGroupEnum } from "../../dataset-settings.model";
import {
    DatasetBasicsFragment,
    DatasetFlowType,
    DatasetKind,
    DatasetPermissionsFragment,
    FlowTriggerInput,
} from "src/app/api/kamu.graphql.interface";
import { DatasetFlowTriggerService } from "../../services/dataset-flow-trigger.service";
import { PollingGroupFormType } from "./dataset-settings-scheduling-tab.component.types";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import RoutingResolvers from "src/app/common/resolvers/routing-resolvers";
import { DatasetViewData } from "src/app/dataset-view/dataset-view.interface";
import { MaybeNull } from "src/app/interface/app.types";

@Component({
    selector: "app-dataset-settings-scheduling-tab",
    templateUrl: "./dataset-settings-scheduling-tab.component.html",
    styleUrls: ["./dataset-settings-scheduling-tab.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DatasetSettingsSchedulingTabComponent extends BaseComponent {
    @Input(RoutingResolvers.DATASET_SETTINGS_SCHEDULING_KEY) public schedulungTabData: DatasetViewData;

    public pollingForm: MaybeNull<FormGroup<PollingGroupFormType>> = null;

    private readonly datasetFlowTriggerService = inject(DatasetFlowTriggerService);

    public get datasetBasics(): DatasetBasicsFragment {
        return this.schedulungTabData.datasetBasics;
    }

    public get datasetPermissions(): DatasetPermissionsFragment {
        return this.schedulungTabData.datasetPermissions;
    }

    public get isRootDataset(): boolean {
        return this.datasetBasics.kind === DatasetKind.Root;
    }

    public changePollingTriggers(pollingForm: FormGroup<PollingGroupFormType>): void {
        this.pollingForm = pollingForm;
    }

    public saveScheduledUpdates(): void {
        if (!this.pollingForm) {
            return;
        }
        this.datasetFlowTriggerService
            .setDatasetFlowTriggers({
                datasetId: this.datasetBasics.id,
                datasetFlowType: DatasetFlowType.Ingest,
                paused: !this.pollingForm.controls.updatesEnabled.value,
                triggerInput: this.buildPollingTriggerInput(this.pollingForm),
                datasetInfo: {
                    accountName: this.datasetBasics.owner.accountName,
                    datasetName: this.datasetBasics.name,
                },
            })
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe();
    }

    public get disabledSaveButton(): boolean {
        return !this.pollingForm || this.pollingForm.invalid;
    }

    private buildPollingTriggerInput(pollingForm: FormGroup<PollingGroupFormType>): FlowTriggerInput {
        if (pollingForm.controls.__typename.value === PollingGroupEnum.TIME_DELTA) {
            const timeDeltaValue = pollingForm.controls.timeDelta.value;
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
        } else {
            const cronValue = pollingForm.controls.cron.value;
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
    }
}
