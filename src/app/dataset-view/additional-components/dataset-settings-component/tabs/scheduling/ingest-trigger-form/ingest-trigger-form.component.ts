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
import { AbstractControl, FormControl, FormGroup, ValidatorFn, Validators } from "@angular/forms";
import {
    DatasetBasicsFragment,
    DatasetFlowType,
    GetDatasetFlowTriggersQuery,
    TimeUnit,
} from "src/app/api/kamu.graphql.interface";
import { PollingGroupType } from "../dataset-settings-scheduling-tab.component.types";
import { PollingGroupEnum } from "../../../dataset-settings.model";
import { cronExpressionNextTime, logError } from "src/app/common/helpers/app.helpers";
import { BaseComponent } from "src/app/common/components/base.component";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { cronExpressionValidator, everyTimeMapperValidators } from "src/app/common/helpers/data.helpers";
import { MaybeNull } from "src/app/interface/app.types";
import { DatasetSchedulingService } from "../../../services/dataset-scheduling.service";
import { TriggersTooltipsTexts } from "src/app/common/tooltips/triggers.text";
import { finalize } from "rxjs";

@Component({
    selector: "app-ingest-trigger-form",
    templateUrl: "./ingest-trigger-form.component.html",
    styleUrls: ["./ingest-trigger-form.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IngestTriggerFormComponent extends BaseComponent implements OnInit {
    @Input({ required: true }) public datasetBasics: DatasetBasicsFragment;
    @Output() public changeTriggerEmit = new EventEmitter<FormGroup<PollingGroupType>>();
    @Input({ required: true }) public updateStateToggleLabel: string;

    public isLoaded: boolean = false;
    public readonly timeUnit: typeof TimeUnit = TimeUnit;
    public readonly pollingGroupEnum: typeof PollingGroupEnum = PollingGroupEnum;
    public readonly UPDATES_TOOLTIP = TriggersTooltipsTexts.UPDATE_SELECTOR_TOOLTIP;
    private everyTimeMapperValidators: Record<TimeUnit, ValidatorFn> = everyTimeMapperValidators;

    private datasetSchedulingService = inject(DatasetSchedulingService);
    private cdr = inject(ChangeDetectorRef);

    public pollingForm = new FormGroup<PollingGroupType>({
        updatesState: new FormControl<boolean>(false, { nonNullable: true }),
        __typename: new FormControl(PollingGroupEnum.TIME_DELTA, [Validators.required]),
        every: new FormControl<MaybeNull<number>>({ value: null, disabled: false }, [
            Validators.required,
            Validators.min(1),
        ]),
        unit: new FormControl<MaybeNull<TimeUnit>>({ value: null, disabled: false }, [Validators.required]),
        cronExpression: new FormControl<MaybeNull<string>>({ value: "", disabled: true }, [
            Validators.required,
            cronExpressionValidator(),
        ]),
    });

    public ngOnInit(): void {
        this.setPollingEveryTimeValidator();
        this.initPollingForm();
        this.pollingTypeChanges();
    }

    public initPollingForm(): void {
        this.datasetSchedulingService
            .fetchDatasetFlowTriggers(this.datasetBasics.id, DatasetFlowType.Ingest)
            .pipe(
                finalize(() => {
                    this.isLoaded = true;
                    this.cdr.detectChanges();
                }),
                takeUntilDestroyed(this.destroyRef),
            )
            .subscribe((data: GetDatasetFlowTriggersQuery) => {
                const flowTriggers = data.datasets.byId?.flows.triggers.byType;
                const schedule = flowTriggers?.schedule;
                if (schedule) {
                    if (schedule.__typename === PollingGroupEnum.TIME_DELTA) {
                        this.pollingForm.patchValue({
                            updatesState: !flowTriggers.paused,
                            __typename: schedule?.__typename as PollingGroupEnum,
                            every: schedule.every,
                            unit: schedule.unit,
                        });
                    }
                    if (schedule.__typename === PollingGroupEnum.CRON_5_COMPONENT_EXPRESSION) {
                        this.pollingForm.patchValue({
                            updatesState: !flowTriggers.paused,
                            __typename: schedule.__typename as PollingGroupEnum,
                            cronExpression: schedule.cron5ComponentExpression,
                        });
                    }
                }
                this.changeTriggerEmit.emit(this.pollingForm);
            });
    }

    public get nextTime(): string {
        return cronExpressionNextTime(this.cronExpression.value as string);
    }

    public get cronExpression(): AbstractControl {
        return this.pollingForm.controls.cronExpression;
    }

    public get pollingEveryTime(): AbstractControl {
        return this.pollingForm.controls.every;
    }

    public get pollingUnitTime(): AbstractControl {
        return this.pollingForm.controls.unit;
    }

    public get pollingUpdatesState(): AbstractControl {
        return this.pollingForm.controls.updatesState;
    }

    private disableAndClearControl(control: AbstractControl): void {
        control.disable();
        control.markAsUntouched();
        control.markAsPristine();
    }

    private setPollingEveryTimeValidator(): void {
        this.pollingUnitTime.valueChanges.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((data: TimeUnit) => {
            if (data) {
                this.pollingEveryTime.setValidators([this.everyTimeMapperValidators[data], Validators.required]);
            }
        });
    }

    public get pollingType(): AbstractControl {
        return this.pollingForm.controls.__typename;
    }

    private pollingTypeChanges(): void {
        this.pollingType.valueChanges.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((value: PollingGroupEnum) => {
            switch (value) {
                case PollingGroupEnum.TIME_DELTA: {
                    this.pollingEveryTime.enable();
                    this.pollingUnitTime.enable();
                    this.disableAndClearControl(this.cronExpression);

                    break;
                }
                case PollingGroupEnum.CRON_5_COMPONENT_EXPRESSION: {
                    this.cronExpression.enable();
                    this.disableAndClearControl(this.pollingEveryTime);
                    this.disableAndClearControl(this.pollingUnitTime);

                    break;
                }
                /* istanbul ignore next */
                default: {
                    logError("Unknown PollingGroupEnum key");
                }
            }
        });
    }
}
