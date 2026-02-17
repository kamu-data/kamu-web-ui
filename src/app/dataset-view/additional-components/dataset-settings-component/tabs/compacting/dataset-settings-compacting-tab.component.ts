/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { ChangeDetectionStrategy, Component, inject, Input } from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { AbstractControl, FormBuilder, FormsModule, ReactiveFormsModule, Validators } from "@angular/forms";
import { MatDividerModule } from "@angular/material/divider";

import { BaseComponent } from "@common/components/base.component";
import { ModalService } from "@common/components/modal/modal.service";
import { TooltipIconComponent } from "@common/components/tooltip-icon/tooltip-icon.component";
import { FormValidationErrorsDirective } from "@common/directives/form-validation-errors.directive";
import { promiseWithCatch } from "@common/helpers/app.helpers";
import RoutingResolvers from "@common/resolvers/routing-resolvers";
import { CompactionTooltipsTexts } from "@common/tooltips/compacting.text";
import AppValues from "@common/values/app.values";
import { DatasetBasicsFragment } from "@api/kamu.graphql.interface";

import {
    sliceSizeMapper,
    SliceUnit,
} from "src/app/dataset-view/additional-components/dataset-settings-component/tabs/compacting/dataset-settings-compacting-tab.types";
import { DatasetFlowsService } from "src/app/dataset-view/additional-components/flows-component/services/dataset-flows.service";
import { DatasetViewData, DatasetViewTypeEnum } from "src/app/dataset-view/dataset-view.interface";
import { NavigationService } from "src/app/services/navigation.service";

@Component({
    selector: "app-dataset-settings-compacting-tab",
    templateUrl: "./dataset-settings-compacting-tab.component.html",
    styleUrls: ["./dataset-settings-compacting-tab.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [
        //-----//
        FormsModule,
        ReactiveFormsModule,
        //-----//
        MatDividerModule,
        //-----//
        TooltipIconComponent,
        FormValidationErrorsDirective,
    ],
})
export class DatasetSettingsCompactingTabComponent extends BaseComponent {
    public modalService = inject(ModalService);
    private fb = inject(FormBuilder);
    private datasetFlowsService = inject(DatasetFlowsService);
    private navigationService = inject(NavigationService);

    @Input(RoutingResolvers.DATASET_SETTINGS_COMPACTION_KEY) public compactingTabData: DatasetViewData;
    public hardCompactionForm = this.fb.group({
        sliceUnit: [SliceUnit.MB, [Validators.required]],
        sliceSize: [300, [Validators.required, Validators.min(1)]],
        recordsCount: [10000, [Validators.required, Validators.min(1)]],
    });
    public readonly SliceUnit: typeof SliceUnit = SliceUnit;
    public readonly MAX_SLICE_SIZE_TOOLTIP = CompactionTooltipsTexts.MAX_SLICE_SIZE;
    public readonly MAX_SLICE_RECORDS_TOOLTIP = CompactionTooltipsTexts.MAX_SLICE_RECORDS;
    public readonly RECURSIVE_TOOLTIP = CompactionTooltipsTexts.HARD_COMPACTION_RECURSIVE;

    public get sliceUnit(): AbstractControl {
        return this.hardCompactionForm.controls.sliceUnit;
    }

    public get recordsCount(): AbstractControl {
        return this.hardCompactionForm.controls.recordsCount;
    }

    public get sliceSize(): AbstractControl {
        return this.hardCompactionForm.controls.sliceSize;
    }

    public get sliceSizeInBytes(): number {
        return (
            (this.hardCompactionForm.controls.sliceSize.value as number) *
            sliceSizeMapper[this.hardCompactionForm.controls.sliceUnit.value as SliceUnit]
        );
    }

    private get datasetBasics(): DatasetBasicsFragment {
        return this.compactingTabData.datasetBasics;
    }

    public onRunCompaction(): void {
        promiseWithCatch(
            this.modalService.error({
                title: "Run compaction",
                message: "Do you want to run hard compaction?",
                yesButtonText: "Ok",
                noButtonText: "Cancel",
                handler: (ok) => {
                    if (ok) {
                        this.datasetFlowsService
                            .datasetTriggerCompactionFlow({
                                datasetId: this.datasetBasics.id,
                                compactionConfigInput: {
                                    maxSliceSize: this.sliceSizeInBytes,
                                    maxSliceRecords: this.recordsCount.value as number,
                                },
                            })
                            .pipe(takeUntilDestroyed(this.destroyRef))
                            .subscribe((result: boolean) => {
                                if (result) {
                                    setTimeout(() => {
                                        this.navigationService.navigateToDatasetView({
                                            accountName: this.datasetBasics.owner.accountName,
                                            datasetName: this.datasetBasics.name,
                                            tab: DatasetViewTypeEnum.Flows,
                                        });
                                    }, AppValues.SIMULATION_START_CONDITION_DELAY_MS);
                                }
                            });
                    }
                },
            }),
        );
    }
}
