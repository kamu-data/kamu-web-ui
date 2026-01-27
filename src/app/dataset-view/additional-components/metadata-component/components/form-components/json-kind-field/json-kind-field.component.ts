/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { ChangeDetectionStrategy, Component, Input, OnInit } from "@angular/core";
import { BaseField } from "../base-field";
import { FormControl, FormsModule, ReactiveFormsModule } from "@angular/forms";
import { ReadFormatControlType, ReadKind } from "../../source-events/add-polling-source/add-polling-source-form.types";
import { SourcesTooltipsTexts } from "src/app/common/tooltips/sources.text";
import { InputFieldComponent } from "../input-field/input-field.component";
import { NgFor, NgIf } from "@angular/common";
import { TooltipIconComponent } from "../../../../../../common/components/tooltip-icon/tooltip-icon.component";
import { RxReactiveFormsModule } from "@rxweb/reactive-form-validators";

@Component({
    selector: "app-json-kind-field",
    templateUrl: "./json-kind-field.component.html",
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [
        //-----//
        NgFor,
        NgIf,
        FormsModule,
        ReactiveFormsModule,
        //-----//
        RxReactiveFormsModule,
        //-----//
        TooltipIconComponent,
        InputFieldComponent,
    ]
})
export class JsonKindFieldComponent extends BaseField implements OnInit {
    @Input({ required: true }) public controlDescriptors: ReadFormatControlType[];
    public ReadKind: typeof ReadKind = ReadKind;
    public readonly TOOLTIP_SUB_PATH = SourcesTooltipsTexts.SUB_PATH;
    public readonly READ_SUB_PATH_CONTROL = "subPath";
    public readonly READ_SUB_PATH_TOOLTIP = "Path";
    public readonly READ_SUB_PATH_PLACEHOLDER = "Enter path to data file...";
    public readonly READ_JSON_KIND_CONTROL = "jsonKind";

    public ngOnInit(): void {
        this.form.addControl(this.READ_SUB_PATH_CONTROL, new FormControl(""));
    }

    public get currentJsonKind(): ReadKind {
        return this.form.get(this.READ_JSON_KIND_CONTROL)?.value as ReadKind;
    }
}
