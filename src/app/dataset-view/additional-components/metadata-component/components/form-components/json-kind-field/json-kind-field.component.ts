import { ChangeDetectionStrategy, Component, Input, OnInit } from "@angular/core";
import { BaseField } from "../base-field";
import { FormControl } from "@angular/forms";
import { ReadFormatControlType, ReadKind } from "../../source-events/add-polling-source/add-polling-source-form.types";
import { SourcesTooltipsTexts } from "src/app/common/tooltips/sources.text";

@Component({
    selector: "app-json-kind-field",
    templateUrl: "./json-kind-field.component.html",
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class JsonKindFieldComponent extends BaseField implements OnInit {
    @Input() public controlDescriptors: ReadFormatControlType[];
    public ReadKind: typeof ReadKind = ReadKind;
    public readonly TOOLTIP_SUB_PATH = SourcesTooltipsTexts.SUB_PATH;
    public readonly READ_SUB_PATH_CONTROL = "subPath";
    public readonly READ_SUB_PATH_TOOLTIP = "Path";
    public readonly READ_SUB_PATH_PLACEHOLDER = "Enter path to data file...";
    public readonly READ_JSON_KIND_CONTROL = "jsonKind";

    ngOnInit(): void {
        this.form.addControl(this.READ_SUB_PATH_CONTROL, new FormControl(""));
    }

    public get currentJsonKind(): ReadKind {
        return this.form.get(this.READ_JSON_KIND_CONTROL)?.value as ReadKind;
    }
}
