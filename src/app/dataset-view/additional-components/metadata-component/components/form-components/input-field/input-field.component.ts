import { ChangeDetectionStrategy, Component, Input } from "@angular/core";
import { FormGroup } from "@angular/forms";

@Component({
    selector: "app-input-field",
    templateUrl: "./input-field.component.html",
    styleUrls: ["./input-field.component.sass"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InputFieldComponent {
    @Input() form: FormGroup;
    @Input() controlName: string;
    @Input() label: string;
    @Input() requiredField?: boolean;
    @Input() placeholder?: string;
    @Input() id?: string;
    @Input() dataTestId?: string;
}
