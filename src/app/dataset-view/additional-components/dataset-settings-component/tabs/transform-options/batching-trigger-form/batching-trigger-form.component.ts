/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    EventEmitter,
    inject,
    Input,
    OnInit,
    Output,
} from "@angular/core";
import {
    DatasetBasicsFragment,
    DatasetFlowType,
    GetDatasetFlowTriggersQuery,
    TimeUnit,
} from "src/app/api/kamu.graphql.interface";
import { BaseComponent } from "src/app/common/components/base.component";
import { DatasetSchedulingService } from "../../../services/dataset-scheduling.service";
import { FormGroup, FormControl, Validators, AbstractControl, ValidatorFn, FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MaybeNull } from "src/app/interface/app.types";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { everyTimeMapperValidators } from "src/app/common/helpers/data.helpers";
import { TriggersTooltipsTexts } from "src/app/common/tooltips/triggers.text";
import { finalize } from "rxjs";
import { BatchingFormType } from "../dataset-settings-transform-options-tab.component.types";
import { MatProgressBarModule } from "@angular/material/progress-bar";
import { FormValidationErrorsDirective } from "../../../../../../common/directives/form-validation-errors.directive";
import { TooltipIconComponent } from "../../../../../../common/components/tooltip-icon/tooltip-icon.component";
import { MatSlideToggleModule } from "@angular/material/slide-toggle";
import { NgIf } from "@angular/common";

@Component({
    selector: "app-batching-trigger-form",
    templateUrl: "./batching-trigger-form.component.html",
    styleUrls: ["./batching-trigger-form.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [
        NgIf,
        FormsModule,
        ReactiveFormsModule,
        MatSlideToggleModule,
        TooltipIconComponent,
        FormValidationErrorsDirective,
        MatProgressBarModule,
    ],
})
export class BatchingTriggerFormComponent extends BaseComponent implements OnInit {
    @Input({ required: true }) public datasetBasics: DatasetBasicsFragment;
    @Output() public saveTriggerEmit = new EventEmitter<FormGroup<BatchingFormType>>();
    public readonly timeUnit: typeof TimeUnit = TimeUnit;
    public readonly UPDATES_TOOLTIP = TriggersTooltipsTexts.UPDATE_SELECTOR_TOOLTIP;
    private everyTimeMapperValidators: Record<TimeUnit, ValidatorFn> = everyTimeMapperValidators;
    public pausedFromServer: boolean;
    public isLoaded: boolean = false;

    public batchingForm = new FormGroup<BatchingFormType>({
        updatesState: new FormControl<boolean>(false, { nonNullable: true }),
        every: new FormControl<MaybeNull<number>>({ value: null, disabled: false }, [
            Validators.required,
            Validators.min(0),
        ]),
        unit: new FormControl<MaybeNull<TimeUnit>>({ value: null, disabled: false }, [Validators.required]),
        minRecordsToAwait: new FormControl<MaybeNull<number>>({ value: null, disabled: false }, [
            Validators.required,
            Validators.min(0),
        ]),
    });

    private datasetSchedulingService = inject(DatasetSchedulingService);
    private cdr = inject(ChangeDetectorRef);

    public get batchingUpdatesState(): AbstractControl {
        return this.batchingForm.controls.updatesState;
    }

    public get batchingEveryTime(): AbstractControl {
        return this.batchingForm.controls.every;
    }

    public get batchingUnitTime(): AbstractControl {
        return this.batchingForm.controls.unit;
    }

    public get updatesState(): AbstractControl {
        return this.batchingForm.controls.updatesState;
    }

    public get batchingMinRecordsToAwait(): AbstractControl {
        return this.batchingForm.controls.minRecordsToAwait;
    }

    public saveBatchingTriggers(): void {
        this.saveTriggerEmit.emit(this.batchingForm);
    }

    public saveDefaultBatchingTriggers(): void {
        const updatesState = this.updatesState.value as boolean;
        this.batchingForm.patchValue({
            unit: TimeUnit.Minutes,
            every: 0,
            minRecordsToAwait: 0,
            updatesState: this.pausedFromServer || updatesState ? true : false,
        });
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
                if (enableUpdates) {
                    this.enableControls();
                } else if (this.batchingForm.invalid) {
                    this.disableControls();
                }
            });
    }

    public initBatchingForm(): void {
        this.datasetSchedulingService
            .fetchDatasetFlowTriggers(this.datasetBasics.id, DatasetFlowType.ExecuteTransform)
            .pipe(
                finalize(() => {
                    this.isLoaded = true;
                    this.cdr.detectChanges();
                }),
                takeUntilDestroyed(this.destroyRef),
            )
            .subscribe((data: GetDatasetFlowTriggersQuery) => {
                const flowTriggers = data.datasets.byId?.flows.triggers.byType;
                const batching = flowTriggers?.batching;
                this.pausedFromServer = Boolean(flowTriggers?.paused);

                if (batching && batching.maxBatchingInterval.every && !flowTriggers.paused) {
                    this.batchingForm.patchValue({
                        unit: batching.maxBatchingInterval.unit,
                        every: batching.maxBatchingInterval.every,
                        minRecordsToAwait: batching.minRecordsToAwait,
                        updatesState: !flowTriggers.paused,
                    });
                } else {
                    this.batchingForm.reset();
                    if (flowTriggers && !flowTriggers.paused) {
                        this.batchingForm.patchValue({
                            updatesState: !flowTriggers.paused,
                        });
                    } else if (batching && batching.maxBatchingInterval.every) {
                        this.disableControls();
                    }
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
