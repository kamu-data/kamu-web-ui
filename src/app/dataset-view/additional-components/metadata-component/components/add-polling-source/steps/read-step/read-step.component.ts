/* eslint-disable @typescript-eslint/unbound-method */
import { BaseComponent } from "src/app/common/base.component";
import { ChangeDetectionStrategy, Component, OnInit } from "@angular/core";
import {
    ControlContainer,
    FormBuilder,
    FormGroup,
    FormGroupDirective,
} from "@angular/forms";
import { readStepRadioControls } from "../../form-control.source";
import { ReadStep } from "src/app/api/kamu.graphql.interface";

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
    public readStepRadioData = readStepRadioControls;

    constructor(
        private rootFormGroupDirective: FormGroupDirective,
        private fb: FormBuilder,
    ) {
        super();
    }

    ngOnInit(): void {
        this.parentForm = this.rootFormGroupDirective.form;
        this.initCsvReadStep();
        this.chooseReadStep();
    }

    public get readForm(): FormGroup {
        return this.parentForm.get("read") as FormGroup;
    }

    private chooseReadStep(): void {
        const subscription = this.readForm
            .get("kind")
            ?.valueChanges.subscribe((kind: string) => {
                Object.keys(this.readForm.value as ReadStep)
                    .filter((key: string) => key !== "kind")
                    .forEach((item: string) =>
                        this.readForm.removeControl(item),
                    );
                switch (kind) {
                    case "csv": {
                        this.initCsvReadStep();
                        break;
                    }
                    case "jsonLines": {
                        this.initJsonLinesReadStep();
                        break;
                    }
                    case "geoJson": {
                        break;
                    }
                    case "esriShapefile": {
                        break;
                    }
                    case "parquet": {
                        break;
                    }
                }
            });

        if (subscription) this.trackSubscription(subscription);
    }

    private initCsvReadStep(): void {
        this.readForm.addControl("separator", this.fb.control(""));
        this.readForm.addControl("encoding", this.fb.control(""));
        this.readForm.addControl("quote", this.fb.control(""));
        this.readForm.addControl("header", this.fb.control(false));
    }

    private initJsonLinesReadStep(): void {
        this.readForm.addControl("dateFormat", this.fb.control(""));
    }
}
