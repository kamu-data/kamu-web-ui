import { FetchKind } from "./../../add-polling-source-form.types";
import { FETCH_STEP_RADIO_CONTROLS } from "./../../form-control.source";
import { FetchStep } from "./../../../../../../../api/kamu.graphql.interface";
/* eslint-disable @typescript-eslint/unbound-method */
import { FormBuilder } from "@angular/forms";
import { ControlContainer, FormGroupDirective } from "@angular/forms";
import { ChangeDetectionStrategy, Component, OnInit } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { JsonFormControls } from "../../add-polling-source-form.types";
import { FETCH_FORM_DATA } from "./fetch-form-data";
import { SetPollingSourceSection } from "src/app/shared/shared.types";
import { getValidators } from "src/app/common/data.helpers";
import { BaseStep } from "../base-step";

@Component({
    selector: "app-fetch-step",
    templateUrl: "./fetch-step.component.html",
    styleUrls: ["./fetch-step.component.sass"],
    changeDetection: ChangeDetectionStrategy.OnPush,
    viewProviders: [
        { provide: ControlContainer, useExisting: FormGroupDirective },
    ],
})
export class FetchStepComponent extends BaseStep implements OnInit {
    constructor(
        private rootFormGroupDirective: FormGroupDirective,
        private fb: FormBuilder,
    ) {
        super();
    }

    ngOnInit(): void {
        this.initStep();
        this.initForm(this.defaultKind);
        this.chooseFetchKind();
    }

    public get fetchForm(): FormGroup {
        return this.parentForm.get(SetPollingSourceSection.FETCH) as FormGroup;
    }

    public chooseFetchKind(): void {
        const subscription = this.fetchForm
            .get(this.kindNameControl)
            ?.valueChanges.subscribe((kind: string) => {
                Object.keys(this.fetchForm.value as FetchStep)
                    .filter((key: string) => key !== this.kindNameControl)
                    .forEach((item: string) =>
                        this.fetchForm.removeControl(item),
                    );
                this.initForm(kind);
            });
        if (subscription) this.trackSubscription(subscription);
    }

    private initStep(): void {
        this.parentForm = this.rootFormGroupDirective.form;
        this.sectionStepRadioData = FETCH_STEP_RADIO_CONTROLS;
        this.sectionFormData = FETCH_FORM_DATA;
        this.defaultKind = FetchKind.URL;
    }

    private initForm(kind: string): void {
        this.sectionFormData[kind].controls.forEach(
            (item: JsonFormControls) => {
                if (item.type === this.controlType.ARRAY_KEY_VALUE) {
                    this.fetchForm.addControl(item.name, this.fb.array([]));
                } else {
                    this.fetchForm.addControl(
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
