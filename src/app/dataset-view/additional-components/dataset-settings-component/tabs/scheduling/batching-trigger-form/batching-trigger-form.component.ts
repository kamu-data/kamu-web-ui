import { ChangeDetectionStrategy, Component, EventEmitter, inject, Input, OnInit, Output } from "@angular/core";
import {
    DatasetBasicsFragment,
    DatasetFlowType,
    GetDatasetFlowTriggersQuery,
    TimeUnit,
} from "src/app/api/kamu.graphql.interface";
import { BaseComponent } from "src/app/common/base.component";
import { DatasetSchedulingService } from "../../../services/dataset-scheduling.service";
import { FormGroup, FormControl, Validators, AbstractControl, ValidatorFn } from "@angular/forms";
import { MaybeNull } from "src/app/common/app.types";
import { BatchingFormType } from "../dataset-settings-scheduling-tab.component.types";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { everyTimeMapperValidators } from "src/app/common/data.helpers";

@Component({
    selector: "app-batching-trigger-form",
    templateUrl: "./batching-trigger-form.component.html",
    styleUrls: ["./batching-trigger-form.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BatchingTriggerFormComponent extends BaseComponent implements OnInit {
    @Input({ required: true }) public datasetBasics: DatasetBasicsFragment;
    @Output() public saveTriggerEmit = new EventEmitter<FormGroup<BatchingFormType>>();
    public readonly timeUnit: typeof TimeUnit = TimeUnit;
    private everyTimeMapperValidators: Record<TimeUnit, ValidatorFn> = everyTimeMapperValidators;

    public batchingForm = new FormGroup<BatchingFormType>({
        updatesState: new FormControl<boolean>(false, { nonNullable: true }),
        every: new FormControl<MaybeNull<number>>({ value: null, disabled: false }, [
            Validators.required,
            Validators.min(1),
        ]),
        unit: new FormControl<MaybeNull<TimeUnit>>({ value: null, disabled: false }, [Validators.required]),
        minRecordsToAwait: new FormControl<MaybeNull<number>>({ value: null, disabled: false }, [
            Validators.required,
            Validators.min(1),
        ]),
    });

    private datasetSchedulingService = inject(DatasetSchedulingService);

    public get batchingUpdatesState(): AbstractControl {
        return this.batchingForm.controls.updatesState;
    }

    public get batchingEveryTime(): AbstractControl {
        return this.batchingForm.controls.every;
    }

    public get batchingUnitTime(): AbstractControl {
        return this.batchingForm.controls.unit;
    }

    public get batchingMinRecordsToAwait(): AbstractControl {
        return this.batchingForm.controls.minRecordsToAwait;
    }

    public saveBatchingTriggers(): void {
        this.saveTriggerEmit.emit(this.batchingForm);
    }

    private setBatchingEveryTimeValidator(): void {
        this.batchingUnitTime.valueChanges.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((data: TimeUnit) => {
            if (data) {
                this.batchingEveryTime.setValidators([this.everyTimeMapperValidators[data], Validators.required]);
            }
        });
    }

    public ngOnInit(): void {
        this.setBatchingEveryTimeValidator();
        this.initBatchingForm();
        this.batchingUpdatesState.valueChanges
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe((enableUpdates: boolean) => {
                enableUpdates ? this.enableControls() : this.disableControls();
            });
    }

    public initBatchingForm(): void {
        this.datasetSchedulingService
            .fetchDatasetFlowTriggers(this.datasetBasics.id, DatasetFlowType.ExecuteTransform)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe((data: GetDatasetFlowTriggersQuery) => {
                const flowTriggers = data.datasets.byId?.flows.triggers.byType;
                const batching = flowTriggers?.batching;
                if (batching) {
                    this.batchingForm.patchValue({
                        ...batching.maxBatchingInterval,
                        minRecordsToAwait: batching.minRecordsToAwait,
                        updatesState: !flowTriggers.paused,
                    });
                } else {
                    this.disableControls();
                }
            });
    }

    private disableControls(): void {
        this.batchingEveryTime.disable();
        this.batchingUnitTime.disable();
        this.batchingMinRecordsToAwait.disable();
    }

    private enableControls(): void {
        this.batchingEveryTime.enable();
        this.batchingUnitTime.enable();
        this.batchingMinRecordsToAwait.enable();
    }
}
