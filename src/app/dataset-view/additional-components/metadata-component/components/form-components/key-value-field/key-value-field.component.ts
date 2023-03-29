import { FormArray, FormBuilder, FormGroup } from "@angular/forms";
import { ChangeDetectionStrategy, Component, Input } from "@angular/core";

@Component({
    selector: "app-key-value-field",
    templateUrl: "./key-value-field.component.html",
    styleUrls: ["./key-value-field.component.sass"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class KeyValueFieldComponent {
    @Input() public form: FormGroup;
    @Input() public formArrayName: string;
    @Input() public label: string;
    @Input() public buttonText: string;

    constructor(private fb: FormBuilder) {}

    public get items(): FormArray {
        return this.form.get(this.formArrayName) as FormArray;
    }

    public get keyValueForm(): FormGroup {
        return this.fb.group({
            name: [null],
            value: [null],
        });
    }

    public addItem(): void {
        this.items.push(this.keyValueForm);
    }

    public removeItem(index: number): void {
        this.items.removeAt(index);
    }
}
