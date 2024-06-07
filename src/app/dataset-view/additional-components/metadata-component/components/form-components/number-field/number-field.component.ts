import { ChangeDetectionStrategy, Component, Input } from "@angular/core";
import { BaseField } from "../base-field";

@Component({
    selector: "app-number-field",
    templateUrl: "./number-field.component.html",
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NumberFieldComponent extends BaseField {
    @Input() public value: string;
    @Input() public placeholder?: string;
    @Input() public requiredField?: boolean;
}
