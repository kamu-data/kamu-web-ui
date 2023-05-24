import { Injectable } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { SchemaType } from "../form-components/schema-field/schema-field.component";
import {
    SchemaControlType,
    OrderControlType,
    SourceOrder,
} from "./process-form.service.types";
import { SetPollingSource } from "src/app/api/kamu.graphql.interface";
import { SetPollingSourceSection } from "src/app/shared/shared.types";
import { FetchKind } from "./add-polling-source-form.types";

@Injectable({
    providedIn: "root",
})
export class ProcessFormService {
    public transformForm(formGroup: FormGroup): void {
        this.transformSchema(formGroup);
        this.processFetchOrderControl(formGroup);
        this.removeEmptyControls(formGroup);
        this.processFetchCacheControl(formGroup);
        this.processEventTimeControl(formGroup);
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

    private processFetchCacheControl(formGroup: FormGroup): void {
        const form = formGroup.value as OrderControlType;
        if (form.fetch.cache) {
            form.fetch.cache = { kind: "forever" };
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
        if (form.fetch.order && form.fetch.order === SourceOrder.NONE) {
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
            formGroup.value[SetPollingSourceSection.FETCH].kind !==
                FetchKind.CONTAINER &&
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
