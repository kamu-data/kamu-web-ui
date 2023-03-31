import { ReadKind } from "./../../add-polling-source-form.types";
import { READ_STEP_RADIO_CONTROLS } from "./../../form-control.source";
/* eslint-disable @typescript-eslint/unbound-method */
import { ChangeDetectionStrategy, Component, OnInit } from "@angular/core";
import {
    ControlContainer,
    FormBuilder,
    FormGroup,
    FormGroupDirective,
} from "@angular/forms";
import { ReadStep } from "src/app/api/kamu.graphql.interface";
import { SetPollingSourceSection } from "src/app/shared/shared.types";
import { JsonFormControls } from "../../add-polling-source-form.types";
import { READ_FORM_DATA } from "./read-form-data";
import { getValidators } from "src/app/common/data.helpers";
import { BaseStep } from "../base-step";

@Component({
    selector: "app-read-step",
    templateUrl: "./read-step.component.html",
    styleUrls: ["./read-step.component.sass"],
    changeDetection: ChangeDetectionStrategy.OnPush,
    viewProviders: [
        { provide: ControlContainer, useExisting: FormGroupDirective },
    ],
})
export class ReadStepComponent extends BaseStep implements OnInit {
    constructor(
        private rootFormGroupDirective: FormGroupDirective,
        private fb: FormBuilder,
    ) {
        super();
    }

    ngOnInit(): void {
        this.parentForm = this.rootFormGroupDirective.form;
        this.initStep();
        this.initForm(this.defaultKind);
        this.chooseReadKind();
    }

    public get readForm(): FormGroup {
        return this.parentForm.get(SetPollingSourceSection.READ) as FormGroup;
    }

    public chooseReadKind(): void {
        const subscription = this.readForm
            .get(this.kindNameControl)
            ?.valueChanges.subscribe((kind: string) => {
                Object.keys(this.readForm.value as ReadStep)
                    .filter((key: string) => key !== this.kindNameControl)
                    .forEach((item: string) =>
                        this.readForm.removeControl(item),
                    );
                this.initForm(kind);
            });
        if (subscription) this.trackSubscription(subscription);
    }

    private initStep(): void {
        this.parentForm = this.rootFormGroupDirective.form;
        this.sectionStepRadioData = READ_STEP_RADIO_CONTROLS;
        this.sectionFormData = READ_FORM_DATA;
        this.defaultKind = ReadKind.CSV;
    }

    private initForm(kind: string): void {
        this.sectionFormData[kind].controls.forEach(
            (item: JsonFormControls) => {
                if (item.type === this.controlType.ARRAY_KEY_VALUE) {
                    this.readForm.addControl(item.name, this.fb.array([]));
                } else {
                    this.readForm.addControl(
                        item.name,
                        this.fb.control(
                            item.value,
                            getValidators(item.validators),
                        ),
                    );
                }
            },
        );
    }
}
