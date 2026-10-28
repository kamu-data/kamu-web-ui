/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { ChangeDetectionStrategy, Component, Input } from "@angular/core";
import { FormGroup, ReactiveFormsModule } from "@angular/forms";
import { MatIconModule } from "@angular/material/icon";

import { NgbTooltip, NgbTooltipConfig } from "@ng-bootstrap/ng-bootstrap";

import AppValues from "@common/values/app.values";

import { RadioControlType } from "src/app/dataset-view/additional-components/metadata-component/components/source-events/add-polling-source/form-control.source";

@Component({
    selector: "app-select-kind-field",
    templateUrl: "./select-kind-field.component.html",
    styleUrls: ["./select-kind-field.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [NgbTooltipConfig],
    imports: [
        //-----//
        ReactiveFormsModule,
        //-----//
        MatIconModule,
        NgbTooltip,
    ],
})
export class SelectKindFieldComponent {
    @Input({ required: true }) public form: FormGroup;
    @Input({ required: true }) public data: RadioControlType[];
    public openDelay: number = AppValues.SHORT_DELAY_MS;
}
