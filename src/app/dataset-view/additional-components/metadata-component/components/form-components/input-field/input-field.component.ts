import { FormGroup } from "@angular/forms";
import { ChangeDetectionStrategy, Component, Input } from "@angular/core";

@Component({
    selector: "app-input-field",
    templateUrl: "./input-field.component.html",
    styleUrls: ["./input-field.component.sass"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InputFieldComponent {
    @Input() form: FormGroup;
    @Input() controlName: string;
    @Input() label: string | null;
    @Input() value: string | null;
    @Input() placeholder?: string;
    @Input() requiredField?: boolean;
    @Input() id?: string;
    @Input() dataTestId?: string;
}
