import { ChangeDetectionStrategy, Component, OnInit } from "@angular/core";
import { BaseField } from "../base-field";
import { FormControl } from "@angular/forms";
import { ORDER_RADIO_CONTROL } from "./order-field.types";
import { SourceOrder } from "../../source-events/add-polling-source/process-form.service.types";

@Component({
    selector: "app-order-field",
    templateUrl: "./order-field.component.html",
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrderFieldComponent extends BaseField implements OnInit {
    public readonly ORDER_RADIO_CONTROL = ORDER_RADIO_CONTROL;
    ngOnInit(): void {
        this.form.addControl("order", new FormControl(SourceOrder.NONE));
    }
}
