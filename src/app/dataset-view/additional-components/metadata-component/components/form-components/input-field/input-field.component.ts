import { ChangeDetectionStrategy, Component, Input } from "@angular/core";
import { BaseField } from "../base-field";

@Component({
    selector: "app-input-field",
    templateUrl: "./input-field.component.html",
    styleUrls: ["./input-field.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InputFieldComponent extends BaseField {
    @Input() public value: string;
    @Input() public placeholder?: string;
    @Input() public requiredField?: boolean;
}
