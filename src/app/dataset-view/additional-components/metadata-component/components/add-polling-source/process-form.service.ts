import { Injectable } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { SchemaType } from "../form-components/schema-field/schema-field.component";
import {
    SchemaControlType,
    OrderControlType,
} from "./process-form.service.types";

@Injectable({
    providedIn: "root",
})
export class ProcessFormService {
    public transformForm(formGroup: FormGroup): void {
        this.transformSchema(formGroup);
        this.processFetchOrderControl(formGroup);
    }

    private transformSchema(formGroup: FormGroup): void {
        const form = formGroup.value as SchemaControlType;
        form.read.schema = (form.read.schema as SchemaType[]).map((item) => {
            return `${item.name} ${item.type}`;
        });
    }

    private processFetchOrderControl(formGroup: FormGroup): void {
        const form = formGroup.value as OrderControlType;
        if (form.fetch.order && form.fetch.order === "none") {
            delete form.fetch.order;
        }
    }
}
