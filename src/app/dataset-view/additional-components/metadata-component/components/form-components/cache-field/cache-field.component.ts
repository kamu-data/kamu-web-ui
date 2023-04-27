import { ChangeDetectionStrategy, Component, OnInit } from "@angular/core";
import { FormBuilder } from "@angular/forms";
import { BaseField } from "../base-field";

@Component({
    selector: "app-cache-field",
    templateUrl: "./cache-field.component.html",
    styleUrls: ["./cache-field.component.sass"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CacheFieldComponent extends BaseField implements OnInit {
    public isCache = false;

    constructor(private fb: FormBuilder) {
        super();
    }

    ngOnInit(): void {
        this.initField();
    }

    public onCheckedCache(event: Event) {
        const input = event.target as HTMLInputElement;
        if (input.checked) {
            this.form.addControl(
                this.controlName,
                this.fb.group({
                    kind: "forever",
                }),
            );
            return;
        }
        this.form.removeControl(this.controlName);
    }

    private initField(): void {
        if (!this.form.get(this.controlName)?.value) {
            this.form.removeControl(this.controlName);
        } else {
            this.isCache = true;
        }
    }
}
