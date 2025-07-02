/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { FormGroup, FormsModule, ReactiveFormsModule } from "@angular/forms";
import { RadioControlType } from "../../source-events/add-polling-source/form-control.source";
import { ChangeDetectionStrategy, Component, Input } from "@angular/core";
import { NgbTooltipConfig, NgbTooltip } from "@ng-bootstrap/ng-bootstrap";
import AppValues from "src/app/common/values/app.values";
import { MatIconModule } from "@angular/material/icon";
import { NgFor } from "@angular/common";
import { RxReactiveFormsModule } from "@rxweb/reactive-form-validators";

@Component({
    selector: "app-select-kind-field",
    templateUrl: "./select-kind-field.component.html",
    styleUrls: ["./select-kind-field.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [NgbTooltipConfig],
    standalone: true,
    imports: [
        //-----//
        FormsModule,
        NgFor,
        ReactiveFormsModule,

        //-----//
        MatIconModule,
        NgbTooltip,
        RxReactiveFormsModule,
    ],
})
export class SelectKindFieldComponent {
    @Input({ required: true }) public form: FormGroup;
    @Input({ required: true }) public data: RadioControlType[];
    public openDelay: number = AppValues.SHORT_DELAY_MS;
}
