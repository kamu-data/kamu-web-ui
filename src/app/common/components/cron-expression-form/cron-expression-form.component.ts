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
    forwardRef,
    Input,
    OnInit,
    Output,
} from "@angular/core";
import {
    ControlValueAccessor,
    FormControl,
    FormGroup,
    NG_VALUE_ACCESSOR,
    Validators,
} from "@angular/forms";
import { BaseComponent } from "../base.component";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { cronExpressionValidator } from "src/app/common/helpers/data.helpers";
import { cronExpressionNextTime } from "src/app/common/helpers/app.helpers";
import { MaybeNull } from "src/app/interface/app.types";
import { CronExpressionFormType, CronExpressionFormValue } from "./cron-expression-form.value";

@Component({
    selector: "app-cron-expression-form",
    templateUrl: "./cron-expression-form.component.html",
    styleUrls: ["./cron-expression-form.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => CronExpressionFormComponent),
            multi: true,
        },
    ],
})
export class CronExpressionFormComponent extends BaseComponent implements OnInit, ControlValueAccessor {
    @Input() public disabled: boolean = false;
    @Input() public label: string = "Cron expression :";
    @Input() public placeholder: string = "Example: * * * * ?";
    @Input() public showHelpText: boolean = true;
    @Output() public formChange = new EventEmitter<FormGroup<CronExpressionFormType>>();

    public cronExpressionForm = new FormGroup<CronExpressionFormType>({
        cronExpression: new FormControl<MaybeNull<string>>({ value: "", disabled: this.disabled }, [
            Validators.required,
            cronExpressionValidator(),
        ]),
    });

    private onChange = (_value: CronExpressionFormValue) => {};
    private onTouched = () => {};

    public ngOnInit(): void {
        this.subscribeToFormChanges();
    }

    public writeValue(value: CronExpressionFormValue): void {
        if (value) {
            this.cronExpressionForm.patchValue(value, { emitEvent: false });
        }
    }

    public registerOnChange(fn: (value: CronExpressionFormValue) => void): void {
        this.onChange = fn;
    }

    public registerOnTouched(fn: () => void): void {
        this.onTouched = fn;
    }

    public setDisabledState(isDisabled: boolean): void {
        this.disabled = isDisabled;
        if (isDisabled) {
            this.cronExpressionForm.disable();
        } else {
            this.cronExpressionForm.enable();
        }
    }

    public get cronExpressionControl(): FormControl<MaybeNull<string>> {
        return this.cronExpressionForm.controls.cronExpression;
    }

    public get nextTime(): string {
        return cronExpressionNextTime(this.cronExpressionControl.value as string);
    }

    private subscribeToFormChanges(): void {
        this.cronExpressionForm.valueChanges.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((value) => {
            this.onChange(value as CronExpressionFormValue);
            this.formChange.emit(this.cronExpressionForm);
        });

        this.cronExpressionForm.statusChanges.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => {
            this.onTouched();
        });
    }
}
