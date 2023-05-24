import {
    ChangeDetectionStrategy,
    Component,
    Input,
    OnInit,
} from "@angular/core";
import { FormBuilder } from "@angular/forms";
import { BaseField } from "../base-field";

@Component({
    selector: "app-cache-field",
    templateUrl: "./cache-field.component.html",
    styleUrls: ["./cache-field.component.sass"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CacheFieldComponent extends BaseField {
    constructor(private fb: FormBuilder) {
        super();
    }

    public onCheckedCache(event: Event) {
        const input = event.target as HTMLInputElement;
        if (input.checked) {
            this.form.addControl(this.controlName, this.fb.control(true));
        } else {
            this.form.removeControl(this.controlName);
        }
    }
}
