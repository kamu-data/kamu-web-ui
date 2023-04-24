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
    private readonly CONTROL_CACHE = "cache";

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
                this.CONTROL_CACHE,
                this.fb.group({
                    kind: "forever",
                }),
            );
            return;
        }
        this.form.removeControl(this.CONTROL_CACHE);
    }

    private initField(): void {
        if (!this.form.get(this.CONTROL_CACHE)?.value) {
            this.form.removeControl(this.CONTROL_CACHE);
        } else {
            this.isCache = true;
        }
    }
}
