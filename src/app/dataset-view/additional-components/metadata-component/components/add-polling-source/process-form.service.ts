/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Injectable } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { SchemaType } from "../form-components/schema-field/schema-field.component";

@Injectable({
    providedIn: "root",
})
export class ProcessFormService {
    public transformSchema(formGroup: FormGroup): void {
        const form = formGroup.value;
        if (form.read.schema) {
            form.read.schema = (form.read.schema as SchemaType[]).map(
                (item) => {
                    return `${item.name} ${item.type}`;
                },
            );
        }
    }

    public processFetchOrderControl(formGroup: FormGroup): void {
        const form = formGroup.value;
        if (form.fetch.order && form.fetch.order === "none") {
            delete form.fetch.order;
        }
    }
}
