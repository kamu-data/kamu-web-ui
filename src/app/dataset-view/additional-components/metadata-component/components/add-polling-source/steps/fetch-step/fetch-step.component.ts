import { ControlType } from "./../../add-polling-source-form.types";

import { RadioControlType } from "./../../form-control.source";
import { FetchStep } from "./../../../../../../../api/kamu.graphql.interface";
/* eslint-disable @typescript-eslint/unbound-method */
import { BaseComponent } from "src/app/common/base.component";
import { FormBuilder } from "@angular/forms";
import { ControlContainer, FormGroupDirective } from "@angular/forms";
import { ChangeDetectionStrategy, Component, OnInit } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { fetchStepRadioControls } from "../../form-control.source";
import {
    JsonFormControls,
    JsonFormData,
} from "../../add-polling-source-form.types";
import { FETCH_FORM_DATA } from "./fetch-form-data";
import { SetPollingSourceSection } from "src/app/shared/shared.types";
import { getValidators } from "src/app/common/data.helpers";

@Component({
    selector: "app-fetch-step",
    templateUrl: "./fetch-step.component.html",
    styleUrls: ["./fetch-step.component.sass"],
    changeDetection: ChangeDetectionStrategy.OnPush,
    viewProviders: [
        { provide: ControlContainer, useExisting: FormGroupDirective },
    ],
})
export class FetchStepComponent extends BaseComponent implements OnInit {
    public parentForm: FormGroup;
    public fetchStepRadioData: RadioControlType[] = fetchStepRadioControls;
    public fetchFormData: JsonFormData = FETCH_FORM_DATA;
    public controlType: typeof ControlType = ControlType;

    constructor(
        private rootFormGroupDirective: FormGroupDirective,
        private fb: FormBuilder,
    ) {
        super();
    }

    ngOnInit(): void {
        this.parentForm = this.rootFormGroupDirective.form;
        this.initForm("url");
        this.chooseFetchStep();
    }

    public get fetchForm(): FormGroup {
        return this.parentForm.get(SetPollingSourceSection.FETCH) as FormGroup;
    }

    public chooseFetchStep(): void {
        const subscription = this.fetchForm
            .get("kind")
            ?.valueChanges.subscribe((kind: string) => {
                Object.keys(this.fetchForm.value as FetchStep)
                    .filter((key: string) => key !== "kind")
                    .forEach((item: string) =>
                        this.fetchForm.removeControl(item),
                    );
                this.initForm(kind);
            });
        if (subscription) this.trackSubscription(subscription);
    }

    private initForm(kind: string): void {
        this.fetchFormData[kind].controls.forEach((item: JsonFormControls) => {
            if (item.type === this.controlType.ARRAY_KEY_VALUE) {
                this.fetchForm.addControl(item.name, this.fb.array([]));
            } else {
                this.fetchForm.addControl(
                    item.name,
                    this.fb.control(item.value, getValidators(item.validators)),
                );
            }
        });
    }
}
