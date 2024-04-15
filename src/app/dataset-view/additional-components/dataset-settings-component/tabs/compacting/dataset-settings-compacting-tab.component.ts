import { ChangeDetectionStrategy, Component, Input, OnInit } from "@angular/core";
import { FormBuilder, Validators } from "@angular/forms";
import { RxwebValidators } from "@rxweb/reactive-form-validators";
import { DatasetBasicsFragment } from "src/app/api/kamu.graphql.interface";
import { promiseWithCatch } from "src/app/common/app.helpers";
import { CompactingTooltipsTexts } from "src/app/common/tooltips/compacting.text";
import { ModalService } from "src/app/components/modal/modal.service";
import { SliceUnit } from "./dataset-settings-compacting-tab.types";

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
                        // console.log("ok")
                    }
                },
            }),
        );
    }

    public get sliceSizeInBytes(): number {
        return (
            (this.hardCompactionForm.controls.sliceSize.value as number) *
            this.sliceSizeMapper[this.hardCompactionForm.controls.sliceUnit.value as SliceUnit]
        );
    }

    private sliceSizeMapper: Record<SliceUnit, number> = {
        [SliceUnit.B]: 1,
        [SliceUnit.KB]: Math.pow(2, 10),
        [SliceUnit.MB]: Math.pow(2, 20),
        [SliceUnit.GB]: Math.pow(2, 30),
    };
}
