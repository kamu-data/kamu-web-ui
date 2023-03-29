/* eslint-disable @typescript-eslint/unbound-method */
import { FormArray, FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ChangeDetectionStrategy, Component, Input } from "@angular/core";

@Component({
    selector: "app-array-keys-field",
    templateUrl: "./array-keys-field.component.html",
    styleUrls: ["./array-keys-field.component.sass"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ArrayKeysFieldComponent {
    @Input() form: FormGroup;

    constructor(private fb: FormBuilder) {}

    public get primaryKey(): FormArray {
        return this.form.get("primaryKey") as FormArray;
    }

    public addPrimaryKey(): void {
        this.primaryKey.push(this.fb.control("", [Validators.required]));
    }

    public removePrimaryKey(index: number): void {
        this.primaryKey.removeAt(index);
    }
}
