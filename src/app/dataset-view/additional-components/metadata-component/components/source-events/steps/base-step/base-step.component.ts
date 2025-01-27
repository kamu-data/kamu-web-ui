import { BaseComponent } from "src/app/common/components/base.component";
import {
    ControlType,
    AddPollingSourceEditFormType,
    EventTimeSourceKind,
    JsonFormData,
} from "../../add-polling-source/add-polling-source-form.types";
import { RadioControlType } from "../../add-polling-source/form-control.source";
import { FormBuilder } from "@angular/forms";
import { ControlContainer, FormGroupDirective } from "@angular/forms";
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, Input, OnInit } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { JsonFormControl } from "../../add-polling-source/add-polling-source-form.types";
import { getValidators } from "src/app/common/helpers/data.helpers";
import { EditPollingSourceService } from "../../add-polling-source/edit-polling-source.service";
import { MaybeNull } from "src/app/common/types/app.types";
import { SourcesSection } from "../../add-polling-source/process-form.service.types";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";

@Component({
    selector: "app-base-step",
    templateUrl: "./base-step.component.html",
    changeDetection: ChangeDetectionStrategy.OnPush,
    viewProviders: [{ provide: ControlContainer, useExisting: FormGroupDirective }],
})
export class BaseStepComponent extends BaseComponent implements OnInit {
    public parentForm: FormGroup;
    @Input({ required: true }) public sectionStepRadioData: RadioControlType[];
    @Input({ required: true }) public sectionFormData: JsonFormData;
    @Input({ required: true }) public defaultKind: string;
    @Input({ required: true }) public description: string;
    @Input({ required: true }) public sectionName: SourcesSection;
    @Input({ required: true }) public eventYamlByHash: MaybeNull<string> = null;
    private editFormValue: AddPollingSourceEditFormType;
    public controlType: typeof ControlType = ControlType;
    public readonly KIND_NAME_CONTROL = "kind";
    public readonly SCHEMA_NAME_CONTROL = "schema";
    private readonly DEFAULT_EVENT_TIME_SOURCE = EventTimeSourceKind.FROM_METADATA;
    private readonly EVENT_TIME_CONTROL = "eventTime";
    private readonly JSON_KIND_CONTROL = "jsonKind";

    private rootFormGroupDirective = inject(FormGroupDirective);
    private fb = inject(FormBuilder);
    private cdr = inject(ChangeDetectorRef);
    private editService = inject(EditPollingSourceService);

    public get sectionForm(): FormGroup {
        return this.parentForm.get(this.sectionName) as FormGroup;
    }

    ngOnInit(): void {
        this.parentForm = this.rootFormGroupDirective.form;
        this.initForm(this.sectionForm.get(this.KIND_NAME_CONTROL)?.value as string);
        this.chooseFetchKind();
        this.initEditForm();
        this.cdr.detectChanges();
    }

    private initEditForm(): void {
        if (this.eventYamlByHash) {
            this.editFormValue = this.editService.parseEventFromYaml(this.eventYamlByHash);
            this.editService.patchFormValues(this.sectionForm, this.editFormValue, this.sectionName);
        }
    }

    private chooseFetchKind(): void {
        this.sectionForm
            .get(this.KIND_NAME_CONTROL)
            ?.valueChanges.pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe((kind: string) => {
                Object.keys(this.sectionForm.value as object)
                    .filter((key: string) => ![this.KIND_NAME_CONTROL, this.SCHEMA_NAME_CONTROL].includes(key))
                    .forEach((item: string) => {
                        if (item !== this.EVENT_TIME_CONTROL) this.sectionForm.removeControl(item);
                    });
                if (this.sectionForm.contains(this.JSON_KIND_CONTROL)) {
                    this.sectionForm.removeControl(this.JSON_KIND_CONTROL);
                }
                this.initForm(kind);
            });
    }

    private isArrayControl(type: ControlType): boolean {
        return [this.controlType.ARRAY_KEY_VALUE, this.controlType.ARRAY_KEY, this.controlType.SCHEMA].includes(type);
    }

    private initForm(kind: string): void {
        this.sectionFormData[kind].controls.forEach((item: JsonFormControl) => {
            if (this.isArrayControl(item.type)) {
                this.sectionForm.addControl(item.name, this.fb.array([]));
            } else if (item.type === this.controlType.EVENT_TIME) {
                this.sectionForm.addControl(
                    item.name,
                    this.fb.group({
                        kind: [this.DEFAULT_EVENT_TIME_SOURCE],
                    }),
                );
            } else if (item.type === this.controlType.TOPICS) {
                this.sectionForm.addControl(item.name, this.fb.array([], getValidators(item.validators)));
            } else {
                this.sectionForm.addControl(item.name, this.fb.control(item.value, getValidators(item.validators)));
            }
        });
    }
}
