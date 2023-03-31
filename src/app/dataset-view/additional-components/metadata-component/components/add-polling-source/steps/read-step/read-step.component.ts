import { READ_STEP_RADIO_CONTROLS } from "./../../form-control.source";
/* eslint-disable @typescript-eslint/unbound-method */
import { BaseComponent } from "src/app/common/base.component";
import { ChangeDetectionStrategy, Component, OnInit } from "@angular/core";
import {
    ControlContainer,
    FormBuilder,
    FormGroup,
    FormGroupDirective,
} from "@angular/forms";
import { ReadStep } from "src/app/api/kamu.graphql.interface";
import { SetPollingSourceSection } from "src/app/shared/shared.types";
import {
    ControlType,
    JsonFormControls,
    JsonFormData,
} from "../../add-polling-source-form.types";
import { READ_FORM_DATA } from "./read-form-data";
import { getValidators } from "src/app/common/data.helpers";

@Component({
    selector: "app-read-step",
    templateUrl: "./read-step.component.html",
    styleUrls: ["./read-step.component.sass"],
    changeDetection: ChangeDetectionStrategy.OnPush,
    viewProviders: [
        { provide: ControlContainer, useExisting: FormGroupDirective },
    ],
})
export class ReadStepComponent extends BaseComponent implements OnInit {
    public parentForm: FormGroup;
    public readStepRadioData = READ_STEP_RADIO_CONTROLS;
    public readFormData: JsonFormData = READ_FORM_DATA;
    public controlType: typeof ControlType = ControlType;

    constructor(
        private rootFormGroupDirective: FormGroupDirective,
        private fb: FormBuilder,
    ) {
        super();
    }

    ngOnInit(): void {
        this.parentForm = this.rootFormGroupDirective.form;
        this.initForm("csv");
        this.chooseReadStep();
    }

    public get readForm(): FormGroup {
        return this.parentForm.get(SetPollingSourceSection.READ) as FormGroup;
    }

    public chooseReadStep(): void {
        const subscription = this.readForm
            .get("kind")
            ?.valueChanges.subscribe((kind: string) => {
                Object.keys(this.readForm.value as ReadStep)
                    .filter((key: string) => key !== "kind")
                    .forEach((item: string) =>
                        this.readForm.removeControl(item),
                    );
                this.initForm(kind);
            });
        if (subscription) this.trackSubscription(subscription);
    }

    private initForm(kind: string): void {
        this.readFormData[kind].controls.forEach((item: JsonFormControls) => {
            if (item.type === this.controlType.ARRAY_KEY_VALUE) {
                this.readForm.addControl(item.name, this.fb.array([]));
            } else {
                this.readForm.addControl(
                    item.name,
                    this.fb.control(item.value, getValidators(item.validators)),
                );
            }
        });
    }
}
