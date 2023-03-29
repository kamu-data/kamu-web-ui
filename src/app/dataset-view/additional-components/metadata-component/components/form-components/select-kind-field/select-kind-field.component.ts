import { FormGroup } from "@angular/forms";
import { RadioControlType } from "./../../add-polling-source/form-control.source";
import { ChangeDetectionStrategy, Component, Input } from "@angular/core";

@Component({
    selector: "app-select-kind-field",
    templateUrl: "./select-kind-field.component.html",
    styleUrls: ["./select-kind-field.component.sass"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SelectKindFieldComponent {
    @Input() public form: FormGroup;
    @Input() public data: RadioControlType[];
}
