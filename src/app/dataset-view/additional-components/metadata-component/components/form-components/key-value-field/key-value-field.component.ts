import { FormArray, FormBuilder, FormGroup } from "@angular/forms";
import { ChangeDetectionStrategy, Component, Input } from "@angular/core";
import { BaseField } from "../base-field";

@Component({
    selector: "app-key-value-field",
    templateUrl: "./key-value-field.component.html",
    styleUrls: ["./key-value-field.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class KeyValueFieldComponent extends BaseField {
    @Input({ required: true }) public buttonText: string;

    constructor(private fb: FormBuilder) {
        super();
    }

    public get items(): FormArray {
        return this.form.get(this.controlName) as FormArray;
    }

    public get keyValueForm(): FormGroup {
        return this.fb.group({
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
