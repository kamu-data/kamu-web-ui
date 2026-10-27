/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { ChangeDetectionStrategy, Component } from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";

import { RxReactiveFormsModule } from "@rxweb/reactive-form-validators";

import { TooltipIconComponent } from "@common/components/tooltip-icon/tooltip-icon.component";

import { BaseField } from "src/app/dataset-view/additional-components/metadata-component/components/form-components/base-field";
import { ORDER_RADIO_CONTROL } from "src/app/dataset-view/additional-components/metadata-component/components/form-components/order-field/order-field.types";

@Component({
    selector: "app-order-field",
    templateUrl: "./order-field.component.html",
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [
        //-----//
        ReactiveFormsModule,
        //-----//
        RxReactiveFormsModule,
        //-----//
        TooltipIconComponent,
    ],
})
export class OrderFieldComponent extends BaseField {
    public readonly ORDER_RADIO_CONTROL = ORDER_RADIO_CONTROL;
}
