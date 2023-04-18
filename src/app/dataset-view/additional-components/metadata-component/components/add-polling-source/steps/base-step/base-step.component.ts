/* eslint-disable @typescript-eslint/unbound-method */
import { BaseComponent } from "src/app/common/base.component";
import { ControlType, JsonFormData } from "../../add-polling-source-form.types";
import { RadioControlType } from "../../form-control.source";
import { FetchStep } from "../../../../../../../api/kamu.graphql.interface";
import { FormBuilder } from "@angular/forms";
import { ControlContainer, FormGroupDirective } from "@angular/forms";
import {
    ChangeDetectionStrategy,
    Component,
    Input,
    OnInit,
} from "@angular/core";
import { FormGroup } from "@angular/forms";
import { JsonFormControls } from "../../add-polling-source-form.types";
import { getValidators } from "src/app/common/data.helpers";

@Component({
    selector: "app-base-step",
    templateUrl: "./base-step.component.html",
    styleUrls: ["./base-step.component.sass"],
    changeDetection: ChangeDetectionStrategy.OnPush,
    viewProviders: [
        { provide: ControlContainer, useExisting: FormGroupDirective },
    ],
})
export class BaseStepComponent extends BaseComponent implements OnInit {
    public parentForm: FormGroup;
    @Input() public sectionStepRadioData: RadioControlType[];
    @Input() public sectionFormData: JsonFormData;
    @Input() public defaultKind: string;
    @Input() public groupName: string;
    @Input() public title: string;
    public controlType: typeof ControlType = ControlType;
    public readonly kindNameControl = "kind";
    private readonly defaultEventTimeSource = "fromMetadata";
    constructor(
        private rootFormGroupDirective: FormGroupDirective,
        private fb: FormBuilder,
    ) {
        super();
    }

    ngOnInit(): void {
        this.parentForm = this.rootFormGroupDirective.form;
        this.initForm(this.defaultKind);
        this.chooseFetchKind();
    }

    public get sectionForm(): FormGroup {
        return this.parentForm.get(this.groupName) as FormGroup;
    }

    public chooseFetchKind(): void {
        const subscription = this.sectionForm
            .get(this.kindNameControl)
            ?.valueChanges.subscribe((kind: string) => {
                Object.keys(this.sectionForm.value as FetchStep)
                    .filter((key: string) => key !== this.kindNameControl)
                    .forEach((item: string) =>
                        this.sectionForm.removeControl(item),
                    );
                this.initForm(kind);
                this.sectionForm.updateValueAndValidity();
            });
        if (subscription) this.trackSubscription(subscription);
    }

    private initForm(kind: string): void {
        this.sectionFormData[kind].controls.forEach(
            (item: JsonFormControls) => {
                if (
                    item.type === this.controlType.ARRAY_KEY_VALUE ||
                    item.type === this.controlType.ARRAY_KEY ||
                    item.type === this.controlType.SCHEMA
                ) {
                    this.sectionForm.addControl(item.name, this.fb.array([]));
                } else if (item.type === this.controlType.EVENT_TIME) {
                    this.sectionForm.addControl(
                        item.name,
                        this.fb.group({
                            kind: [this.defaultEventTimeSource],
                        }),
                    );
                } else {
                    this.sectionForm.addControl(
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
