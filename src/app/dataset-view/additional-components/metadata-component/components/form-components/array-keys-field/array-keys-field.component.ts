import { FormArray, FormBuilder, Validators } from "@angular/forms";
import { ChangeDetectionStrategy, Component, Input } from "@angular/core";
import { BaseField } from "../base-field";

@Component({
    selector: "app-array-keys-field",
    templateUrl: "./array-keys-field.component.html",
    styleUrls: ["./array-keys-field.component.sass"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ArrayKeysFieldComponent extends BaseField {
    @Input() public buttonText: string;
    @Input() public placeholder: string;

    constructor(private fb: FormBuilder) {
        super();
    }

    public get items(): FormArray {
        return this.form.get(this.controlName) as FormArray;
    }

    public addPrimaryKey(): void {
        // eslint-disable-next-line @typescript-eslint/unbound-method
        this.items.push(this.fb.control("", [Validators.required]));
    }

    public removePrimaryKey(index: number): void {
        this.items.removeAt(index);
    }
}
