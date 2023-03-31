import { MergeKind } from "./../../add-polling-source-form.types";
import { MERGE_STEP_RADIO_CONTROLS } from "./../../form-control.source";
/* eslint-disable @typescript-eslint/unbound-method */
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
} from "@angular/forms";
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
import { BaseStep } from "../base-step";

@Component({
    selector: "app-merge-step",
    templateUrl: "./merge-step.component.html",
    styleUrls: ["./merge-step.component.sass"],
    changeDetection: ChangeDetectionStrategy.OnPush,
    viewProviders: [
        { provide: ControlContainer, useExisting: FormGroupDirective },
    ],
})
export class MergeStepComponent extends BaseStep implements OnInit {
    public parentForm: FormGroup;
    public mergeStepRadioData = MERGE_STEP_RADIO_CONTROLS;
    public mergeFormData: JsonFormData = MERGE_FORM_DATA;
    public controlType: typeof ControlType = ControlType;
    public errorMessage = "";

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
        this.initStep();
        this.initForm(this.defaultKind);
        this.chooseMergeKind();
        this.trackSubscription(
            this.createDatasetService.onErrorCommitEventChanges.subscribe(
                (message: string) => {
                    this.errorMessage = message;
                    this.cdr.detectChanges();
                },
            ),
        );
    }

    public chooseMergeKind(): void {
        const subscription = this.mergeForm
            .get(this.kindNameControl)
            ?.valueChanges.subscribe((kind: string) => {
                Object.keys(this.mergeForm.value as MergeStrategy)
                    .filter((key: string) => key !== this.kindNameControl)
                    .forEach((item: string) =>
                        this.mergeForm.removeControl(item),
                    );
                this.initForm(kind);
            });
        if (subscription) this.trackSubscription(subscription);
    }

    private initStep(): void {
        this.parentForm = this.rootFormGroupDirective.form;
        this.sectionStepRadioData = MERGE_STEP_RADIO_CONTROLS;
        this.sectionFormData = MERGE_FORM_DATA;
        this.defaultKind = MergeKind.APPEND;
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
