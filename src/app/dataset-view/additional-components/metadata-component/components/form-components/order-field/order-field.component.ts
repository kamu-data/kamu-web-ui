/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { NgFor } from "@angular/common";
import { ChangeDetectionStrategy, Component, OnInit } from "@angular/core";
import { FormControl, FormsModule, ReactiveFormsModule } from "@angular/forms";

import { RxReactiveFormsModule } from "@rxweb/reactive-form-validators";
import { BaseField } from "src/app/dataset-view/additional-components/metadata-component/components/form-components/base-field";
import { ORDER_RADIO_CONTROL } from "src/app/dataset-view/additional-components/metadata-component/components/form-components/order-field/order-field.types";
import { SourceOrder } from "src/app/dataset-view/additional-components/metadata-component/components/source-events/add-polling-source/process-form.service.types";

import { TooltipIconComponent } from "@common/components/tooltip-icon/tooltip-icon.component";

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
    ],
})
export class OrderFieldComponent extends BaseField implements OnInit {
    public readonly ORDER_RADIO_CONTROL = ORDER_RADIO_CONTROL;
    public ngOnInit(): void {
        this.form.addControl("order", new FormControl(SourceOrder.NONE));
    }
}
