import { Directive, Input } from "@angular/core";
import { FormGroup } from "@angular/forms";

@Directive()
export abstract class BaseField {
    @Input() public form: FormGroup;
    @Input() public controlName: string;
    @Input() public label: string;
    @Input() public dataTestId?: string;
}
