/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { NavigationService } from "./../../../../../services/navigation.service";
import { ChangeDetectionStrategy, Component, inject, Input } from "@angular/core";
import { DatasetBasicsFragment } from "src/app/api/kamu.graphql.interface";
import { AbstractControl, FormBuilder, Validators, FormsModule, ReactiveFormsModule } from "@angular/forms";
import { promiseWithCatch } from "src/app/common/helpers/app.helpers";
import { CompactionTooltipsTexts } from "src/app/common/tooltips/compacting.text";
import { ModalService } from "src/app/common/components/modal/modal.service";
import { SliceUnit, sliceSizeMapper } from "./dataset-settings-compacting-tab.types";
import { DatasetViewData, DatasetViewTypeEnum } from "src/app/dataset-view/dataset-view.interface";
import AppValues from "src/app/common/values/app.values";
import { BaseComponent } from "src/app/common/components/base.component";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import RoutingResolvers from "src/app/common/resolvers/routing-resolvers";
import { FormValidationErrorsDirective } from "../../../../../common/directives/form-validation-errors.directive";
import { TooltipIconComponent } from "../../../../../common/components/tooltip-icon/tooltip-icon.component";
import { MatDividerModule } from "@angular/material/divider";
import { DatasetFlowsService } from "../../../flows-component/services/dataset-flows.service";

@Component({
    selector: "app-dataset-settings-compacting-tab",
    templateUrl: "./dataset-settings-compacting-tab.component.html",
    styleUrls: ["./dataset-settings-compacting-tab.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
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
