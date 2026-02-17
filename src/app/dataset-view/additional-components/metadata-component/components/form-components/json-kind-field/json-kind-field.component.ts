/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { NgFor, NgIf } from "@angular/common";
import { ChangeDetectionStrategy, Component, Input, OnInit } from "@angular/core";
import { FormControl, FormsModule, ReactiveFormsModule } from "@angular/forms";

import { RxReactiveFormsModule } from "@rxweb/reactive-form-validators";
import { BaseField } from "src/app/dataset-view/additional-components/metadata-component/components/form-components/base-field";
import { InputFieldComponent } from "src/app/dataset-view/additional-components/metadata-component/components/form-components/input-field/input-field.component";
import {
    ReadFormatControlType,
    ReadKind,
} from "src/app/dataset-view/additional-components/metadata-component/components/source-events/add-polling-source/add-polling-source-form.types";

import { TooltipIconComponent } from "@common/components/tooltip-icon/tooltip-icon.component";
import { SourcesTooltipsTexts } from "@common/tooltips/sources.text";

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
    ],
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
