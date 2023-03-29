import { ChangeDetectionStrategy, Component, Input } from "@angular/core";
import { FormGroup } from "@angular/forms";

@Component({
    selector: "app-checkbox-field",
    templateUrl: "./checkbox-field.component.html",
    styleUrls: ["./checkbox-field.component.sass"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CheckboxFieldComponent {
    @Input() form: FormGroup;
    @Input() controlName: string;
    @Input() label: string;
    @Input() dataTestId?: string;
}
