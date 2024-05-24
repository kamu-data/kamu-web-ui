import { NavigationService } from "./../../../../../services/navigation.service";
import { ChangeDetectionStrategy, Component, Input, OnInit } from "@angular/core";
import { AbstractControl, FormBuilder, Validators } from "@angular/forms";
import { RxwebValidators } from "@rxweb/reactive-form-validators";
import { CompactingConditionInput, DatasetBasicsFragment, DatasetFlowType } from "src/app/api/kamu.graphql.interface";
import { logError, promiseWithCatch } from "src/app/common/app.helpers";
import { CompactingTooltipsTexts } from "src/app/common/tooltips/compacting.text";
import { ModalService } from "src/app/components/modal/modal.service";
import { CompactingMode, SliceUnit, sliceSizeMapper } from "./dataset-settings-compacting-tab.types";
import { DatasetCompactingService } from "../../services/dataset-compacting.service";
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
    public hardCompactingForm = this.fb.group({
        mode: [CompactingMode.FULL, [Validators.required]],
        sliceUnit: [SliceUnit.MB, [Validators.required]],
        sliceSize: [300, [Validators.required, RxwebValidators.minNumber({ value: 1 })]],
        recordsCount: [10000, [Validators.required, RxwebValidators.minNumber({ value: 1 })]],
        recursive: [{ value: true, disabled: true }],
    });
    public readonly SliceUnit: typeof SliceUnit = SliceUnit;
    public readonly MAX_SLICE_SIZE_TOOLTIP = CompactingTooltipsTexts.MAX_SLICE_SIZE;
    public readonly MAX_SLICE_RECORDS_TOOLTIP = CompactingTooltipsTexts.MAX_SLICE_RECORDS;
    public readonly MIN_VALUE_ERROR_TEXT = "The value must be positive";
    public readonly CompactingMode: typeof CompactingMode = CompactingMode;
    public compactingArgs: CompactingConditionInput;

    constructor(
        public modalService: ModalService,
        private fb: FormBuilder,
        private datasetCompactingService: DatasetCompactingService,
        private navigationService: NavigationService,
    ) {
        super();
    }

    ngOnInit(): void {
        this.hardCompactingModeChanges();
    }

    public get hardCompactingMode(): AbstractControl {
        return this.hardCompactingForm.controls.mode;
    }

    public get recursive(): AbstractControl {
        return this.hardCompactingForm.controls.recursive;
    }

    public get sliceUnit(): AbstractControl {
        return this.hardCompactingForm.controls.sliceUnit;
    }

    public get recordsCount(): AbstractControl {
        return this.hardCompactingForm.controls.recordsCount;
    }

    public get sliceSize(): AbstractControl {
        return this.hardCompactingForm.controls.sliceSize;
    }

    public get sliceSizeInBytes(): number {
        return (
            (this.hardCompactingForm.controls.sliceSize.value as number) *
            sliceSizeMapper[this.hardCompactingForm.controls.sliceUnit.value as SliceUnit]
        );
    }

    public get sliceSizeControl(): AbstractControl {
        return this.hardCompactingForm.controls.sliceSize;
    }

    public get recordsCountControl(): AbstractControl {
        return this.hardCompactingForm.controls.recordsCount;
    }

    private hardCompactingModeChanges(): void {
        this.trackSubscription(
            this.hardCompactingMode.valueChanges.subscribe((value: CompactingMode) => {
                switch (value) {
                    case CompactingMode.FULL: {
                        this.disableAndClearControl(this.recursive);
                        this.sliceUnit.enable();
                        this.recordsCount.enable();
                        this.sliceSize.enable();
                        break;
                    }
                    case CompactingMode.METADATA_ONLY: {
                        this.recursive.enable();
                        this.disableAndClearControl(this.sliceUnit);
                        this.disableAndClearControl(this.recordsCount);
                        this.disableAndClearControl(this.sliceSize);
                        break;
                    }
                    default: {
                        logError("Unknown CompactingMode key");
                    }
                }
            }),
        );
    }

    public onRunCompacting(): void {
        promiseWithCatch(
            this.modalService.error({
                title: "Run compacting",
                message: "Do you want to run hard compacting?",
                yesButtonText: "Ok",
                noButtonText: "Cancel",
                handler: (ok) => {
                    if (ok) {
                        this.trackSubscription(
                            this.datasetCompactingService
                                .runHardCompacting({
                                    datasetId: this.datasetBasics.id,
                                    datasetFlowType: DatasetFlowType.HardCompacting,
                                    compactingArgs: this.setCompactingArgs(
                                        this.hardCompactingMode.value as CompactingMode,
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

    private setCompactingArgs(mode: CompactingMode): CompactingConditionInput {
        switch (mode) {
            case CompactingMode.FULL:
                return {
                    full: {
                        maxSliceSize: this.sliceSizeInBytes,
                        maxSliceRecords: this.hardCompactingForm.controls.recordsCount.value as number,
                    },
                };
            case CompactingMode.METADATA_ONLY:
                return {
                    metadataOnly: {
                        recursive: this.recursive.value as boolean,
                    },
                };
        }
    }
}
