/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { ChangeDetectionStrategy, Component, OnInit } from "@angular/core";
import { BaseField } from "../base-field";
import { FormControl, FormsModule, ReactiveFormsModule } from "@angular/forms";
import { ORDER_RADIO_CONTROL } from "./order-field.types";
import { SourceOrder } from "../../source-events/add-polling-source/process-form.service.types";
import { NgFor } from "@angular/common";
import { TooltipIconComponent } from "../../../../../../common/components/tooltip-icon/tooltip-icon.component";
import { RxReactiveFormsModule } from "@rxweb/reactive-form-validators";

@Component({
    selector: "app-order-field",
    templateUrl: "./order-field.component.html",
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [
        //-----//
        NgFor,
        FormsModule,
        ReactiveFormsModule,
        //-----//
        RxReactiveFormsModule,
        //-----//
        TooltipIconComponent,
    ]
})
export class OrderFieldComponent extends BaseField implements OnInit {
    public readonly ORDER_RADIO_CONTROL = ORDER_RADIO_CONTROL;
    public ngOnInit(): void {
        this.form.addControl("order", new FormControl(SourceOrder.NONE));
    }
}
