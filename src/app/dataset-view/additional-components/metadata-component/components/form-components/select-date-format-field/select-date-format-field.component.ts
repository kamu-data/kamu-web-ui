/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { ChangeDetectionStrategy, Component, inject, Input, OnInit } from "@angular/core";
import { BaseField } from "../base-field";
import { EventTimeSourceKind } from "../../source-events/add-polling-source/add-polling-source-form.types";
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from "@angular/forms";
import { RxwebValidators, RxReactiveFormsModule } from "@rxweb/reactive-form-validators";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { TypeaheadFieldComponent } from "../typeahead-field/typeahead-field.component";
import { InputFieldComponent } from "../input-field/input-field.component";
import { NgIf } from "@angular/common";
import { TooltipIconComponent } from "../../../../../../common/components/tooltip-icon/tooltip-icon.component";

@Component({
    selector: "app-select-date-format-field",
    templateUrl: "./select-date-format-field.component.html",
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [
        //-----//
        NgIf,
        FormsModule,
        ReactiveFormsModule,
        //-----//
        RxReactiveFormsModule,
        //-----//
        InputFieldComponent,
        TooltipIconComponent,
        TypeaheadFieldComponent,
    ]
})
export class SelectDateFormatFieldComponent extends BaseField implements OnInit {
    @Input({ required: true }) public innerTooltips: Record<string, string>;
    public currentSource: EventTimeSourceKind;
    public EventTimeSourceKind: typeof EventTimeSourceKind = EventTimeSourceKind;
    public readonly KIND_NAME_CONTROL = "kind";
    public readonly PATTERN_NAME_CONTROL = "pattern";
    public readonly PATTERN_TOOLTIP = "Regular expression where first group contains the timestamp string.";
    public readonly TIMESTAMP_TOOLTIP = "Format of the expected timestamp in java.text.SimpleDateFormat form.";
    public readonly TIMESTAMP_FORMAT_NAME_CONTROL = "timestampFormat";
    public readonly FORMATS: string[] = [
        "YYYY-MM-DDTHH:mm:ss.sss",
        "YYYY-MM-DDTHH:mm:ss",
        "YYYY-MM-DD",
        "YYYY-M-DTHH:mm:ss.sss",
        "YYYY-M-DTHH:mm:ss",
        "YYYY-M-D",
    ];

    private fb = inject(FormBuilder);

    public ngOnInit(): void {
        this.chooseEventTimeSource();
    }

    public get eventTimeGroup(): FormGroup {
        return this.form.get(this.controlName) as FormGroup;
    }

    private chooseEventTimeSource(): void {
        this.currentSource = this.eventTimeGroup.get(this.KIND_NAME_CONTROL)?.value as EventTimeSourceKind;
        this.eventTimeGroup
            .get(this.KIND_NAME_CONTROL)
            ?.valueChanges.pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe((kind: EventTimeSourceKind) => {
                if (kind !== EventTimeSourceKind.FROM_PATH) {
                    this.eventTimeGroup.removeControl(this.PATTERN_NAME_CONTROL);
                    this.eventTimeGroup.removeControl(this.TIMESTAMP_FORMAT_NAME_CONTROL);
                }
                if (kind === EventTimeSourceKind.FROM_METADATA) {
                    this.currentSource = EventTimeSourceKind.FROM_METADATA;
                } else if (kind === EventTimeSourceKind.FROM_SYSTEM_TIME) {
                    this.currentSource = EventTimeSourceKind.FROM_SYSTEM_TIME;
                } else {
                    this.currentSource = kind;
                    this.eventTimeGroup.addControl(
                        this.PATTERN_NAME_CONTROL,
                        this.fb.control("", RxwebValidators.required()),
                    );
                    this.eventTimeGroup.addControl(this.TIMESTAMP_FORMAT_NAME_CONTROL, this.fb.control(""));
                }
            });
    }
}
