import { NavigationService } from "./../../../../../services/navigation.service";
import { ChangeDetectionStrategy, Component, Input, OnInit } from "@angular/core";
import { AbstractControl, FormBuilder, Validators } from "@angular/forms";
import { RxwebValidators } from "@rxweb/reactive-form-validators";
import { CompactionConditionInput, DatasetBasicsFragment, DatasetFlowType } from "src/app/api/kamu.graphql.interface";
import { logError, promiseWithCatch } from "src/app/common/app.helpers";
import { CompactionTooltipsTexts } from "src/app/common/tooltips/compacting.text";
import { ModalService } from "src/app/components/modal/modal.service";
import { CompactionMode, SliceUnit, sliceSizeMapper } from "./dataset-settings-compacting-tab.types";
import { DatasetCompactionService } from "../../services/dataset-compaction.service";
import { DatasetViewTypeEnum } from "src/app/dataset-view/dataset-view.interface";
import AppValues from "src/app/common/app.values";
import { BaseComponent } from "src/app/common/base.component";

@Component({
    selector: "app-dataset-settings-compacting-tab",
    templateUrl: "./dataset-settings-compacting-tab.component.html",
    styleUrls: ["./dataset-settings-compacting-tab.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DatasetSettingsCompactingTabComponent extends BaseComponent implements OnInit {
    @Input() public datasetBasics: DatasetBasicsFragment;
    public hardCompactionForm = this.fb.group({
        mode: [CompactionMode.FULL, [Validators.required]],
        sliceUnit: [SliceUnit.MB, [Validators.required]],
        sliceSize: [300, [Validators.required, RxwebValidators.minNumber({ value: 1 })]],
        recordsCount: [10000, [Validators.required, RxwebValidators.minNumber({ value: 1 })]],
        recursive: [{ value: true, disabled: true }],
    });
    public readonly SliceUnit: typeof SliceUnit = SliceUnit;
    public readonly MAX_SLICE_SIZE_TOOLTIP = CompactionTooltipsTexts.MAX_SLICE_SIZE;
    public readonly MAX_SLICE_RECORDS_TOOLTIP = CompactionTooltipsTexts.MAX_SLICE_RECORDS;
    public readonly MIN_VALUE_ERROR_TEXT = "The value must be positive";
    public readonly CompactionMode: typeof CompactionMode = CompactionMode;

    constructor(
        public modalService: ModalService,
        private fb: FormBuilder,
        private datasetCompactionService: DatasetCompactionService,
        private navigationService: NavigationService,
    ) {
        super();
    }

    ngOnInit(): void {
        this.hardCompactionModeChanges();
    }

    public get hardCompactionMode(): AbstractControl {
        return this.hardCompactionForm.controls.mode;
    }

    public get recursive(): AbstractControl {
        return this.hardCompactionForm.controls.recursive;
    }

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

    public get sliceSizeControl(): AbstractControl {
        return this.hardCompactionForm.controls.sliceSize;
    }

    public get recordsCountControl(): AbstractControl {
        return this.hardCompactionForm.controls.recordsCount;
    }

    private hardCompactionModeChanges(): void {
        this.trackSubscription(
            this.hardCompactionMode.valueChanges.subscribe((value: CompactionMode) => {
                switch (value) {
                    case CompactionMode.FULL: {
                        this.disableAndClearControl(this.recursive);
                        this.sliceUnit.enable();
                        this.recordsCount.enable();
                        this.sliceSize.enable();
                        break;
                    }
                    case CompactionMode.METADATA_ONLY: {
                        this.recursive.enable();
                        this.disableAndClearControl(this.sliceUnit);
                        this.disableAndClearControl(this.recordsCount);
                        this.disableAndClearControl(this.sliceSize);
                        break;
                    }
                    default: {
                        logError("Unknown CompactionMode key");
                    }
                }
            }),
        );
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
                        this.trackSubscription(
                            this.datasetCompactionService
                                .runHardCompaction({
                                    datasetId: this.datasetBasics.id,
                                    datasetFlowType: DatasetFlowType.HardCompaction,
                                    compactionArgs: this.setCompactionArgs(
                                        this.hardCompactionMode.value as CompactionMode,
                                    ),
                                })
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
                                }),
                        );
                    }
                },
            }),
        );
    }

    private disableAndClearControl(control: AbstractControl): void {
        control.disable();
        control.markAsUntouched();
        control.markAsPristine();
    }

    private setCompactionArgs(mode: CompactionMode): CompactionConditionInput {
        switch (mode) {
            case CompactionMode.FULL:
                return {
                    full: {
                        maxSliceSize: this.sliceSizeInBytes,
                        maxSliceRecords: this.hardCompactionForm.controls.recordsCount.value as number,
                    },
                };
            case CompactionMode.METADATA_ONLY:
                return {
                    metadataOnly: {
                        recursive: this.recursive.value as boolean,
                    },
                };
        }
    }
}
