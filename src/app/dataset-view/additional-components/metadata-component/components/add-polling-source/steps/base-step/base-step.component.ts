import { BaseComponent } from "src/app/common/base.component";
import { ControlType, JsonFormData } from "../../add-polling-source-form.types";
import { RadioControlType } from "../../form-control.source";
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
    public readonly KIND_NAME_CONTROL = "kind";
    public readonly SCHEMA_NAME_CONTROL = "schema";
    private readonly DEFAULT_EVENT_TIME_SOURCE = "fromMetadata";

    constructor(
        private rootFormGroupDirective: FormGroupDirective,
        private fb: FormBuilder,
    ) {
        super();
    }

    ngOnInit(): void {
        this.parentForm = this.rootFormGroupDirective.form;
        this.initForm(
            this.sectionForm.get(this.KIND_NAME_CONTROL)?.value as string,
        );
        this.chooseFetchKind();
    }

    public get sectionForm(): FormGroup {
        return this.parentForm.get(this.groupName) as FormGroup;
    }

    private chooseFetchKind(): void {
        const subscription = this.sectionForm
            .get(this.KIND_NAME_CONTROL)
            ?.valueChanges.subscribe((kind: string) => {
                Object.keys(this.sectionForm.value as object)
                    .filter(
                        (key: string) =>
                            ![
                                this.KIND_NAME_CONTROL,
                                this.SCHEMA_NAME_CONTROL,
                            ].includes(key),
                    )
                    .forEach((item: string) => {
                        this.sectionForm.removeControl(item);
                    });
                this.initForm(kind);
            });
        if (subscription) this.trackSubscription(subscription);
    }

    private isArrayControl(type: ControlType): boolean {
        return [
            this.controlType.ARRAY_KEY_VALUE,
            this.controlType.ARRAY_KEY,
            this.controlType.SCHEMA,
        ].includes(type);
    }

    private initForm(kind: string): void {
        this.sectionFormData[kind].controls.forEach(
            (item: JsonFormControls) => {
                if (this.isArrayControl(item.type)) {
                    this.sectionForm.addControl(item.name, this.fb.array([]));
                } else if (item.type === this.controlType.EVENT_TIME) {
                    this.sectionForm.addControl(
                        item.name,
                        this.fb.group({
                            kind: [this.DEFAULT_EVENT_TIME_SOURCE],
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