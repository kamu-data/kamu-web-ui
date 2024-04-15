import { NavigationService } from "./../../../../../services/navigation.service";
import { ChangeDetectionStrategy, Component, Input, OnInit } from "@angular/core";
import { FormBuilder, Validators } from "@angular/forms";
import { RxwebValidators } from "@rxweb/reactive-form-validators";
import { DatasetBasicsFragment, DatasetFlowType } from "src/app/api/kamu.graphql.interface";
import { promiseWithCatch } from "src/app/common/app.helpers";
import { CompactingTooltipsTexts } from "src/app/common/tooltips/compacting.text";
import { ModalService } from "src/app/components/modal/modal.service";
import { SliceUnit, sliceSizeMapper } from "./dataset-settings-compacting-tab.types";
import { DatasetCompactingService } from "../../services/dataset-compacting.service";
import { DatasetViewTypeEnum } from "src/app/dataset-view/dataset-view.interface";
import AppValues from "src/app/common/app.values";

@Component({
    selector: "app-dataset-settings-compacting-tab",
    templateUrl: "./dataset-settings-compacting-tab.component.html",
    styleUrls: ["./dataset-settings-compacting-tab.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DatasetSettingsCompactingTabComponent implements OnInit {
    @Input() public datasetBasics: DatasetBasicsFragment;
    public hardCompactionForm = this.fb.group({
        sliceUnit: [SliceUnit.GB, [Validators.required]],
        sliceSize: [1, [Validators.required, RxwebValidators.minNumber({ value: 1 })]],
        recordsCount: [10000, [Validators.required, RxwebValidators.minNumber({ value: 1 })]],
    });
    public readonly SliceUnit: typeof SliceUnit = SliceUnit;
    public readonly MAX_SLICE_SIZE_TOOLTIP = CompactingTooltipsTexts.MAX_SLICE_SIZE;
    public readonly MAX_SLICE_RECORDS_TOOLTIP = CompactingTooltipsTexts.MAX_SLICE_RECORDS;

    constructor(
        public modalService: ModalService,
        private fb: FormBuilder,
        private datasetCompactingService: DatasetCompactingService,
        private navigationService: NavigationService,
    ) {}

    ngOnInit(): void {}

    public onRunCompaction(): void {
        promiseWithCatch(
            this.modalService.error({
                title: "Run compaction",
                message: "Do you want to run hard compaction?",
                yesButtonText: "Ok",
                noButtonText: "Cancel",
                handler: (ok) => {
                    if (ok) {
                        this.datasetCompactingService
                            .runHardCompaction({
                                datasetId: this.datasetBasics.id,
                                datasetFlowType: DatasetFlowType.HardCompacting,
                                compactingArgs: {
                                    maxSliceSize: this.sliceSizeInBytes,
                                    maxSliceRecords: this.hardCompactionForm.controls.recordsCount.value as number,
                                },
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
                            });
                    }
                },
            }),
        );
    }

    public get sliceSizeInBytes(): number {
        return (
            (this.hardCompactionForm.controls.sliceSize.value as number) *
            sliceSizeMapper[this.hardCompactionForm.controls.sliceUnit.value as SliceUnit]
        );
    }
}
