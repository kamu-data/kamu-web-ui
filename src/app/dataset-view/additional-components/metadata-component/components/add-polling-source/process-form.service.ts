import { Injectable } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { SchemaType } from "../form-components/schema-field/schema-field.component";
import { SchemaControlType, OrderControlType, SourceOrder } from "./process-form.service.types";
import { AddPushSource, SetPollingSource } from "src/app/api/kamu.graphql.interface";
import { SetPollingSourceSection } from "src/app/shared/shared.types";
import { AddPollingSourceEditFormType, FetchKind, PrepareKind } from "./add-polling-source-form.types";
import AppValues from "src/app/common/app.values";
import { has } from "lodash";

@Injectable({
    providedIn: "root",
})
export class ProcessFormService {
    public transformForm(formGroup: FormGroup): void {
        this.transformSchema(formGroup);
        if (has(formGroup.value, "fetch")) {
            this.processFetchOrderControl(formGroup);
            this.processEventTimeControl(formGroup);
            this.processPipeCommandControl(formGroup);
        }
        this.removeEmptyControls(formGroup);
        this.processEmptyPrepareStep(formGroup);
    }

    private transformSchema(formGroup: FormGroup): void {
        const form = formGroup.value as SchemaControlType;
        if (form.read.schema?.length && typeof form.read.schema[0] !== "string") {
            form.read.schema = (form.read.schema as SchemaType[]).map((item) => {
                return `${this.processSchemaName(item.name.trim())} ${item.type}`;
            });
        }
    }

    private processPipeCommandControl(formGroup: FormGroup): void {
        const form = formGroup.value as AddPollingSourceEditFormType;
        if (form.prepare && form.prepare.length > 0) {
            form.prepare.map((item) => {
                if (item.kind === PrepareKind.PIPE && typeof item.command === "string") {
                    item.command = item.command.trim().match(AppValues.SPLIT_ARGUMENTS_PATTERN) as string[];
                }
                if (item.kind === PrepareKind.DECOMPRESS && !item.subPath) {
                    delete item.subPath;
                }
            });
        }
    }

    private processEmptyPrepareStep(formGroup: FormGroup): void {
        const form = formGroup.value as AddPollingSourceEditFormType;
        if (form.prepare && !form.prepare.length) {
            delete form.prepare;
        }
    }

    private processEventTimeControl(formGroup: FormGroup): void {
        const form = formGroup.value as OrderControlType;
        if (form.fetch.eventTime && form.fetch.kind === "container") {
            delete form.fetch.eventTime;
        }
    }

    private processFetchOrderControl(formGroup: FormGroup): void {
        const form = formGroup.value as OrderControlType;
        if (form.fetch.order === SourceOrder.NONE) {
            delete form.fetch.order;
        }
    }

    private removeEmptyControls(formGroup: FormGroup): void {
        if (has(formGroup.value, "fetch")) {
            const form = formGroup.value as SetPollingSource;
            type FormKeys =
                | SetPollingSourceSection.READ
                | SetPollingSourceSection.MERGE
                | SetPollingSourceSection.FETCH;
            const formKeys: FormKeys[] = [
                SetPollingSourceSection.READ,
                SetPollingSourceSection.MERGE,
                SetPollingSourceSection.FETCH,
            ];
            formKeys.forEach((formKey: FormKeys) => {
                Object.entries(form[formKey]).forEach(([key, value]) => {
                    if (!value || (Array.isArray(value) && !value.length)) {
                        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-dynamic-delete
                        delete formGroup.value[formKey][key];
                    }
                });
            });

            if (
                // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
                formGroup.value[SetPollingSourceSection.FETCH].kind !== FetchKind.CONTAINER &&
                // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
                !formGroup.value[SetPollingSourceSection.FETCH].eventTime.timestampFormat
            ) {
                // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
                delete formGroup.value[SetPollingSourceSection.FETCH].eventTime.timestampFormat;
            }
        } else {
            const form = formGroup.value as AddPushSource;
            type FormKeys = SetPollingSourceSection.READ | SetPollingSourceSection.MERGE;
            const formKeys: FormKeys[] = [SetPollingSourceSection.READ, SetPollingSourceSection.MERGE];
            formKeys.forEach((formKey: FormKeys) => {
                Object.entries(form[formKey]).forEach(([key, value]) => {
                    if (!value || (Array.isArray(value) && !value.length)) {
                        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-dynamic-delete
                        delete formGroup.value[formKey][key];
                    }
                });
            });
        }
    }

    private processSchemaName(name: string): string {
        return /\s/.test(name) ? `\`${name}\`` : name;
    }
}
