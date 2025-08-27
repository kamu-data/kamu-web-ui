/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { ChangeDetectionStrategy, Component, Input, OnInit } from "@angular/core";
import { AbstractControl, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from "@angular/forms";
import { FlowTriggerRuleInput } from "src/app/api/kamu.graphql.interface";
import { ScheduleType } from "../../../dataset-settings.model";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { MaybeNull } from "src/app/interface/app.types";
import { MatRadioModule } from "@angular/material/radio";
import { TimeDeltaFormComponent } from "src/app/common/components/time-delta-form/time-delta-form.component";
import { CronExpressionFormComponent } from "src/app/common/components/cron-expression-form/cron-expression-form.component";
import { IngestTriggerFormType, IngestTriggerFormValue } from "./ingest-trigger-form.types";
import { BaseComponent } from "src/app/common/components/base.component";

@Component({
    selector: "app-ingest-trigger-form",
    templateUrl: "./ingest-trigger-form.component.html",
    styleUrls: ["./ingest-trigger-form.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [
        //-----//
        FormsModule,
        ReactiveFormsModule,

        //-----//
        MatRadioModule,

        //-----//
        TimeDeltaFormComponent,
        CronExpressionFormComponent,
    ],
})
export class IngestTriggerFormComponent extends BaseComponent implements OnInit {
    @Input({ required: true }) public form: FormGroup<IngestTriggerFormType>;
    @Input({ required: true }) public updatesEnabledControl: FormControl<boolean>;

    public readonly ScheduleType: typeof ScheduleType = ScheduleType;

    public static buildForm(): FormGroup<IngestTriggerFormType> {
        const cronForm = CronExpressionFormComponent.buildForm();
        const timeDeltaForm = TimeDeltaFormComponent.buildForm();

        cronForm.disable(); // Initially disabled
        timeDeltaForm.disable(); // Initially disabled

        return new FormGroup<IngestTriggerFormType>({
            __typename: new FormControl<MaybeNull<ScheduleType>>(
                { value: null, disabled: true },
                { nonNullable: true, validators: [Validators.required] },
            ),
            timeDelta: timeDeltaForm,
            cron: cronForm,
        });
    }

    public static buildPollingTriggerRuleInput(ingestTriggerFormValue: IngestTriggerFormValue): FlowTriggerRuleInput {
        switch (ingestTriggerFormValue.__typename) {
            case ScheduleType.TIME_DELTA: {
                const timeDeltaValue = ingestTriggerFormValue.timeDelta;
                // istanbul ignore next
                if (!timeDeltaValue || !timeDeltaValue.every || !timeDeltaValue.unit) {
                    throw new Error("Time delta value is not valid");
                }
                return {
                    schedule: {
                        timeDelta: {
                            every: timeDeltaValue.every,
                            unit: timeDeltaValue.unit,
                        },
                    },
                };
            }

            case ScheduleType.CRON_5_COMPONENT_EXPRESSION: {
                const cronValue = ingestTriggerFormValue.cron;
                // istanbul ignore next
                if (!cronValue || !cronValue.cronExpression || cronValue.cronExpression.trim() === "") {
                    throw new Error("Cron expression value is not valid");
                }
                return {
                    schedule: {
                        // sync with server validator
                        cron5ComponentExpression: cronValue.cronExpression,
                    },
                };
            }

            /* istanbul ignore next */
            default:
                throw new Error(`Unknown schedule type: ${ingestTriggerFormValue.__typename}`);
        }
    }

    public ngOnInit(): void {
        this.setupFormControlRelationships();
    }

    private setupFormControlRelationships(): void {
        this.updatesEnabledControl.valueChanges
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe((enabled: boolean) => {
                if (enabled) {
                    this.scheduleTypeControl.enable();
                } else {
                    this.scheduleTypeControl.disable();
                    this.timeDeltaControl.disable();
                    this.cronExpressionControl.disable();
                }
            });

        this.scheduleTypeControl.valueChanges
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe((pollingType: ScheduleType) => {
                if (this.updatesEnabledControl.value) {
                    if (pollingType === ScheduleType.TIME_DELTA) {
                        this.cronExpressionControl.disable();
                        this.timeDeltaControl.enable();
                    } else if (pollingType === ScheduleType.CRON_5_COMPONENT_EXPRESSION) {
                        this.timeDeltaControl.disable();
                        this.cronExpressionControl.enable();
                    }
                }
            });
    }

    public get scheduleTypeControl(): AbstractControl {
        return this.form.controls.__typename;
    }

    public get timeDeltaControl(): AbstractControl {
        return this.form.controls.timeDelta;
    }

    public get cronExpressionControl(): AbstractControl {
        return this.form.controls.cron;
    }
}
