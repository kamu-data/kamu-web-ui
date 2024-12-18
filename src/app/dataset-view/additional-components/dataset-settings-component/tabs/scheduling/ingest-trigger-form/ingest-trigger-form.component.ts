import { ChangeDetectionStrategy, Component, EventEmitter, inject, Input, OnInit, Output } from "@angular/core";
import { AbstractControl, FormControl, FormGroup, ValidatorFn, Validators } from "@angular/forms";
import {
    DatasetBasicsFragment,
    DatasetFlowType,
    GetDatasetFlowTriggersQuery,
    TimeUnit,
} from "src/app/api/kamu.graphql.interface";
import { PollingGroupType } from "../dataset-settings-scheduling-tab.component.types";
import { PollingGroupEnum } from "../../../dataset-settings.model";
import { cronExpressionNextTime, logError } from "src/app/common/app.helpers";
import { BaseComponent } from "src/app/common/base.component";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { cronExpressionValidator, everyTimeMapperValidators } from "src/app/common/data.helpers";
import { MaybeNull } from "src/app/common/app.types";
import { DatasetSchedulingService } from "../../../services/dataset-scheduling.service";

@Component({
    selector: "app-ingest-trigger-form",
    templateUrl: "./ingest-trigger-form.component.html",
    styleUrls: ["./ingest-trigger-form.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IngestTriggerFormComponent extends BaseComponent implements OnInit {
    @Input({ required: true }) public datasetBasics: DatasetBasicsFragment;
    @Output() public saveTriggerEmit = new EventEmitter<FormGroup<PollingGroupType>>();
    @Input({ required: true }) public updateStateToggleLabel: string;

    public readonly timeUnit: typeof TimeUnit = TimeUnit;
    public readonly pollingGroupEnum: typeof PollingGroupEnum = PollingGroupEnum;
    private everyTimeMapperValidators: Record<TimeUnit, ValidatorFn> = everyTimeMapperValidators;

    private datasetSchedulingService = inject(DatasetSchedulingService);

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

    ngOnInit(): void {
        this.setPollingEveryTimeValidator();
        this.initPollingForm();
        this.pollingTypeChanges();
    }

    public savePollingTriggers(): void {
        this.saveTriggerEmit.emit(this.pollingForm);
    }

    public initPollingForm(): void {
        this.datasetSchedulingService
            .fetchDatasetFlowTriggers(this.datasetBasics.id, DatasetFlowType.Ingest)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe((data: GetDatasetFlowTriggersQuery) => {
                const flowTriggers = data.datasets.byId?.flows.triggers.byType;
                const schedule = flowTriggers?.schedule;
                if (schedule && schedule.__typename === PollingGroupEnum.TIME_DELTA) {
                    this.pollingForm.patchValue({
                        updatesState: !flowTriggers.paused,
                        __typename: schedule?.__typename as PollingGroupEnum,
                        every: schedule.every,
                        unit: schedule.unit,
                    });
                }
                if (schedule && schedule.__typename === PollingGroupEnum.CRON_5_COMPONENT_EXPRESSION) {
                    this.pollingForm.patchValue({
                        updatesState: !flowTriggers.paused,
                        __typename: schedule.__typename as PollingGroupEnum,
                        cronExpression: schedule.cron5ComponentExpression,
                    });
                }
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
