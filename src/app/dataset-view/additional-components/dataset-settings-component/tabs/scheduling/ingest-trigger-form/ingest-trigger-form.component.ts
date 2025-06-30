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
import { AbstractControl, FormControl, FormGroup, Validators } from "@angular/forms";
import {
    DatasetBasicsFragment,
    DatasetFlowType,
    GetDatasetFlowTriggersQuery,
    TimeUnit,
} from "src/app/api/kamu.graphql.interface";
import { PollingGroupFormValue } from "../dataset-settings-scheduling-tab.component.types";
import { PollingGroupEnum } from "../../../dataset-settings.model";
import { BaseComponent } from "src/app/common/components/base.component";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { cronExpressionValidator } from "src/app/common/helpers/data.helpers";
import { MaybeNull } from "src/app/interface/app.types";
import { DatasetFlowTriggerService } from "../../../services/dataset-flow-trigger.service";
import { TriggersTooltipsTexts } from "src/app/common/tooltips/triggers.text";
import { finalize } from "rxjs";
import { TimeDeltaFormValue } from "src/app/common/components/time-delta-form/time-delta-form.value";
import { CronExpressionFormValue } from "src/app/common/components/cron-expression-form/cron-expression-form.value";

@Component({
    selector: "app-ingest-trigger-form",
    templateUrl: "./ingest-trigger-form.component.html",
    styleUrls: ["./ingest-trigger-form.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IngestTriggerFormComponent extends BaseComponent implements OnInit {
    @Input({ required: true }) public datasetBasics: DatasetBasicsFragment;
    @Input({ required: true }) public updateStateToggleLabel: string;
    @Output() public changeTriggerEmit = new EventEmitter<FormGroup<PollingGroupFormValue>>();

    public isLoaded: boolean = false;
    public readonly PollingGroupEnum: typeof PollingGroupEnum = PollingGroupEnum;
    public readonly UPDATES_TOOLTIP = TriggersTooltipsTexts.UPDATE_SELECTOR_TOOLTIP;

    private readonly datasetFlowTriggerService = inject(DatasetFlowTriggerService);
    private readonly cdr = inject(ChangeDetectorRef);

    public pollingForm = new FormGroup<PollingGroupFormValue>({
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
        this.initPollingForm();

        this.pollingUpdatesState.valueChanges
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe((updated: boolean) => {
                if (updated) {
                    this.pollingType.enable();
                } else {
                    this.pollingType.disable();
                }
            });
    }

    public initPollingForm(): void {
        this.datasetFlowTriggerService
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
                    if (!this.pollingUpdatesState.value) {
                        this.pollingType.disable();
                    }
                } else {
                    this.pollingType.disable();
                }
                this.changeTriggerEmit.emit(this.pollingForm);
            });
    }

    public get pollingType(): AbstractControl {
        return this.pollingForm.controls.__typename;
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

    public onTimeDeltaChange(value: TimeDeltaFormValue): void {
        this.pollingForm.patchValue({
            every: value.every,
            unit: value.unit,
        });
    }

    public onCronExpressionChange(value: CronExpressionFormValue): void {
        this.pollingForm.patchValue({
            cronExpression: value.cronExpression,
        });
    }

    public get timeDeltaValue(): TimeDeltaFormValue {
        return {
            every: this.pollingEveryTime.value as number | null,
            unit: this.pollingUnitTime.value as TimeUnit | null,
        };
    }

    public get cronExpressionValue(): CronExpressionFormValue {
        return {
            cronExpression: this.cronExpression.value as string | null,
        };
    }
    
    public get isTimeDeltaDisabled(): boolean {
        return !this.pollingUpdatesState.value || this.pollingType.value !== PollingGroupEnum.TIME_DELTA;
    }

    public get isCronExpressionDisabled(): boolean {
        return !this.pollingUpdatesState.value || this.pollingType.value !== PollingGroupEnum.CRON_5_COMPONENT_EXPRESSION;
    }

}
