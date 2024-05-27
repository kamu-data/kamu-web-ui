import { RxwebValidators } from "@rxweb/reactive-form-validators";
import { ChangeDetectionStrategy, Component, Input } from "@angular/core";
import { FormBuilder, FormArray, FormGroup } from "@angular/forms";
import { BaseField } from "../base-field";
import { MqttQos } from "src/app/api/kamu.graphql.interface";

@Component({
    selector: "app-topics-field",
    templateUrl: "./topics-field.component.html",
    styleUrls: ["./topics-field.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TopicsFieldComponent extends BaseField {
    @Input() public buttonText: string;
    @Input() public requiredField?: boolean;
    public readonly MqttQos: typeof MqttQos = MqttQos;

    constructor(private fb: FormBuilder) {
        super();
    }

    public get items(): FormArray {
        return this.form.get(this.controlName) as FormArray;
    }

    public get keyValueForm(): FormGroup {
        return this.fb.group({
            path: this.fb.control("", RxwebValidators.required()),
            qos: this.fb.control(""),
        });
    }

    public addItem(): void {
        this.items.push(this.keyValueForm);
    }

    public removeItem(index: number): void {
        this.items.removeAt(index);
    }
}
