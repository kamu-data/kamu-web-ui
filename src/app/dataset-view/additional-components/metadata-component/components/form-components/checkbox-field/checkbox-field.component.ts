import { ChangeDetectionStrategy, Component, Input } from "@angular/core";
import { BaseField } from "../base-field";

@Component({
    selector: "app-checkbox-field",
    templateUrl: "./checkbox-field.component.html",
    styleUrls: ["./checkbox-field.component.sass"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CheckboxFieldComponent extends BaseField {
    @Input() checked: string;
}
