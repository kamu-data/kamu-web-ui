/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { ChangeDetectionStrategy, Component, inject, Input } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { BaseComponent } from "src/app/common/components/base.component";
import { PollingGroupEnum, ThrottlingGroupEnum } from "../../dataset-settings.model";
import {
    DatasetBasicsFragment,
    DatasetFlowType,
    DatasetKind,
    DatasetPermissionsFragment,
    FlowTriggerInput,
    TimeUnit,
} from "src/app/api/kamu.graphql.interface";
import { DatasetFlowTriggerService } from "../../services/dataset-flow-trigger.service";
import { PollingGroupFormValue } from "./dataset-settings-scheduling-tab.component.types";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import RoutingResolvers from "src/app/common/resolvers/routing-resolvers";
import { DatasetViewData } from "src/app/dataset-view/dataset-view.interface";

@Component({
    selector: "app-dataset-settings-scheduling-tab",
    templateUrl: "./dataset-settings-scheduling-tab.component.html",
    styleUrls: ["./dataset-settings-scheduling-tab.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DatasetSettingsSchedulingTabComponent extends BaseComponent {
    @Input(RoutingResolvers.DATASET_SETTINGS_SCHEDULING_KEY) public schedulungTabData: DatasetViewData;
    public pollingForm: FormGroup<PollingGroupFormValue>;
    public readonly throttlingGroupEnum: typeof ThrottlingGroupEnum = ThrottlingGroupEnum;
    public readonly timeUnit: typeof TimeUnit = TimeUnit;

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

    public changePollingTriggers(pollingForm: FormGroup<PollingGroupFormValue>): void {
        this.pollingForm = pollingForm;
    }

    public saveScheduledUpdates(): void {
        this.datasetFlowTriggerService
            .setDatasetFlowTriggers({
                datasetId: this.datasetBasics.id,
                datasetFlowType: DatasetFlowType.Ingest,
                paused: !this.pollingForm.controls.updatesState.value,
                triggerInput: this.setPollingTriggerInput(this.pollingForm),
                datasetInfo: {
                    accountName: this.datasetBasics.owner.accountName,
                    datasetName: this.datasetBasics.name,
                },
            })
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe();
    }

    public get enablePollingUpdates(): boolean {
        return this.pollingForm && this.pollingForm.controls.updatesState.value;
    }

    public get disabledSaveButton(): boolean {
        return (
            (this.pollingForm && this.pollingForm?.invalid) ||
            (!this.pollingForm?.get("updatesState")?.value &&
                !this.pollingForm?.get("every")?.value &&
                this.pollingForm?.get("__typename")?.value === PollingGroupEnum.TIME_DELTA)
        );
    }

    private setPollingTriggerInput(pollingForm: FormGroup<PollingGroupFormValue>): FlowTriggerInput {
        if (pollingForm.controls.__typename.value === PollingGroupEnum.TIME_DELTA) {
            return {
                schedule: {
                    timeDelta: {
                        every: pollingForm.controls.every.value as number,
                        unit: pollingForm.controls.unit.value as TimeUnit,
                    },
                },
            };
        } else {
            return {
                schedule: {
                    // sync with server validator
                    cron5ComponentExpression: pollingForm.controls.cronExpression.value as string,
                },
            };
        }
    }
}
