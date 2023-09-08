import { ChangeDetectionStrategy, Component, Input } from "@angular/core";
import { BaseField } from "../base-field";

@Component({
    selector: "app-checkbox-field",
    templateUrl: "./checkbox-field.component.html",
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CheckboxFieldComponent extends BaseField {
    @Input() checked: boolean;
}
