/* eslint-disable @typescript-eslint/unbound-method */
import { BaseComponent } from "src/app/common/base.component";
import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    OnInit,
} from "@angular/core";
import {
    ControlContainer,
    FormBuilder,
    FormGroup,
    FormGroupDirective,
    Validators,
} from "@angular/forms";
import { mergeStepRadioControls } from "../../form-control.source";
import { AppDatasetCreateService } from "src/app/dataset-create/dataset-create.service";
import { MergeStrategy } from "src/app/api/kamu.graphql.interface";
import { SetPollingSourceSection } from "src/app/shared/shared.types";
import { getValidators } from "src/app/common/data.helpers";
import {
    JsonFormData,
    JsonFormControls,
    ControlType,
} from "../../add-polling-source-form.types";
import { MERGE_FORM_DATA } from "./merge-form-data";

@Component({
    selector: "app-merge-step",
    templateUrl: "./merge-step.component.html",
    styleUrls: ["./merge-step.component.sass"],
    changeDetection: ChangeDetectionStrategy.OnPush,
    viewProviders: [
        { provide: ControlContainer, useExisting: FormGroupDirective },
    ],
})
export class MergeStepComponent extends BaseComponent implements OnInit {
    public parentForm: FormGroup;
    public mergeStepRadioData = mergeStepRadioControls;
    public errorMessage = "";
    public mergeFormData: JsonFormData = MERGE_FORM_DATA;
    public controlType: typeof ControlType = ControlType;

    constructor(
        private rootFormGroupDirective: FormGroupDirective,
        private fb: FormBuilder,
        private createDatasetService: AppDatasetCreateService,
        private cdr: ChangeDetectorRef,
    ) {
        super();
    }

    public get mergeForm(): FormGroup {
        return this.parentForm.get(SetPollingSourceSection.MERGE) as FormGroup;
    }
    ngOnInit(): void {
        this.parentForm = this.rootFormGroupDirective.form;
        this.initForm("append");
        this.chooseMergeStep();
    }

    public chooseMergeStep(): void {
        const subscription = this.mergeForm
            .get("kind")
            ?.valueChanges.subscribe((kind: string) => {
                Object.keys(this.mergeForm.value as MergeStrategy)
                    .filter((key: string) => key !== "kind")
                    .forEach((item: string) =>
                        this.mergeForm.removeControl(item),
                    );
                this.initForm(kind);
            });
        if (subscription) this.trackSubscription(subscription);
    }

    private initForm(kind: string): void {
        this.mergeFormData[kind].controls.forEach((item: JsonFormControls) => {
            if (item.type === this.controlType.ARRAY_KEY) {
                this.mergeForm.addControl(item.name, this.fb.array([]));
            } else {
                this.mergeForm.addControl(
                    item.name,
                    this.fb.control(item.value, getValidators(item.validators)),
                );
            }
        });
    }
}
