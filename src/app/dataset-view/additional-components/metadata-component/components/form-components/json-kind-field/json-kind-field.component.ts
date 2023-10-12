import { ChangeDetectionStrategy, Component, Input, OnInit } from "@angular/core";
import { BaseField } from "../base-field";
import { FormControl } from "@angular/forms";
import { ReadKind } from "../../add-polling-source/add-polling-source-form.types";
import { RadioControlType } from "../../add-polling-source/form-control.source";
import { SetPollingSourceToolipsTexts } from "src/app/common/tooltips/tooltips.text";

@Component({
    selector: "app-json-kind-field",
    templateUrl: "./json-kind-field.component.html",
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class JsonKindFieldComponent extends BaseField implements OnInit {
    @Input() public data: RadioControlType[];
    public currentJsonKind: ReadKind;
    public readKind: typeof ReadKind = ReadKind;
    public readonly TOOLTIP_SUB_PATH = SetPollingSourceToolipsTexts.SUB_PATH;
    public readonly READ_SUB_PATH_CONTROL = "subPath";
    public readonly READ_SUB_PATH_TOOLTIP = "Path";
    public readonly READ_SUB_PATH_PLACEHOLDER = "Enter path to data file...";

    ngOnInit(): void {
        this.currentJsonKind = this.form.get("jsonKind")?.value as ReadKind;
        this.form.addControl("subPath", new FormControl(""));
        const subscription = this.form.get("jsonKind")?.valueChanges.subscribe((kind: ReadKind) => {
            this.currentJsonKind = kind;
        });
        if (subscription) this.trackSubscription(subscription);
    }
}
