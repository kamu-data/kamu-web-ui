import { Injectable } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { SchemaType } from "../form-components/schema-field/schema-field.component";
import {
    SchemaControlType,
    OrderControlType,
} from "./process-form.service.types";
import { SetPollingSource } from "src/app/api/kamu.graphql.interface";
import { SetPollingSourceSection } from "src/app/shared/shared.types";

@Injectable({
    providedIn: "root",
})
export class ProcessFormService {
    public transformForm(formGroup: FormGroup): void {
        this.transformSchema(formGroup);
        this.processFetchOrderControl(formGroup);
        this.removeEmptyControls(formGroup);
    }

    private transformSchema(formGroup: FormGroup): void {
        const form = formGroup.value as SchemaControlType;
        if (form.read.schema) {
            form.read.schema = (form.read.schema as SchemaType[]).map(
                (item) => {
                    return `${this.processSchemaName(item.name.trim())} ${
                        item.type
                    }`;
                },
            );
        }
    }

    private processFetchOrderControl(formGroup: FormGroup): void {
        const form = formGroup.value as OrderControlType;
        if (form.fetch.order && form.fetch.order === "none") {
            delete form.fetch.order;
        }
    }

    private removeEmptyControls(formGroup: FormGroup): void {
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
            !formGroup.value[SetPollingSourceSection.FETCH].eventTime
                .timestampFormat
        ) {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
            delete formGroup.value[SetPollingSourceSection.FETCH].eventTime
                .timestampFormat;
        }
    }
    
    private processSchemaName(name: string): string {
        return /\s/.test(name) ? `\`${name}\`` : name;
    }
}
