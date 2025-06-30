/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import {
    ChangeDetectionStrategy,
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
} from "src/app/api/kamu.graphql.interface";
import { PollingGroupFormType } from "../dataset-settings-scheduling-tab.component.types";
import { PollingGroupEnum } from "../../../dataset-settings.model";
import { BaseComponent } from "src/app/common/components/base.component";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { MaybeNull } from "src/app/interface/app.types";
import { DatasetFlowTriggerService } from "../../../services/dataset-flow-trigger.service";
import { TriggersTooltipsTexts } from "src/app/common/tooltips/triggers.text";
import { Observable, map, catchError, of } from "rxjs";
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
    @Output() public changeTriggerEmit = new EventEmitter<FormGroup<PollingGroupFormType>>();

    public readonly PollingGroupEnum: typeof PollingGroupEnum = PollingGroupEnum;
    public readonly UPDATES_TOOLTIP = TriggersTooltipsTexts.UPDATE_SELECTOR_TOOLTIP;

    private readonly datasetFlowTriggerService = inject(DatasetFlowTriggerService);

    public pollingForm = new FormGroup<PollingGroupFormType>({
        updatesEnabled: new FormControl<boolean>(false, { nonNullable: true }),
        __typename: new FormControl(PollingGroupEnum.TIME_DELTA, [Validators.required]),
        timeDelta: new FormControl<MaybeNull<TimeDeltaFormValue>>({ value: null, disabled: false }, [
            Validators.required,
        ]),
        cron: new FormControl<MaybeNull<CronExpressionFormValue>>({ value: null, disabled: true }, [
            Validators.required,
        ]),
    });

    // Reactive data stream for form initialization
    public formData$: Observable<FormGroup<PollingGroupFormType>>;

    public ngOnInit(): void {
        // Set up form control relationships
        this.setupFormControlRelationships();

        // Initialize the reactive data stream
        this.formData$ = this.initPollingForm();
    }

    private setupFormControlRelationships(): void {
        this.pollingUpdatesEnabled.valueChanges
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe((updated: boolean) => {
                if (updated) {
                    this.pollingType.enable();
                } else {
                    this.pollingType.disable();
                }
            });

        this.pollingType.valueChanges
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe((pollingType: PollingGroupEnum) => {
                if (pollingType === PollingGroupEnum.TIME_DELTA) {
                    this.cronExpression.disable();
                    this.timeDelta.enable();
                } else if (pollingType === PollingGroupEnum.CRON_5_COMPONENT_EXPRESSION) {
                    this.timeDelta.disable();
                    this.cronExpression.enable();
                }
            });
    }

    private initPollingForm(): Observable<FormGroup<PollingGroupFormType>> {
        return this.datasetFlowTriggerService
            .fetchDatasetFlowTriggers(this.datasetBasics.id, DatasetFlowType.Ingest)
            .pipe(
                map((data: GetDatasetFlowTriggersQuery) => {
                    const flowTriggers = data.datasets.byId?.flows.triggers.byType;
                    const schedule = flowTriggers?.schedule;
                    if (schedule) {
                        if (schedule.__typename === PollingGroupEnum.TIME_DELTA) {
                            this.pollingForm.patchValue({
                                updatesEnabled: !flowTriggers.paused,
                                __typename: schedule?.__typename as PollingGroupEnum,
                                timeDelta: {
                                    every: schedule.every,
                                    unit: schedule.unit,
                                } as TimeDeltaFormValue,
                            });
                        }
                        if (schedule.__typename === PollingGroupEnum.CRON_5_COMPONENT_EXPRESSION) {
                            this.pollingForm.patchValue({
                                updatesEnabled: !flowTriggers.paused,
                                __typename: schedule.__typename as PollingGroupEnum,
                                cron: {
                                    cronExpression: schedule.cron5ComponentExpression,
                                } as CronExpressionFormValue,
                            });
                        }
                    }
                    this.changeTriggerEmit.emit(this.pollingForm);
                    return this.pollingForm;
                }),
                catchError((_error) => {
                    // In case of error, still return the form so UI doesn't get stuck
                    this.changeTriggerEmit.emit(this.pollingForm);
                    return of(this.pollingForm);
                }),
                takeUntilDestroyed(this.destroyRef),
            );
    }

    public get pollingType(): AbstractControl {
        return this.pollingForm.controls.__typename;
    }

    public get timeDelta(): AbstractControl {
        return this.pollingForm.controls.timeDelta;
    }

    public get cronExpression(): AbstractControl {
        return this.pollingForm.controls.cron;
    }

    public get pollingUpdatesEnabled(): AbstractControl {
        return this.pollingForm.controls.updatesEnabled;
    }
}
