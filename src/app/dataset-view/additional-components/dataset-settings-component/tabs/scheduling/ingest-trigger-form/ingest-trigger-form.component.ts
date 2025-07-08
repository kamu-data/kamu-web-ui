/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { ChangeDetectionStrategy, Component, forwardRef, Input, OnInit } from "@angular/core";
import {
    AbstractControl,
    FormControl,
    FormGroup,
    FormsModule,
    ReactiveFormsModule,
    NG_VALUE_ACCESSOR,
    NG_VALIDATORS,
} from "@angular/forms";
import { DatasetBasicsFragment } from "src/app/api/kamu.graphql.interface";
import { ScheduleType } from "../../../dataset-settings.model";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { MaybeNull } from "src/app/interface/app.types";
import { FlowTooltipsTexts } from "src/app/common/tooltips/flow-tooltips.text";
import { TimeDeltaFormValue } from "src/app/common/components/time-delta-form/time-delta-form.value";
import { CronExpressionFormValue } from "src/app/common/components/cron-expression-form/cron-expression-form.value";
import { MatRadioModule } from "@angular/material/radio";
import { TooltipIconComponent } from "../../../../../../common/components/tooltip-icon/tooltip-icon.component";
import { MatSlideToggleModule } from "@angular/material/slide-toggle";
import { TimeDeltaFormComponent } from "src/app/common/components/time-delta-form/time-delta-form.component";
import { CronExpressionFormComponent } from "src/app/common/components/cron-expression-form/cron-expression-form.component";
import { IngestTriggerFormType, IngestTriggerFormValue } from "./ingest-trigger-form.types";
import { BaseFormControlComponent } from "src/app/common/components/base-form-control.component";

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
        MatSlideToggleModule,

        //-----//
        TooltipIconComponent,
        TimeDeltaFormComponent,
        CronExpressionFormComponent,
    ],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => IngestTriggerFormComponent),
            multi: true,
        },
        {
            provide: NG_VALIDATORS,
            useExisting: forwardRef(() => IngestTriggerFormComponent),
            multi: true,
        },
    ],
})
export class IngestTriggerFormComponent extends BaseFormControlComponent<IngestTriggerFormValue> implements OnInit {
    @Input({ required: true }) public datasetBasics: DatasetBasicsFragment;
    @Input({ required: true }) public updateStateToggleLabel: string;

    public readonly ScheduleType: typeof ScheduleType = ScheduleType;
    public readonly UPDATES_TOOLTIP = FlowTooltipsTexts.UPDATE_SELECTOR_TOOLTIP;

    public override readonly form = new FormGroup<IngestTriggerFormType>({
        updatesEnabled: new FormControl<boolean>(false, { nonNullable: true }),
        __typename: new FormControl<MaybeNull<ScheduleType>>({ value: null, disabled: true }, { nonNullable: true }),
        timeDelta: new FormControl<MaybeNull<TimeDeltaFormValue>>({ value: null, disabled: false }),
        cron: new FormControl<MaybeNull<CronExpressionFormValue>>({ value: null, disabled: true }),
    });

    public ngOnInit(): void {
        this.setupFormControlRelationships();
    }

    private setupFormControlRelationships(): void {
        this.updatesEnabled.valueChanges.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((updated: boolean) => {
            if (updated) {
                this.scheduleType.enable();
            } else {
                this.scheduleType.disable();
            }
        });

        this.scheduleType.valueChanges
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe((pollingType: ScheduleType) => {
                if (pollingType === ScheduleType.TIME_DELTA) {
                    this.cronExpression.disable();
                    this.timeDelta.enable();
                } else if (pollingType === ScheduleType.CRON_5_COMPONENT_EXPRESSION) {
                    this.timeDelta.disable();
                    this.cronExpression.enable();
                }
            });
    }

    public get scheduleType(): AbstractControl {
        return this.form.controls.__typename;
    }

    public get timeDelta(): AbstractControl {
        return this.form.controls.timeDelta;
    }

    public get cronExpression(): AbstractControl {
        return this.form.controls.cron;
    }

    public get updatesEnabled(): AbstractControl {
        return this.form.controls.updatesEnabled;
    }
}
