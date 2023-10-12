import { Injectable } from "@angular/core";
import { parse } from "yaml";
import {
    EditFormParseType,
    EditFormType,
    FetchKind,
    MergeKind,
    NameValue,
    ReadKind,
} from "./add-polling-source-form.types";
import { SetPollingSourceSection } from "src/app/shared/shared.types";
import { FormArray, FormBuilder, FormControl, FormGroup } from "@angular/forms";
import { RxwebValidators } from "@rxweb/reactive-form-validators";
import { BaseYamlEventService } from "src/app/common/base-yaml-event.service";

@Injectable({
    providedIn: "root",
})
export class EditPollingSourceService extends BaseYamlEventService {
    private readonly PATTERN_CONTROL = "pattern";
    private readonly TIMESTAMP_FORMAT_CONTROL = "timestampFormat";
    private readonly READ_JSON_SUB_PATH_CONTROL = "subPath";

    constructor(private fb: FormBuilder) {
        super();
    }

    public parseEventFromYaml(event: string): EditFormType {
        const editFormParseValue = parse(event) as EditFormParseType;
        return editFormParseValue.content.event;
    }

    public patchFormValues(
        sectionForm: FormGroup,
        editFormValue: EditFormType,
        groupName: SetPollingSourceSection,
    ): void {
        switch (groupName) {
            case SetPollingSourceSection.FETCH: {
                this.patchFetchStep(sectionForm, editFormValue);
                break;
            }
            case SetPollingSourceSection.READ: {
                this.patchReadStep(sectionForm, editFormValue);
                break;
            }
            case SetPollingSourceSection.MERGE: {
                this.patchMergeStep(sectionForm, editFormValue);
                break;
            }
        }
    }

    private patchFetchStep(sectionForm: FormGroup, editFormValue: EditFormType): void {
        this.initFetchCommonControls(sectionForm, editFormValue);
        if (editFormValue.fetch.kind === FetchKind.URL) {
            this.initFetchUrlControls(sectionForm, editFormValue);
        } else if (editFormValue.fetch.kind === FetchKind.CONTAINER) {
            this.initFetchContainerControls(sectionForm, editFormValue);
        }
    }

    private patchReadStep(sectionForm: FormGroup, editFormValue: EditFormType): void {
        if ([ReadKind.JSON, ReadKind.ND_JSON].includes(editFormValue.read.kind)) {
            sectionForm.patchValue({
                ...editFormValue.read,
                jsonKind: editFormValue.read.kind,
                kind: ReadKind.All_JSON,
            });
        }
        if (editFormValue.read.kind === ReadKind.JSON) {
            sectionForm.addControl(this.READ_JSON_SUB_PATH_CONTROL, new FormControl(editFormValue.read.subPath));
        }
        if ([ReadKind.GEO_JSON, ReadKind.ND_GEO_JSON].includes(editFormValue.read.kind)) {
            sectionForm.patchValue({
                kind: ReadKind.ALL_GEO,
                jsonKind: editFormValue.read.kind,
            });
        }
        const schema = sectionForm.controls.schema as FormArray;
        if (!(schema.value as string[]).length && editFormValue.read.schema && editFormValue.read.schema.length) {
            editFormValue.read.schema.forEach((item) => {
                const result = item.split(" ");
                schema.push(
                    this.fb.group({
                        name: [result[0]],
                        type: [result[1]],
                    }),
                );
            });
        }
    }

    private patchMergeStep(sectionForm: FormGroup, editFormValue: EditFormType): void {
        sectionForm.patchValue(editFormValue.merge);
        if (editFormValue.merge.kind !== MergeKind.APPEND) {
            const primaryKey = sectionForm.controls.primaryKey as FormArray;
            editFormValue.merge.primaryKey?.forEach((item) => {
                primaryKey.push(this.fb.control(item));
            });
        }
        if (editFormValue.merge.kind === MergeKind.SNAPSHOT) {
            const compareColumns = sectionForm.controls.compareColumns as FormArray;
            editFormValue.merge.compareColumns?.forEach((item) => {
                compareColumns.push(this.fb.control(item));
            });
        }
    }

    private initFetchCommonControls(sectionForm: FormGroup, editFormValue: EditFormType): void {
        sectionForm.patchValue(editFormValue.fetch);
        const eventTimeGroup = sectionForm.controls.eventTime as FormGroup;
        const pattern = editFormValue.fetch.eventTime?.pattern;
        const timestampFormat = editFormValue.fetch.eventTime?.timestampFormat;
        eventTimeGroup.addControl(this.PATTERN_CONTROL, this.fb.control(pattern));
        eventTimeGroup.addControl(this.TIMESTAMP_FORMAT_CONTROL, this.fb.control(timestampFormat));
    }

    private initFetchUrlControls(sectionForm: FormGroup, editFormValue: EditFormType): void {
        const headers = sectionForm.controls.headers as FormArray;
        if ((headers.value as NameValue[]).length == 0 && editFormValue.fetch.headers) {
            this.initNameValueControl(editFormValue.fetch.headers, headers);
        }
    }

    private initFetchContainerControls(sectionForm: FormGroup, editFormValue: EditFormType): void {
        const env = sectionForm.controls.env as FormArray;
        if (editFormValue.fetch.env) {
            this.initNameValueControl(editFormValue.fetch.env, env);
        }
        const command = sectionForm.controls.command as FormArray;
        editFormValue.fetch.command?.forEach((item) => {
            command.push(this.fb.control(item, RxwebValidators.required()));
        });
        const args = sectionForm.controls.args as FormArray;
        editFormValue.fetch.args?.forEach((item) => {
            args.push(this.fb.control(item, RxwebValidators.required()));
        });
    }

    private initNameValueControl(array: NameValue[], formArray: FormArray): void {
        array.forEach((item) => {
            formArray.push(
                this.fb.group({
                    name: [item.name],
                    value: [item.value],
                }),
            );
        });
    }
}
