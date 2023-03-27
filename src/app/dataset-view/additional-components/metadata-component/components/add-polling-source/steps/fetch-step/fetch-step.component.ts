import { FetchStep } from "./../../../../../../../api/kamu.graphql.interface";
/* eslint-disable @typescript-eslint/unbound-method */
import { BaseComponent } from "src/app/common/base.component";
import { FormArray, FormBuilder, Validators } from "@angular/forms";
import { ControlContainer, FormGroupDirective } from "@angular/forms";
import { ChangeDetectionStrategy, Component, OnInit } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { fetchStepRadioControls } from "../../form-control.source";
import AppValues from "src/app/common/app.values";

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
    public fetchStepRadioData = fetchStepRadioControls;

    constructor(
        private rootFormGroupDirective: FormGroupDirective,
        private fb: FormBuilder,
    ) {
        super();
    }

    ngOnInit(): void {
        this.parentForm = this.rootFormGroupDirective.form;
        this.initUrlFetchStep();
        this.chooseFetchStep();
    }

    public get headersForm(): FormGroup {
        return this.fb.group({
            name: [null],
            value: [null],
        });
    }

    public get fetchForm(): FormGroup {
        return this.parentForm.get("fetch") as FormGroup;
    }

    public get headers(): FormArray {
        return this.fetchForm.get("headers") as FormArray;
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

                switch (kind) {
                    case "url": {
                        this.initUrlFetchStep();
                        break;
                    }
                    case "filesGlob": {
                        this.initFilesGlobFetchStep();
                        break;
                    }
                    case "container": {
                        this.initContainerFetchStep();
                        break;
                    }
                }
            });
        if (subscription) this.trackSubscription(subscription);
    }

    public addHeader(): void {
        this.headers.push(this.headersForm);
    }

    public removeHeader(index: number): void {
        this.headers.removeAt(index);
    }

    private initUrlFetchStep(): void {
        this.fetchForm.addControl(
            "url",
            this.fb.control("", [
                Validators.required,
                Validators.pattern(AppValues.URL_PATTERN),
            ]),
        );
        this.fetchForm.addControl("headers", this.fb.array([]));
    }

    private initFilesGlobFetchStep(): void {
        this.fetchForm.addControl(
            "path",
            this.fb.control("", [Validators.required]),
        );
    }

    private initContainerFetchStep(): void {
        this.fetchForm.addControl(
            "image",
            this.fb.control("", [Validators.required]),
        );
    }
}
