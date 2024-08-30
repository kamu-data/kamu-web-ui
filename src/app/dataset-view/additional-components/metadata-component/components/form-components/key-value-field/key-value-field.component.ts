import { FormArray, FormBuilder, FormGroup } from "@angular/forms";
import { ChangeDetectionStrategy, Component, inject, Input } from "@angular/core";
import { BaseField } from "../base-field";
import { KeyValueForm } from "./key-value-field.types";

@Component({
    selector: "app-key-value-field",
    templateUrl: "./key-value-field.component.html",
    styleUrls: ["./key-value-field.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class KeyValueFieldComponent extends BaseField {
    @Input({ required: true }) public buttonText: string;

    private fb = inject(FormBuilder);

    public get items(): FormArray {
        return this.form.get(this.controlName) as FormArray;
    }

    public get keyValueForm(): FormGroup<KeyValueForm> {
        return this.fb.group<KeyValueForm>({
            name: this.fb.control(""),
            value: this.fb.control(""),
        });
    }

    public addItem(): void {
        this.items.push(this.keyValueForm);
    }

    public removeItem(index: number): void {
        this.items.removeAt(index);
    }
}
