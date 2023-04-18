import { ChangeDetectionStrategy, Component, OnInit } from "@angular/core";
import { BaseField } from "../base-field";
import { FormControl } from "@angular/forms";

@Component({
    selector: "app-order-field",
    templateUrl: "./order-field.component.html",
    styleUrls: ["./order-field.component.sass"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrderFieldComponent extends BaseField implements OnInit {
    ngOnInit(): void {
        this.form.addControl("order", new FormControl("none"));
    }
}
